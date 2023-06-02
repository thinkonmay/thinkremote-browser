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
}

function DesktopControl(props: Props) {
	const { actions } = props
	const [isOpen, setOpen] = React.useState(false)

	const handleOpen = () => {
		setOpen(!isOpen)
	}	

    const sxSpeedDial = {
		opacity: 0.3,
		position: 'absolute',
		bottom: '2%',
		right: '2%',
		'& .MuiFab-primary': { backgroundColor: 'white', color: 'white' }
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
        </SpeedDial>
	);
}

export default DesktopControl;