import 'server-only'

export const revalidate = 0; 
//import { useEffect, useState } from "react";
//import { useRouter, usePathname } from "next/navigation";
import VirtualOSBrowserCore from "../../supabase";
//import { MediaDevices } from "../../supabase/media";
//import { Hardware } from "../../supabase/hardware";
import { WorkerProfile, WorkerSession } from "../../supabase/type";
import { WorkerComponent, WorkerProfileWithSession } from "../../components/worker/worker";
import { WorkerSessionComponent } from "../../components/worker/session";
import RenderWorkers from "./renderWorkers";
import { createServerClient } from "../../supabase/supabase-server";
import { FetchAuthorizedWorkers, FetchAuthorizedWorkerSessions } from "../../supabase/supabase-queries";
import { redirect } from 'next/navigation';


const matchSessions =  (workers = [], sessions) => {
	if(workers.length > 0) {
		workers.forEach(worker => {
			worker.worker_sessions = sessions.filter(x => x.worker_profile_id == worker.id)
		})
	}
	return workers
}

const fetchWokersAndSessions = async () => {
	//const core = new VirtualOSBrowserCore()
	
	//const workers = await core.FetchAuthorizedWorkers()
	const supabase = createServerClient()
	const workers = await FetchAuthorizedWorkers(supabase)
	if (workers instanceof Error) {
		console.log(workers.message)
		return 	
	}
	let wfws: WorkerProfileWithSession[] = []
	workers.forEach(item => { wfws.push({ ...item, worker_sessions: [] }) })


	//const sessions = await core.FetchAuthorizedWorkerSessions()
	const sessions = await FetchAuthorizedWorkerSessions(supabase)
	
	if (sessions instanceof Error) {
		console.log(sessions.message)
		return
	}

	return matchSessions(wfws, sessions)

}
async function DashBoard() {

	const data = await fetchWokersAndSessions()
	return (
		<>
			<div
				style={{
					//bgcolor: 'white',
					borderRadius: '8px',
					padding: '30px',
					boxShadow: '0px 0px 15px -6px rgba(0,0,0,0.49)',
					marginBottom: '20px'
				}}
			>
				<h2>
					Your device
				</h2>
				<RenderWorkers data={data}/>
			</div>
		</>
	);
}



export default DashBoard;