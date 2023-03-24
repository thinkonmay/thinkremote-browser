import { Avatar, Box, Button, Card, CardContent, CardHeader, Checkbox, FormControlLabel, FormGroup, Grid, IconButton, Stack, Typography } from "@mui/material"
import VirtualOSBrowserCore from "../../supabase"
import { WorkerSession } from "../../supabase/type"

export interface WorkerSessionProps {
	id : number
	info : WorkerSession
}
export const WorkerSessionComponent = (props: WorkerSessionProps) => {
	return (
		<Card elevation={3}>
			<CardHeader
				sx={{
					fontSize: '16px !important',
					color: 'black',
					bgcolor: '#44b8e6'
				}}
			></CardHeader>
			<CardContent sx={{
				color: '#b4b5b6',
			}}></CardContent>
			<CardContent sx={{ color: '#b4b5b6', }}>
				<Typography sx={{ color: 'black' }} variant="h6">
					Session Info:
				</Typography>
				<Typography>
					{`ID : ${props.info.id}`}
				</Typography>
			</CardContent>
		</Card>
	)
}