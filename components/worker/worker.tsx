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
		const result = await core.CreateWorkerSession(props.id,{
			monitor: props.profile.media_device.monitors[0],
			soundcard: props.profile.media_device.soundcards.find(sc => sc.Name == "Default Audio Render Device")
		})

        if (result instanceof Error) 
            console.log(result.message)
        else
            console.log(result)
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