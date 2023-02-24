import { Fullscreen } from "@mui/icons-material";
import { List, SpeedDial, SpeedDialAction } from "@mui/material";
import React, { useEffect, useState } from "react"; // we need this to make JSX compile
import { WebRTCClient } from "webrtc-streaming-core";
import { EventCode, HIDMsg } from "webrtc-streaming-core/dist/models/keys.model";
import { getOS } from "webrtc-streaming-core/dist/utils/platform";
import { AskSelectBitrate } from "../popup/popup";
import { VirtualGamepad } from "../virtGamepad/virtGamepad";

class TouchData {
    constructor(initial: Touch) {
        this.clientX = initial.clientX;
        this.clientY = initial.clientY;

        this.touchStart = {
            clientX: initial.clientX,
            clientY: initial.clientY,
        };
    }

    public clientX: number;
    public clientY: number;
    public readonly touchStart: {
        clientX: number;
        clientY: number;
    };
}

export type ButtonMode = "static" | "draggable" | "disable";

function isFullscreen(): boolean {
    return document.fullscreenElement != null;
}

export const WebRTCControl = (input: { client: WebRTCClient }) => {
    const [Draggable, setDraggable] = useState<ButtonMode>("disable");
    const [EnableVirtGamepad, setEnableVirtGamepad] = useState<boolean>(true);
    const [onGoingTouchs, setTouces] = useState<Map<number, TouchData>>(
        new Map<number, TouchData>()
    );

    const handleStart = (evt: TouchEvent) => {
        const touches = evt.changedTouches;
        for (let i = 0; i < touches.length; i++) {
            onGoingTouchs.set(touches[i].identifier, new TouchData(touches[i]));
        }
    };
    const handleEnd = (evt: TouchEvent) => {
        const touches = evt.changedTouches;
        for (let i = 0; i < touches.length; i++) {
            onGoingTouchs.delete(touches[i].identifier);
        }
    };

    const handleMove = async (evt: TouchEvent) => {
        const touches = evt.touches;
        for (let i = 0; i < touches.length; i++) {
            const touch = onGoingTouchs.get(touches[i].identifier);
            touch.clientX = touches[i].clientX;
            touch.clientY = touches[i].clientY;
            onGoingTouchs.set(touches[i].identifier, touch);
        }

        if (onGoingTouchs.size != 2) {
            return;
        }

        const firstFinger = onGoingTouchs.get(0);
        const secondFinger = onGoingTouchs.get(1);

        // Calculate the difference between the start and move coordinates
        const move = {
            first: firstFinger.clientX - firstFinger.touchStart.clientX,
            second: secondFinger.clientX - secondFinger.touchStart.clientX,
        };
        const distance = {
            now: firstFinger.clientX - secondFinger.clientX,
            prev:
                firstFinger.touchStart.clientX -
                secondFinger.touchStart.clientX,
        };

        // This threshold is device dependent as well as application specific
        const PINCH_THRESHOLD = document.documentElement.clientWidth / 10;

        // zoom
        if (
            !(
                Math.abs(move.first) > PINCH_THRESHOLD &&
                Math.abs(move.second) > PINCH_THRESHOLD
            )
        ) {
            return;
        }

        // zoom in
        if (
            Math.abs(distance.now) > Math.abs(distance.prev) &&
            !isFullscreen()
        ) {
            try {
                await document.documentElement.requestFullscreen();
            } catch (e) {}
            return;
        }

        // zoom out
        if (
            Math.abs(distance.now) < Math.abs(distance.prev) &&
            isFullscreen()
        ) {
            try {
                await document.exitFullscreen();
            } catch (e) {}
            return;
        }
    };

    useEffect(() => {
        setTouces(new Map<number, TouchData>());
        document.addEventListener("touchstart", handleStart);
        document.addEventListener("touchend", handleEnd);
        document.addEventListener("touchmove", handleMove);
		if (getOS() == "Android" || getOS() == "iOS") {
			setEnableVirtGamepad(true);
		}


    }, []);

    const _actions = [
        {
            icon: <Fullscreen />,
            name: "Bitrate",
            action: async () => {
                let bitrate = await AskSelectBitrate();
                if (bitrate < 500 || input.client == null) {
                    return;
                }
                console.log(`bitrate is change to ${bitrate}`);
                input.client?.ChangeBitrate(bitrate);
            },
        },
        {
            icon: <Fullscreen />,
            name: "Enter fullscreen",
            action: async () => {
                document.documentElement.requestFullscreen();
            },
        },
        {
            icon: <Fullscreen />,
            name: "Edit",
            action: async () => {
                setDraggable((prev) => {
                    switch (prev) {
                        case "disable":
                            return "draggable";
                        case "draggable":
                            input.client?.hid?.SendFunc((new HIDMsg(EventCode.GamepadConnect,{
                                gamepad_id: "0",
                            }).ToString())) 
                            return "static";
                        case "static":
                            input.client?.hid?.SendFunc((new HIDMsg(EventCode.GamepadDisconnect,{
                                gamepad_id: "0",
                            }).ToString())) 
                            return "disable";
                    }
                });
            },
        },
    ];








	const ACallback = async (x: number, y: number,type: 'left' | 'right') => {
		input.client?.hid?.VirtualGamepadAxis(x,y,type);
	}
	const BCallback = async (index: number,type: 'press' | 'release') => {
		input.client?.hid?.VirtualGamepadButtonSlider(type == 'release',index);
	}

    return (
        <div>
            <div style={{ zIndex: 2 }}>
                <SpeedDial
                    ariaLabel="SpeedDial basic example"
                    sx={{
                        opacity: 0.3,
                        position: "absolute",
                        bottom: 16,
                        right: 16,
                    }}
                    icon={<List />}
                >
                    {_actions.map((action) => (
                        <SpeedDialAction
                            key={action.name}
                            icon={action.icon}
                            tooltipTitle={action.name}
                            onClick={action.action}
                        />
                    ))}
                </SpeedDial>
            </div>
            {EnableVirtGamepad ? <VirtualGamepad ButtonCallback={BCallback} AxisCallback={ACallback} draggable={Draggable}></VirtualGamepad> : null} 
        </div>
    );
};
