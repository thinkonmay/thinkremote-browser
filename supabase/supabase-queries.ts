import 'server-only'
import { Schema, WorkerSession } from "./type"
import { SupabaseClient } from '@supabase/supabase-js';
export const revalidate = 0; 


export const FetchAuthorizedWorkers =async (supabase : SupabaseClient) => {
	const { data, error } = await supabase
		.from('worker_profile')
		.select("hardware,media_device,account_id,id,inserted_at,last_check")
	if (error != null)
		return new Error(error.message)

	return data.filter(x => {
		const time = -(Date.parse(x.last_check) - Date.now())
		console.log(`worker ${x.id} last ping ${x.last_check} - ${time/1000} seconds from now`)
		return  time < 10 * 1000
	})
}

export const FetchAuthorizedWorkerSessions =async (supabase : SupabaseClient): Promise<WorkerSession[] | Error> => {
	const { data, error } = await supabase
		.from('worker_session' as Schema)
		.select("id,signaling_config,media_config,webrtc_config,manifest,session_log,worker_profile_id:metadata->worker_profile_id")

	if (error != null)
		return new Error(error.message)

	return data
}