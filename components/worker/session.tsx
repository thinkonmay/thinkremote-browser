'use client'
import { Avatar, Box, Button, Card, CardContent, CardHeader, Checkbox, FormControlLabel, FormGroup, Grid, IconButton, Stack, Typography } from "@mui/material"
import SbCore from "../../supabase"
import { WorkerSession } from "../../supabase/type"
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { useState } from "react";

export interface WorkerSessionProps {
	id: number
	info: WorkerSession
}
export const WorkerSessionComponent = (props: WorkerSessionProps) => {
	const router = useRouter()

	const onDeactivate = async () => {
		const core = new SbCore()
		const result = await core.DeactivateWorkerSession(props.id)
		if (result instanceof Error){
			console.log(result.message)
			return
		}
		Swal.fire({
			title: "Success",
			text: result,
			icon: "success",
			confirmButtonText: "OK",
			timer: 3000,
		});
		router.refresh()
	}
	
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
			<Button
				sx={{ bgcolor: '#44b8e6' }}
				size='small'
				variant="contained"
				onClick={onDeactivate}
			>Deactivate</Button>
		</Card>
	)
}