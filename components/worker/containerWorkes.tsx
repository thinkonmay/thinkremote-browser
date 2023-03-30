"use client"

import { Grid, Typography } from "@mui/material";
import { WorkerProfile } from "../../supabase/type";
import { WorkerComponent } from "./worker";

interface Props {
	data: WorkerProfile[],
}

function ContainerWorkers(props: Props) {
	const { data } = props
	return ( 
		<div>
			<Grid container spacing={2}>
				{data.map(item => (
					<Grid key={item.id} item xl={3} md={4} sm={6} xs={12} >
						<WorkerComponent id={item.id} profile={item} ></WorkerComponent>
					</Grid>
				))}
			</Grid>
		</div>
	);
}



export default ContainerWorkers;