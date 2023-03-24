"use client"

import { Avatar, Button, Card, CardContent, CardHeader, Checkbox, FormControlLabel, FormGroup, Grid, IconButton, Stack, Typography } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useRouter , usePathname } from "next/navigation";
import VirtualOSBrowserCore from "../../supabase";
import { MediaDevices } from "../../supabase/media";
import { Hardware } from "../../supabase/hardware";
import { WorkerProfile, WorkerSession } from "../../supabase/type";
import { WorkerComponent, WorkerProfileWithSession } from "../../components/worker/worker";
import { WorkerSessionComponent } from "../../components/worker/session";




function DashBoard() {
	const path = usePathname()
	const route = useRouter()
	const [Workers,setWorkers] = useState<WorkerProfileWithSession[]>([])
	const [Sessions,setSessions] = useState<WorkerSession[]>([])
	useEffect(() => { fetchSessions() },[Workers])
	useEffect(() => { matchSessions() },[Sessions])

	const fetchDevices = async() => {
		const core = new VirtualOSBrowserCore()
		const result = await core.FetchAuthorizedWorkers()
		if (result instanceof Error) {
			console.log(result.message)
			return 
		}

		const wfws : WorkerProfileWithSession[] = []
		result.forEach(item => { wfws.push({...item,worker_sessions:[]}) })
		setWorkers(wfws)
	}

	const fetchSessions = async() => {
		const core = new VirtualOSBrowserCore()
		const result = await core.FetchAuthorizedWorkerSessions()
		if (result instanceof Error) {
			console.log(result.message)
			return 
		}
		setSessions(result)
	}

	const matchSessions = async() => {
		setWorkers(old => {
			old.forEach((worker) => {
				worker.worker_sessions = Sessions.filter(x => x.worker_profile_id == worker.id)
			})
			return old
		})
	}



	useEffect(() => {
		const core = new VirtualOSBrowserCore()
		core.Authenticated().then(async (authenticated) => {
			if (!authenticated) {
				console.log(`redirect to http://localhost:3000${path}`)
				localStorage.setItem("redirectTo",`http://localhost:3000${path}`)
				await route.replace("/sign_in")
				return
			}

			fetchDevices()
			fetchSessions()
		});
	},[])

	return (
		<>
			<Box
				sx={{
					//bgcolor: 'white',
					'border-radius': '8px',
					padding: '30px',
					boxShadow: '0px 0px 15px -6px rgba(0,0,0,0.49)',
					mb: '20px'
				}}
			>
				<Typography variant="h2">
					Your device
				</Typography>
				<Grid container spacing={2}>
					{Workers.map(item => (
						<Grid key={item.id} item xl={3} md={4} sm={6} xs={12} >
							<WorkerComponent id={item.id} profile={item} ></WorkerComponent>
						</Grid>
					))}
				</Grid>
			</Box>
		</>
	);
}



export default DashBoard;