import { Avatar, Box, Button, Card, CardContent, CardHeader, Checkbox, FormControlLabel, FormGroup, Grid, IconButton, Stack, Typography } from "@mui/material"
import VirtualOSBrowserCore from "../../supabase"
import { WorkerProfile, WorkerSession } from "../../supabase/type"
import { WorkerSessionComponent } from "./session"

export interface WorkerProps {
	id : number
	profile : WorkerProfileWithSession
}
export type WorkerProfileWithSession = (WorkerProfile & {
	worker_sessions: WorkerSession[]
})





export const WorkerComponent = (props: WorkerProps) => {
	const onConnect = async() => {
		const core = new VirtualOSBrowserCore()
		core.GenWorkerURL(props.id,{
			monitor: props.profile.media_device.monitors[0],
			soundcard: props.profile.media_device.soundcards[0]
		})
	}

	const renderIsConnect = () => {
		return (
			<>
				<Button 
					sx={{ bgcolor: '#44b8e6' }} 
					size='small' 
					variant="contained"
						onClick={onConnect}
				>Connect</Button>
			</>
		)
	}
	return (
		<Card elevation={3}>
			<CardHeader
				sx={{
					fontSize: '16px !important',
					color: 'black',
					bgcolor: '#44b8e6'
				}}
				avatar={
					<Avatar src='data:image/jpeg;base64,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' sx={{ bgcolor: '#7575d2' }} aria-label="recipe">

					</Avatar>
				}
				action={
					<IconButton aria-label="settings">
						{/* <MoreVertIcon /> */}
					</IconButton>
				}
				subheader={`${props.profile.hardware.Hostname}`}
				title={`${props.profile.hardware.PublicIP}`}
			></CardHeader>
			<CardContent sx={{
				color: '#b4b5b6',
			}}>
				<Typography sx={{ color: 'black' }} variant="h6">
					Devices Info:
				</Typography>
				<Typography>
					{`OS  : ${props.profile.hardware.Hostname}`}
				</Typography>
				<Typography>
					{`CPU : ${props.profile.hardware.CPU}`}
				</Typography>
				<Typography>
					{`RAM : ${props.profile.hardware.RAM}`}
				</Typography>
				<Typography>
					{`GPU : ${props.profile.hardware.GPUs}`}
				</Typography>
				<Typography>
					{`Created at : ${props.profile.inserted_at}`}
				</Typography>
				<Typography>
					{`Lastcheck : ${props.profile.last_check}`}
				</Typography>

				<Stack>
					<Box>
						<Typography variant="h6" sx={{ color: 'black' }}>Monitor:</Typography>
						<Grid container spacing={1}>
							<Grid item xs={12} lg={6}>
								<FormGroup>
									{props.profile.media_device.monitors.map((item, index) => (
										<FormControlLabel key={index} control={<Checkbox  />} label={`${item.MonitorName}`} />
									))}
								</FormGroup>
							</Grid>
						</Grid>
					</Box>
					<Box>
						<Typography variant="h6" sx={{ color: 'black' }}>Audio:</Typography>
						<Grid container spacing={1}>
							<Grid item xs={12} lg={6}>
								<FormGroup>
									{props.profile.media_device.soundcards.map((item,index) => (
										<FormControlLabel key={index} control={<Checkbox  />} label={`${item.Name}`} />
									))}
								</FormGroup>
							</Grid>
						</Grid>
					</Box>
				</Stack>
                <Grid container spacing={1}>
                    <Grid item xs={12} lg={6}>
                        <FormGroup>
                            {props.profile.worker_sessions.map((item,index) => (
                                <WorkerSessionComponent key={index} id={item.id} info={item}></WorkerSessionComponent>
                            ))}
                        </FormGroup>
                    </Grid>
                </Grid>
				<Stack spacing={1} sx={{
					mt: '10px',
					padding: '0 10px'
				}}>
					{renderIsConnect()}
				</Stack>
			</CardContent>
		</Card>
	)
}