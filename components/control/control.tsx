import { Fullscreen } from '@mui/icons-material';
import { List, SpeedDial, SpeedDialAction } from '@mui/material';
import React, { useEffect, useState } from 'react'; // we need this to make JSX compile
import { WebRTCClient } from 'webrtc-streaming-core';
import { AskSelectBitrate } from '../popup/popup';
import { VirtualGamepad } from '../virtGamepad/virtGamepad';



export type ButtonMode = 'static' | 'draggable' | 'disable'

export const WebRTCControl = (input: {client: WebRTCClient}) =>  {
    const [Draggable,setDraggable] = useState<ButtonMode>('disable');
	const [actions, setActions] = useState<{
		icon: JSX.Element;
		name: string;
		action: () => void;
	}[] >([]);

	const _actions = [ {
		icon: <Fullscreen/>,
		name: "Bitrate",  
		action: async () => {
			let bitrate = await AskSelectBitrate();
			if (bitrate < 500 || input.client == null) {
				return
			}
			console.log(`bitrate is change to ${bitrate}`)
			input.client?.ChangeBitrate(bitrate);
		}, 
	},{
		icon: <Fullscreen />,
		name: "Enter fullscreen",
		action: async () => { document.documentElement.requestFullscreen(); }, }, {
		icon: <Fullscreen />,
		name: "Edit",
		action: async () => { setDraggable(prev => { return 'draggable'}); }, 
	},]

	useEffect(() => {
		setActions([..._actions]);
	},[])



    return  <div>
	<SpeedDial
		ariaLabel="SpeedDial basic example"
		sx={{ opacity:0.3, position: "absolute", bottom: 16, right: 16 }}
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
	<VirtualGamepad draggable={Draggable}></VirtualGamepad>
	</div>

}
