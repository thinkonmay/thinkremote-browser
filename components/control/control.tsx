"use client"

import { Fullscreen, LockReset, } from "@mui/icons-material";
import SportsEsportsOutlinedIcon from '@mui/icons-material/SportsEsportsOutlined';
import VideoSettingsOutlinedIcon from '@mui/icons-material/VideoSettingsOutlined';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import React, { useEffect, useState, createContext, useRef } from "react"; // we need this to make JSX compile
import { Platform } from "../../core/utils/platform";
import { requestFullscreen } from "../../core/utils/screen";
import { AskSelectBitrate } from "../popup/popup";
import { VirtualGamepad } from "../virtGamepad/virtGamepad";
import MobileControl from "./mobileControl";
import SettingsIcon from '@mui/icons-material/Settings';
import DesktopControl from "./desktopControl";
import Setting from "../setting/setting";
import { useShift } from "../../utils/formatChar";


export type ButtonMode = "static" | "draggable" | "disable";

export const ConTrolContext = createContext<{
	DefaultPosition:boolean
}| null>(null)


export const WebRTCControl = (input: {
	touch_mode_callback				: (mode: 'trackpad' | 'gamepad' | 'mouse' | 'none') 	=> Promise<void>,
	gamepad_callback_a				: (x: number, y: number, 	type: 'left' | 'right') 	=> Promise<void>,
	gamepad_callback_b				: (index: number, 			type: 'up' | 'down') 		=> Promise<void>,
	mouse_button_callback			: (index: number, 			type: 'up' | 'down') 		=> Promise<void>,
	keyboard_callback				: (key: string, 			type: 'up' | 'down') 		=> Promise<void>,
	mouse_move_callback				: (x: number, y: number) 								=> Promise<void>,
	bitrate_callback				: (bitrate: number) 									=> Promise<void>,

	gamepad_qr					    : () => Promise<void>,
	reset_callback					: () => Promise<void>,
	fullscreen_callback				: () => Promise<void>,

	show_gamepad					: boolean,
	platform						: Platform,
	video							: HTMLVideoElement
}) => {
	const [enableVGamepad, setenableVGamepad] 		= useState<ButtonMode>('disable');
	const [isModalSettingOpen, setModalSettingOpen] = useState(false)
	const [actions, setactions] 					= useState<any[]>([]);
	const [TextValue,setTextValue]       			= useState<string[]>([]);
	const [OldTextValue,setOldTextValue] 			= useState<string[]>([]);
	const [OpenControl, setOpenControl]  			= useState<boolean>(false)

	const [Clipboard,setClipboard] 					= useState<boolean>(false);
    const inputRef 									= useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (TextValue.length > OldTextValue.length) {
			for (let index = OldTextValue.length; index < TextValue.length; index++) {
				const element = TextValue[index];
				const shift = useShift(element)

				if (shift) 
					input.keyboard_callback("Shift","down")
				input.keyboard_callback(element,"down")
				input.keyboard_callback(element,"up")
				if (shift) 
					input.keyboard_callback("Shift","up")
			}
		} else {
			for (let index = 0; index < OldTextValue.length - TextValue.length; index++) {
				input.keyboard_callback("Backspace","down")
				input.keyboard_callback("Backspace","up")
			}
		}

		setOldTextValue(TextValue)
	},[TextValue])

	useEffect(() => {
		if (!Clipboard) {
			inputRef.current.blur()
			return
		}

		inputRef.current.focus()
		const read = () => { setTextValue(inputRef.current.value.split("")) }
		const interval = setInterval(read,50)
		return () => {clearInterval(interval)}
	},[Clipboard])

	useEffect(() => {
		switch (enableVGamepad) {
			case 'disable':
				input.touch_mode_callback('trackpad')
				break;
			case 'static':
				input.touch_mode_callback('gamepad')
				break;
			case 'draggable':
				input.touch_mode_callback('none')
				break;
		}
	}, [enableVGamepad])
	useEffect(() => setenableVGamepad(input.show_gamepad ? "static" : "disable"),[])

	useEffect(() => {
		if (input.platform == 'mobile')
			setactions([button.reset,button.bitrate,button.vgamepad,button.setting,button.keyboard,button.fullscreen])
		else 
			setactions([button.reset,button.bitrate,button.vgamepad,button.fullscreen])

	}, [input.platform])

	const button = {
		bitrate : {
			icon: <VideoSettingsOutlinedIcon />,
			name: "Bitrate",
			action: async () => {
				setOpenControl(false)
				const bitrate = await AskSelectBitrate();
				if (bitrate < 500 || bitrate > 20000) 
					return;
				
				await input.bitrate_callback(bitrate); // don't touch async await here, you'll regret that
			},
		},
		vgamepad : {
				icon: <SportsEsportsOutlinedIcon />,
				name: "Open Gamepad",
				action: () => {
					if (input.platform == 'desktop') {
						input.gamepad_qr()
						return
					}

					setenableVGamepad((prev) => {
						setOpenControl(false)
						switch (prev) {
							case "disable":
								return "static";
							case "static":
								return "disable";
						}
					});
				},
			},
		keyboard : {
				icon: <KeyboardIcon />,
				name: "Write to clipboard",
				action: () => { 
					setClipboard(old => {
						if (old) 
							setOpenControl(false)

						return !old
					}) 
				},
			},
		fullscreen : {
				icon: <Fullscreen />,
				name: "Enter fullscreen",
				action: () => {
					requestFullscreen()
					input.fullscreen_callback()
					setOpenControl(false)
				}
			},
		reset : {
				icon: <LockReset/>,
				name: "Reset",
				action: input.reset_callback 
			},
		setting : {
				icon: <SettingsIcon />,
				name: "Setting",
				action: () => { 
					setModalSettingOpen(true) 
				},
			}
	}






	const [DefaultPosition, setDefaultPosition] = useState(false)
	useEffect(()=>{ // disable default position after 2 second
		setTimeout(() => setDefaultPosition(false),2000)
	}, [DefaultPosition])

	return (
		<ConTrolContext.Provider value={{ DefaultPosition }}>
			<>
				<div
					className="containerDrag"
					style={{ maxWidth: 'max-content', maxHeight: 'max-content' }}
					onContextMenu=	{e => e.preventDefault()}
					onMouseUp=		{e => e.preventDefault()}
					onMouseDown=	{e => e.preventDefault()}
					onKeyUp=		{e => e.preventDefault()}
					onKeyDown=		{e => e.preventDefault()}
				>
				{
					input.platform === 'mobile' 
					?  <MobileControl
						isClose={OpenControl}
						handleOpen={() =>  setOpenControl(old => !old) }

						isShowBtn={enableVGamepad === 'draggable'}
						onOkey={async () => {
							if (enableVGamepad != 'draggable') 
								return

							setenableVGamepad('static')
						}}
						onDefault={async () => {
							if(enableVGamepad !='draggable')
								return
							
							setDefaultPosition(true)
						}}

						actions={actions}
					/> 
					: <DesktopControl 
						actions={actions} 
					/>
				}
				</div>



				<VirtualGamepad
					ButtonCallback={enableVGamepad =='draggable' 
						? async (i,t  ) => {} 
						: input.gamepad_callback_b}
					AxisCallback=  {enableVGamepad =='draggable' 
						? async (x,y,t) => {} 
						: input.gamepad_callback_a}
					draggable={enableVGamepad}
				/>

				<Setting
					onDraggable={() => {
						setModalSettingOpen(false)
						setenableVGamepad("draggable")
					}}
					isOpen={isModalSettingOpen}
					closeModal={() => setModalSettingOpen(false) }
				/>

				<input 
					ref={inputRef} 
					type="text" 
					placeholder="" 
					onBlur={() => setClipboard(false)}
					style={{opacity:"0"}}
				/>
			</>
		</ConTrolContext.Provider >
	);
};


