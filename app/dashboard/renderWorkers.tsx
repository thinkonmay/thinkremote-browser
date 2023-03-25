"use client"
import { Grid } from "@mui/material";
import { WorkerComponent } from "../../components/worker/worker";

function RenderWorkers({data = []}) {
	return (
		<Grid container spacing={2}>
			{data.map(item => (
				<Grid key={item.id} item xl={3} md={4} sm={6} xs={12} >
					<WorkerComponent id={item.id} profile={item} ></WorkerComponent>
				</Grid>
			))}
		</Grid>
	);
}

export default RenderWorkers;