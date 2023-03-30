import { Avatar, Box, Button, Card, CardContent, CardHeader, Checkbox, FormControlLabel, FormGroup, Grid, IconButton, Stack, Typography } from "@mui/material"
import { useRouter } from "next/navigation"
import { Suspense } from "react"
import Swal from "sweetalert2"
import SbCore from "../../supabase"
import { WorkerProfile, WorkerSession } from "../../supabase/type"
import { WorkerSessionComponent } from "./session"

export interface WorkerProps {
	id: number
	profile: WorkerProfile
}
export type WorkerProfileWithSession = (WorkerProfile & {
	worker_sessions: WorkerSession[]
})



export const WorkerComponent = (props: WorkerProps) => {
	const { profile } = props
	const router = useRouter()
	const onConnect = async () => {
		Swal.fire({
			title: 'Connecting',
			text:'Please wait a seconds',
			icon: 'info',
		})
		const core = new SbCore()
		const result = await core.CreateWorkerSession(props.id, {
			monitor: props.profile.media_device.monitors[0],
			soundcard: props.profile.media_device.soundcards.find(sc => sc.Name == "Default Audio Render Device")
		})
		Swal.close()
		if (result instanceof Error) {
			console.log(result.message)
			return
		}
		Swal.fire({
			title: 'Connect succes, Do you want to copy ref?',
			showDenyButton: true,
			icon: 'success',
			showCancelButton: true,
			confirmButtonText: 'Copy',
			denyButtonText: `Don't save`,
		}).then(async (confirm) => {
			if (confirm.isConfirmed) {
				await navigator.clipboard.writeText(result)
				Swal.fire('Saved!', '', 'success')
			} else if (confirm.isDenied) {
				Swal.fire('Changes are not saved', '', 'info')
			}
		})
		router.refresh()
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
				subheader={`${profile.hardware.Hostname}`}
				title={`${profile.hardware.PublicIP}`}
			></CardHeader>
			<CardContent sx={{
				color: '#b4b5b6',
			}}>
				<Typography sx={{ color: 'black' }} variant="h6">
					Devices Info:
				</Typography>
				<Typography>
					{`OS  : ${profile.hardware.Hostname}`}
				</Typography>
				<Typography>
					{`CPU : ${profile.hardware.CPU}`}
				</Typography>
				<Typography>
					{`RAM : ${profile.hardware.RAM}`}
				</Typography>
				<Typography>
					{`GPU : ${profile.hardware.GPUs}`}
				</Typography>
				<Typography>
					{`Created at : ${profile.inserted_at}`}
				</Typography>
				<Typography>
					{`Lastcheck : ${profile.last_check}`}
				</Typography>

				<Stack>
					<Box>
						<Typography variant="h6" sx={{ color: 'black' }}>Monitor:</Typography>
						<Grid container spacing={1}>
							<Grid item xs={12} lg={6}>
								<FormGroup>
									{profile?.media_device?.monitors?.map((item, index) => (
										<FormControlLabel key={index} control={<Checkbox />} label={`${item.MonitorName}`} />
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
									{profile?.media_device?.soundcards?.map((item, index) => (
										<FormControlLabel key={index} control={<Checkbox />} label={`${item.Name}`} />
									))}
								</FormGroup>
							</Grid>
						</Grid>
					</Box>
				</Stack>
				<Grid container spacing={1}>
					<Grid item xs={12} lg={6}>
						<Suspense fallback={<p>Loading...</p>}>
							<FormGroup>
								{profile?.match_sessions?.map((item, index) => (
									<WorkerSessionComponent key={index} id={item.id} info={item}></WorkerSessionComponent>
								))}
							</FormGroup>
						</Suspense>
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