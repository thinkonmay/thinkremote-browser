"use client"

import { Fullscreen, Key, VolumeUp } from "@mui/icons-material";
import SportsEsportsOutlinedIcon from '@mui/icons-material/SportsEsportsOutlined';
import MouseOutlinedIcon from '@mui/icons-material/MouseOutlined';
import VideoSettingsOutlinedIcon from '@mui/icons-material/VideoSettingsOutlined';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import { List, SpeedDial, SpeedDialAction } from "@mui/material";
import ListIcon from '@mui/icons-material/List';
import React, { useEffect, useState, useLayoutEffect, createContext } from "react"; // we need this to make JSX compile
import { Platform } from "../../core/utils/platform";
import { requestFullscreen } from "../../core/utils/screen";
import { AskSelectBitrate, TurnOnClipboard } from "../popup/popup";
import { VirtualGamepad } from "../virtGamepad/virtGamepad";
import { VirtualMouse } from "../virtMouse/virtMouse";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import MobileControl from "./mobileControl";
import SettingsIcon from '@mui/icons-material/Settings';
import DesktopControl from "./desktopControl";
import Setting from "../setting/setting";
import styled from "styled-components";


export type ButtonMode = "static" | "draggable" | "disable";

interface IControlContext {
	isSetVGamePadDefaultValue:boolean
	isSetVMouseDefaultValue:boolean
}
export const ConTrolContext = createContext<IControlContext | null>(null)


export const WebRTCControl = (input: {
	GamepadACallback: (x: number, y: number, type: 'left' | 'right') => Promise<void>,
	GamepadBCallback: (index: number, type: 'up' | 'down') => Promise<void>,
	MouseMoveCallback: (x: number, y: number) => Promise<void>,
	MouseButtonCallback: (index: number, type: 'up' | 'down') => Promise<void>,
	keystuckCallback: () => Promise<void>,
	audioCallback: () => Promise<void>,
	clipboardSetCallback: (val: string) => Promise<void>,

	bitrate_callback: (bitrate: number) => Promise<void>,
	toggle_mouse_touch_callback: (enable: boolean) => Promise<void>,
	platform: Platform
}) => {
	const [enableVGamepad, setenableVGamepad] = useState<ButtonMode>("disable");
	const [enableVMouse, setenableVMouse] = useState<ButtonMode>("disable");
	const [actions, setactions] = useState<any[]>([]);
	const [isModalSettingOpen, setModalSettingOpen] = useState(false)

	useEffect(() => {
		let enable = (enableVGamepad == 'disable') && (enableVMouse   == 'disable')
		if( enableVGamepad == 'draggable' || enableVMouse =='draggable'){
			enable = false
		}
		input.toggle_mouse_touch_callback(enable);
		
	}, [enableVGamepad, enableVMouse])

	const handleDraggable = (type: 'VGamePad' | 'VMouse', value: boolean) => {

		setModalSettingOpen(false)
		if (type === 'VGamePad') {
			setenableVGamepad("draggable")
			setenableVMouse("disable")

		} else if (type === 'VMouse') {
			setenableVMouse("draggable")
			setenableVGamepad("disable")
		}

	}


	const [defaultPos, setDefaultPos] = useState()
	const [tempPos, setTempPos] = useState()
	const [isSetVGamePadDefaultValue, setVGamePadDefaultValue] = useState(false)
	const [isSetVMouseDefaultValue, setVMouseDefaultValue] = useState(false)

	const handleOkeyDragValue = async () => {
		if (enableVGamepad === 'draggable') 
			setenableVGamepad('static')
		else if (enableVMouse === 'draggable') 
			setenableVMouse('static')
	}

	const handleSetDeafaultDragValue = async () => {
		if(enableVGamepad ==='draggable')
			setVGamePadDefaultValue(true)
		else if(enableVMouse ==='draggable')
			setVMouseDefaultValue(true)
		
	}
	//reset per/click default
	useEffect(()=>{
		setVGamePadDefaultValue(false)
		setVMouseDefaultValue(false)
	}, [isSetVGamePadDefaultValue, isSetVMouseDefaultValue])

	useEffect(() => {
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

					setenableVMouse('disable')
					setenableVGamepad((prev) => {
						switch (prev) {
							case "disable":
								return "static";
							case "static":
								return "disable";
						}
					});
				},
			}, {
				icon: <MouseOutlinedIcon />,
				name: "Enable VMouse",
				action: () => {
					setenableVGamepad('disable')
					setenableVMouse((prev) => {
						switch (prev) {
							case "disable":
								return "static";
							case "static":
								return "disable";
						}
					});

				},
			}, {
				icon: <VolumeUp />,
				name: "If your audio is muted",
				action: () => { input.audioCallback() },
			}, {
				icon: <KeyboardIcon />,
				name: "Write to clipboard",
				action: async () => {
					const text = await TurnOnClipboard()
					await input.clipboardSetCallback(text)
				},
			}, {
				icon: <SettingsIcon />,
				name: "Setting",
				action: () => {
					setModalSettingOpen(true)
				},
			}])
		} else {
			setactions([{
				icon: <VideoSettingsOutlinedIcon />,
				name: "Bitrate",
				action: async () => {
					try {
						let bitrate = await AskSelectBitrate();
						if (bitrate < 500) {
							return;
						}
						console.log(`bitrate is change to ${bitrate}`);
						await input.bitrate_callback(bitrate);
					} catch { }
				},
			}, {
				icon: <Fullscreen />,
				name: "Enter fullscreen",
				action: () => { requestFullscreen() }
			}, {
				icon: <VolumeUp />,
				name: "If your audio is muted",
				action: () => { input.audioCallback() },
			}, {
				icon: <KeyboardIcon />,
				name: "If some of your key is stuck",
				action: () => { input.keystuckCallback() },
			}])
		}
	}, [input.platform])


	const contextValue:IControlContext = {
		isSetVGamePadDefaultValue,
		isSetVMouseDefaultValue
	}
	return (
		<ConTrolContext.Provider value={contextValue}>
			<App
                onContextMenu=	{e => e.preventDefault()}
                onMouseUp=		{e => e.preventDefault()}
                onMouseDown=	{e => e.preventDefault()}
                onKeyUp=		{e => e.preventDefault()}
                onKeyDown=		{e => e.preventDefault()}
			>
				<div
					className="containerDrag"
					style={{ maxWidth: 'max-content', maxHeight: 'max-content' }}
				>
					{
						input.platform === 'mobile' ?

							<MobileControl
								actions={actions}
								isShowBtn={enableVGamepad === 'draggable' || enableVMouse === 'draggable'}
								onOkey={handleOkeyDragValue}
								onDefault={handleSetDeafaultDragValue}
							/> : (<DesktopControl actions={actions} />)
					}
				</div>

				<VirtualMouse
					MouseMoveCallback={input.MouseMoveCallback}
					MouseButtonCallback={input.MouseButtonCallback}
					draggable={enableVMouse} />

				<VirtualGamepad
					// disable touch when dragging
					//@ts-ignore
					ButtonCallback={enableVGamepad =='draggable' ? () => {} : input.GamepadBCallback}
					//@ts-ignore
					AxisCallback={enableVGamepad =='draggable' ? () => {} : input.GamepadACallback}
					draggable={enableVGamepad}
				/>

				<Setting
					onDraggable={handleDraggable}
					isOpen={isModalSettingOpen}
					closeModal={() => { setModalSettingOpen(false) }}
				/>
			</App>
		</ConTrolContext.Provider >
	);
};



const App = styled.div`
    touch-action: none;
    position: relative;
    width: 100vw;
    height: 100vh;
`;