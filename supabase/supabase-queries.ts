import 'server-only'
import { Schema, WorkerSession } from "./type"
import { SupabaseClient } from '@supabase/supabase-js';
import { FetchResponse } from './hardware';
import { SbFunction } from './functions';
//export const revalidate = 0;

export const FetchAuthorizedWorkers = async (supabase: SupabaseClient): Promise<FetchResponse | Error> => {
	const session = await supabase.auth.getSession()
	if (session.error != null)
		return new Error(session.error.message)

	const body = JSON.stringify({})
	const { data, error } = await supabase.functions.invoke<FetchResponse>("worker_profile_fetch" as SbFunction, {
		headers: { "access_token": session.data.session.access_token },
		body: body,
		method: 'POST',
	})

	return error == null ? data : new Error(error + ":" + data)
}
