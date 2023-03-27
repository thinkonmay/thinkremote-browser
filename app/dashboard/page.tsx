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
	console.log(workers, '0000000000000');
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

	console.log(workers, sessions);

	return matchSessions(wfws, sessions)

}
async function DashBoard() {
	//const path = usePathname()
	//const route = useRouter()
	//const [Workers, setWorkers] = useState<WorkerProfileWithSession[]>([])
	//const [Sessions, setSessions] = useState<WorkerSession[]>([])
	//useEffect(() => { fetchSessions() }, [Workers])
	//useEffect(() => { matchSessions() }, [Sessions])

	//const fetchDevices = async () => {
	//	const core = new VirtualOSBrowserCore()
	//	const result = await core.FetchAuthorizedWorkers()
	//	if (result instanceof Error) {
	//		console.log(result.message)
	//		return
	//	}

	//	const wfws: WorkerProfileWithSession[] = []
	//	result.forEach(item => { wfws.push({ ...item, worker_sessions: [] }) })
	//	setWorkers(wfws)
	//}

	//const fetchSessions = async () => {
	//	const core = new VirtualOSBrowserCore()
	//	const result = await core.FetchAuthorizedWorkerSessions()
	//	if (result instanceof Error) {
	//		console.log(result.message)
	//		return
	//	}
	//	setSessions(result)
	//}

	//const matchSessions = async () => {
	//	setWorkers(old => {
	//		old.forEach((worker) => {
	//			worker.worker_sessions = Sessions.filter(x => x.worker_profile_id == worker.id)
	//		})
	//		return old
	//	})
	//}



	//useEffect(() => {
	//	const core = new VirtualOSBrowserCore()
	//	core.Authenticated().then(async (authenticated) => {
	//		if (!authenticated) {
	//			console.log(`redirect to http://localhost:3000${path}`)
	//			localStorage.setItem("redirectTo", `http://localhost:3000${path}`)
	//			await route.replace("/sign_in")
	//			return
	//		}

	//		fetchDevices()
	//		fetchSessions()
	//	});
	//}, [])

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