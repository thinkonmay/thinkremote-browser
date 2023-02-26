import { Fullscreen } from "@mui/icons-material";
import { List, SpeedDial, SpeedDialAction } from "@mui/material";
import React, { useEffect, useState } from "react"; // we need this to make JSX compile
import { WebRTCClient } from "webrtc-streaming-core";
import { getOS , Platform} from "webrtc-streaming-core/dist/utils/platform";
import { AskSelectBitrate } from "../popup/popup";
import { VirtualGamepad } from "../virtGamepad/virtGamepad";
import { VirtualMouse } from "../virtMouse/virtMouse";


export type ButtonMode = "static" | "draggable" | "disable";

function isFullscreen(): boolean {
    return document.fullscreenElement != null;
}

export const WebRTCControl = (input: { client: WebRTCClient, platform: Platform}) => {
    const [enableVGamepad, setenableVGamepad] = useState<ButtonMode>("disable");
    const [enableVMouse, setenableVMouse] = useState<ButtonMode>("disable");

    let actions = [
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
    ];


    if (input.platform == 'mobile') {
        actions = [...actions,
        {
            icon: <Fullscreen />,
            name: "Edit VGamepad",
            action: async () => {
                setenableVGamepad((prev) => {
                    switch (prev) {
                        case "disable":
                            return "draggable";
                        case "draggable":
                            return "static";
                        case "static":
                            return "disable";
                    }
                });
            },
        }, {
            icon: <Fullscreen />,
            name: "Enable VMouse",
            action: async () => {
                setenableVMouse((prev) => {
                    switch (prev) {
                        case "disable":
                            try { input.client.hid.disableMouse = true; } catch {}
                            return "draggable";
                        case "draggable":
                            return "static";
                        case "static":
                            try { input.client.hid.disableMouse = false; } catch {}
                            return "disable";
                    }
                });
            },
        } ]
    } else {
        actions = [...actions,
        {
            icon: <Fullscreen />,
            name: "Enter fullscreen",
            action: async () => {
                document.documentElement.requestFullscreen();
            },
        }]
    }
    











	const GamepadACallback = async (x: number, y: number,type: 'left' | 'right') => {
		input.client?.hid?.VirtualGamepadAxis(x,y,type);
	}
	const GamepadBCallback = async (index: number,type: 'press' | 'release') => {
		input.client?.hid?.VirtualGamepadButtonSlider(type == 'release',index);
	}

    let filter = 0;
	const MouseJTcallback = async (x: number, y: number) => { // translate cordinate
        if (filter == 20) {
            filter = 0;
            return;
        }
        input.client?.hid?.mouseMoveRel({movementX:x*5,movementY:y*5});
        filter++;
	}
	const MouseBTcallback = async (index: number,type: 'up' | 'down' ) => {
		type == 'down' ? input.client?.hid?.MouseButtonDown({button: index}) : input.client?.hid?.MouseButtonUp({button: index})
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
                    {actions.map((action) => (
                        <SpeedDialAction
                            key={action.name}
                            icon={action.icon}
                            tooltipTitle={action.name}
                            onClick={action.action}
                        />
                    ))}
                </SpeedDial>
            </div>

            <VirtualMouse
                MouseMoveCallback={MouseJTcallback} 
                MouseButtonCallback={MouseBTcallback} 
                draggable={enableVMouse}>
            </VirtualMouse> 

            <VirtualGamepad 
                ButtonCallback={GamepadBCallback} 
                AxisCallback={GamepadACallback} 
                draggable={enableVGamepad}>
            </VirtualGamepad> 
        </div>
    );
};
