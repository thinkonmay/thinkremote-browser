import { Fullscreen, Key  } from "@mui/icons-material";
import SportsEsportsOutlinedIcon from '@mui/icons-material/SportsEsportsOutlined';
import MouseOutlinedIcon from '@mui/icons-material/MouseOutlined';
import VideoSettingsOutlinedIcon from '@mui/icons-material/VideoSettingsOutlined';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import { List, SpeedDial, SpeedDialAction } from "@mui/material";
import ListIcon from '@mui/icons-material/List';
import React, { useEffect, useState } from "react"; // we need this to make JSX compile
import { WebRTCClient } from "webrtc-streaming-core";
import { getOS , Platform} from "webrtc-streaming-core/dist/utils/platform";
import { AskSelectBitrate, TurnOnClipboard } from "../popup/popup";
import { VirtualGamepad } from "../virtGamepad/virtGamepad";
import { VirtualMouse } from "../virtMouse/virtMouse";


export type ButtonMode = "static" | "draggable" | "disable";

export const WebRTCControl = (input: { 
	    GamepadACallback: (x: number, y: number,type: 'left' | 'right') => Promise<void>,
	    GamepadBCallback: (index: number,type: 'up' | 'down') => Promise<void>,
        MouseMoveCallback: (x: number, y: number) => Promise<void>,
        MouseButtonCallback: (index: number,type: 'up' | 'down' ) => Promise<void>,
        keystuckCallback: () => Promise<void>, 
        clipboardSetCallback: (val: string) => Promise<void>, 

        bitrate_callback: (bitrate: number) => Promise<void>, 
        toggle_mouse_touch_callback: (enable: boolean) => Promise<void>, 
        platform: Platform}) => {
    const [enableVGamepad, setenableVGamepad] = useState<ButtonMode>("disable");
    const [enableVMouse, setenableVMouse] = useState<ButtonMode>("disable");
    const [actions,setactions] = useState<any[]>([]);

    useEffect(()  => {
        input.toggle_mouse_touch_callback((enableVGamepad == 'disable') && (enableVMouse == 'disable'));
    },[enableVGamepad,enableVMouse])

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
                    await input.bitrate_callback(bitrate); // don't touch async await here, you'll regret that
                },
            },
            {
                icon: <SportsEsportsOutlinedIcon />,
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
                        } });
                },
            }, {
                icon: <MouseOutlinedIcon />,
                name: "Enable VMouse",
                action: () => {
                    setenableVMouse((prev) => { 
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
                icon: <KeyboardIcon/>,
                name: "Write to clipboard",
                action: async () => {
                    const text = await TurnOnClipboard()
                    await input.clipboardSetCallback(text)
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
                    await input.bitrate_callback(bitrate);
                } catch {}},
            }, {
                icon: <Fullscreen />,
                name: "Enter fullscreen",
                action: () => { document.documentElement.requestFullscreen() }
            }, {
                icon: <KeyboardIcon />,
                name: "If some of your key is stuck",
                action: () => { input.keystuckCallback() },
            }])
        }
    },[input.platform])

    













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
                        '& .MuiFab-primary': { backgroundColor: 'white', color: 'white' } 
                    }}
                    icon={<ListIcon sx={{color: 'black'}}/>}
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
                MouseMoveCallback={input.MouseMoveCallback} 
                MouseButtonCallback={input.MouseButtonCallback} 
                draggable={enableVMouse}/>

            <VirtualGamepad 
                ButtonCallback={input.GamepadBCallback} 
                AxisCallback={input.GamepadACallback} 
                draggable={enableVGamepad}/>
        </div>
    );
};
