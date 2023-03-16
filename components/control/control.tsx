import { Fullscreen, Key } from "@mui/icons-material";
import SportsEsportsOutlinedIcon from '@mui/icons-material/SportsEsportsOutlined';
import MouseOutlinedIcon from '@mui/icons-material/MouseOutlined';
import VideoSettingsOutlinedIcon from '@mui/icons-material/VideoSettingsOutlined';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import { List, SpeedDial, SpeedDialAction } from "@mui/material";
import ListIcon from '@mui/icons-material/List';
import React, { useEffect, useState, useLayoutEffect } from "react"; // we need this to make JSX compile
import { Platform } from "webrtc-streaming-core/dist/utils/platform";
import { requestFullscreen } from "webrtc-streaming-core/dist/utils/screen";
import { AskSelectBitrate, TurnOnClipboard } from "../popup/popup";
import { VirtualGamepad } from "../virtGamepad/virtGamepad";
import { VirtualMouse } from "../virtMouse/virtMouse";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";


export type ButtonMode = "static" | "draggable" | "disable";

export const WebRTCControl = (input: {
	GamepadACallback: (x: number, y: number, type: 'left' | 'right') => Promise<void>,
	GamepadBCallback: (index: number, type: 'up' | 'down') => Promise<void>,
	MouseMoveCallback: (x: number, y: number) => Promise<void>,
	MouseButtonCallback: (index: number, type: 'up' | 'down') => Promise<void>,
	keystuckCallback: () => Promise<void>,
	clipboardSetCallback: (val: string) => Promise<void>,

	bitrate_callback: (bitrate: number) => Promise<void>,
	toggle_mouse_touch_callback: (enable: boolean) => Promise<void>,
	platform: Platform
}) => {
	const [enableVGamepad, setenableVGamepad] = useState<ButtonMode>("disable");
	const [enableVMouse, setenableVMouse] = useState<ButtonMode>("disable");
	const [actions, setactions] = useState<any[]>([]);

	useEffect(() => {
		input.toggle_mouse_touch_callback((enableVGamepad == 'disable') && (enableVMouse == 'disable'));
	}, [enableVGamepad, enableVMouse])

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
				icon: <KeyboardIcon />,
				name: "Write to clipboard",
				action: async () => {
					const text = await TurnOnClipboard()
					await input.clipboardSetCallback(text)
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
				icon: <KeyboardIcon />,
				name: "If some of your key is stuck",
				action: () => { input.keystuckCallback() },
			}])
		}
	}, [input.platform])









	const [posBtn, setPosBtn] = useState({ x: 0, y: 0 });
	const [isControlDragable, setControlDragable] = useState(false)
	useEffect(() => {
		const heightContent = document.querySelector('.containerDrag')
		console.log(heightContent);
		const defaultX = window.innerWidth - (window.innerWidth * 10 / 100)
		const defaultY = (window.innerHeight - heightContent.clientHeight) - (window.innerHeight * 20 / 100)
		let cache = localStorage.getItem(`control_pos`);
		const { x, y } = JSON.parse(
			cache != null ? cache : `{"x": ${defaultX}, "y" : ${defaultY}}`
		);
		if (x == null || y == null) {
			return;
		}

		console.log(`get ${x} ${y} from storage`);
		setPosBtn({ x: x, y: y });
	}, [actions]);
	const handleDrag = (e: DraggableEvent, data: DraggableData) => {

		//console.log(data, 'data');
		setPosBtn({
			x: data.x,
			y: data.y,
		});
	};

	const handleStop = (e: DraggableEvent, data: DraggableData) => {
		const { x, y } = posBtn;
		if (x == null || y == null) {
			return;
		}

		localStorage.setItem(`control_pos`, JSON.stringify(posBtn));
		console.log(`set ${x} ${y} to storage`);
	};

	let touchTime: number = 0
	const toggleControl = (e) => {

		e.preventDefault
		if (touchTime == 0) {
			touchTime = new Date().getTime();
		} else {
			if (((new Date().getTime()) - touchTime) < 800) {
				console.log("double clicked");
				setControlDragable(prev => !prev)
				touchTime = 0;
			} else {
				touchTime = new Date().getTime();
			}
		}
	}

	return (
		<div>
			<Draggable
				position={{ x: posBtn.x, y: posBtn.y }}
				onStop={handleStop}
				onDrag={handleDrag}
				disabled={!isControlDragable}
			>
				<div onDoubleClick={()=>{setControlDragable(prev => !prev)}} onTouchEndCapture={toggleControl} className="containerDrag" style={{ maxWidth: 'max-content', maxHeight: 'max-content' }}>
					<SpeedDial
						ariaLabel="SpeedDial basic example"
						sx={{
							opacity: 0.7,
							'& .MuiFab-primary': { backgroundColor: 'white', color: 'white' }
						}}
						icon={<ListIcon sx={{ color: 'black' }} />}
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
			</Draggable>

			<VirtualMouse
				MouseMoveCallback={input.MouseMoveCallback}
				MouseButtonCallback={input.MouseButtonCallback}
				draggable={enableVMouse} />

			<VirtualGamepad
				ButtonCallback={input.GamepadBCallback}
				AxisCallback={input.GamepadACallback}
				draggable={enableVGamepad} />
		</div>
	);
};