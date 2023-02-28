import { Fullscreen  } from "@mui/icons-material";
import SportsEsportsOutlinedIcon from '@mui/icons-material/SportsEsportsOutlined';
import MouseOutlinedIcon from '@mui/icons-material/MouseOutlined';
import VideoSettingsOutlinedIcon from '@mui/icons-material/VideoSettingsOutlined';
import { List, SpeedDial, SpeedDialAction } from "@mui/material";
import React, { useEffect, useState } from "react"; // we need this to make JSX compile
import { WebRTCClient } from "webrtc-streaming-core";
import { getOS , Platform} from "webrtc-streaming-core/dist/utils/platform";
import { AskSelectBitrate } from "../popup/popup";
import { VirtualGamepad } from "../virtGamepad/virtGamepad";
import { VirtualMouse } from "../virtMouse/virtMouse";


export type ButtonMode = "static" | "draggable" | "disable";

export const WebRTCControl = (input: { 
        client: WebRTCClient,
        bitrate_callback: (bitrate: number) => void, 
        toggle_mouse_touch_callback: (enable: boolean) => void, platform: Platform}) => {
    const [enableVGamepad, setenableVGamepad] = useState<ButtonMode>("disable");
    const [enableVMouse, setenableVMouse] = useState<ButtonMode>("disable");
    const [actions,setactions] = useState<any[]>([]);

    useEffect(()  => {
        console.log(`configuring menu on ${input.platform}`)
        if (input.platform == 'mobile') {
            setactions([{
                icon: <VideoSettingsOutlinedIcon />,
                name: "Bitrate",
                action: async () => { 
                    let bitrate = await AskSelectBitrate();
                    if (bitrate < 500) {
                        return;
                    }
                    console.log(`bitrate is change to ${bitrate}`);
                    input.bitrate_callback(bitrate);
                },
            },
            {
                icon: <SportsEsportsOutlinedIcon />,
                name: "Edit VGamepad",
                action: async () => {
                    setenableVGamepad((prev) => { 
                        switch (prev) {
                            case "disable":
                                input.toggle_mouse_touch_callback(false);
                                return "draggable";
                            case "draggable":
                                return "static";
                            case "static":
                                input.toggle_mouse_touch_callback(true);
                                return "disable";
                        } });
                },
            }, {
                icon: <MouseOutlinedIcon />,
                name: "Enable VMouse",
                action: async () => {
                    setenableVMouse((prev) => { 
                        switch (prev) {
                            case "disable":
                                input.toggle_mouse_touch_callback(false);
                                return "draggable";
                            case "draggable":
                                return "static";
                            case "static":
                                input.toggle_mouse_touch_callback(true);
                                return "disable";
                            }
                    });
                },
            } ])
        } else {
            setactions([{
                icon: <VideoSettingsOutlinedIcon />,
                name: "Bitrate",
                action: async () => { try {
                    let bitrate = await AskSelectBitrate();
                    if (bitrate < 500) {
                        return;
                    }
                    console.log(`bitrate is change to ${bitrate}`);
                    input.bitrate_callback(bitrate);
                } catch {}},
            },
            {
                icon: <Fullscreen />,
                name: "Enter fullscreen",
                action: async () => {
                    document.documentElement.requestFullscreen();
                },
            }])
        }
    },[input.platform])

    











    let Afilter = 0;
	const GamepadACallback = async (x: number, y: number,type: 'left' | 'right') => {
        if (Afilter == 1) {
		    input.client?.hid?.VirtualGamepadAxis(x,y,type);
            Afilter = 0;
        }

        Afilter++;
	}

	const GamepadBCallback = async (index: number,type: 'up' | 'down') => {
		input.client?.hid?.VirtualGamepadButtonSlider(type == 'down',index);
	}

    let filter = 0;
	const MouseJTcallback = async (x: number, y: number) => { // translate cordinate
        if (filter == 30) {
            input.client?.hid?.mouseMoveRel({movementX:x*10,movementY:y*10});
            filter = 0;
        }

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
                draggable={enableVMouse}/>

            <VirtualGamepad 
                ButtonCallback={GamepadBCallback} 
                AxisCallback={GamepadACallback} 
                draggable={enableVGamepad}/>
        </div>
    );
};
