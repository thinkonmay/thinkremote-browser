"use client"

import * as React from 'react';
import { SpeedDial, SpeedDialAction } from "@mui/material";
import ListIcon from '@mui/icons-material/List';

interface Action {
	icon: React.ReactNode,
	name: string
	action: () => void,
}
interface Props {
	actions: Action[]
	keyBoardCallBack: (key: string, type: 'up' | 'down') => Promise<void>

}
const listKeyBroad = [
	{
		name: 'Alt + F4',
		val: ['Alt', 'F4']
	},
]
function DesktopControl(props: Props) {
	const { actions, keyBoardCallBack } = props
	const [isOpen, setOpen] = React.useState(false)

	const handleOpen = () => {
		setOpen(!isOpen)
	}	

    const sxSpeedDial = {
		opacity: 0.6,
		position: 'absolute',
		bottom: '2%',
		right: '2%',
		'& .MuiFab-primary': { backgroundColor: 'white', color: 'white' }
	}

	const clickKey = (keys = []) => {
		if(keys.length <= 1){
			keyBoardCallBack(keys?.at(0), 'down')
			keyBoardCallBack(keys?.at(0), 'up')
			return
		}	

		keys.forEach((k, i)=>{
			keyBoardCallBack(k, 'down')
		})
		keys.forEach((k, i)=>{
			keyBoardCallBack(k, 'up')
		})
	}
	return (
        <SpeedDial
            ariaLabel="SpeedDial basic example"
            sx={sxSpeedDial}
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
			{listKeyBroad.map((key) => (
                <SpeedDialAction
                    key={key.name}
                    icon={key.name}
                    tooltipTitle={key.name}
                    onClick={()=>{clickKey(key.val)}}
                />
            ))}
        </SpeedDial>
	);
}

export default DesktopControl;