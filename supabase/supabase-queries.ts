import 'server-only'
import { WorkerSession } from "./type"
export const revalidate = 0; 


export const FetchAuthorizedWorkers = async (supabase) => {
	const { data, error } = await supabase
		.from('worker_profile')
		.select("hardware,media_device,account_id,id,inserted_at,last_check")
	if (error != null)
		return new Error(error.message)

	return data
}

export const FetchAuthorizedWorkerSessions = async (supabase): Promise<WorkerSession[] | Error> => {
	const { data, error } = await supabase
		.from('worker_session' as Schema)
		.select("id,signaling_config,media_config,webrtc_config,manifest,session_log,worker_profile_id:metadata->worker_profile_id")

	if (error != null)
		return new Error(error.message)

	return data
}