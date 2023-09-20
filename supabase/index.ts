"use client"

import { SupabaseClient, User } from "@supabase/supabase-js";
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SignalingConfig } from "../core/signaling/config";

export type SbFunction = 'worker_session_create' | 'worker_session_deactivate' | 'worker_profile_fetch' | 'session_authenticate'
export const createBrowserClient = () => createBrowserSupabaseClient()

export type AuthSessionResp = {
	id: string
	email: string
	webrtc: RTCConfiguration
	signaling: {
		audioURL: string
		videoURL: string
		dataURL: string
	}
}

export type WorkerStatus = {
	worker_profile_id: string
	is_ping_worker_account: boolean
	is_ping_worker_session: boolean
}
type FunctionInvokeOptions = {
	/**
	 * Object representing the headers to send with the request.
	 * */
	headers?: { [key: string]: string }
	/**
	 * The HTTP verb of the request
	 */
	method?: 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE'
	/**
	 * The body of the request.
	 */
	body?: BodyInit
}

type Data<T> = {
	data: T
	error: null
} | {
	data: null
	error: any
}
const SupabaseFuncInvoke = async (funcName: SbFunction, options: FunctionInvokeOptions): Promise<Data<AuthSessionResp>> => {
	try {
		const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
		const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
		const response = await fetch(
			`${supabaseUrl}/functions/v1/${funcName}`,
			{
				...options,
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${supabaseAnonKey}`,
					...options.headers,
				},
			},
		);
		if (response.ok === false) {
			const resText = await response.text();
			return { data: null, error: resText };
		}
		let responseType = (response.headers.get("Content-Type") ?? "text/plain")
			.split(";")[0]
			.trim();
		let data;
		if (responseType === "application/json") {
			data = await response.json();
		} else if (responseType === "application/octet-stream") {
			data = await response.blob();
		} else if (responseType === "multipart/form-data") {
			data = await response.formData();
		} else {
			// default to text
			data = await response.text();
		}
		return { data, error: null };
	} catch (error) {
		return { data: null, error };
	}
};
export default class SbCore {
	private supabase: SupabaseClient;
	constructor() {
		this.supabase = createBrowserClient()
	}

	public async LoginWithGoogle() {
		console.log(process.env.NEXT_PUBLIC_REDIRECT_TO)
		await this.supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo:  process.env.NEXT_PUBLIC_REDIRECT_TO ?? 'https://remote.thinkmay.net',
				queryParams: {
					access_type: "offline",
					prompt: "consent",
				},
			},
		});
	}

	public async Logout(): Promise<void> {
		await this.supabase.auth.signOut();
	}

	public async Authenticated(): Promise<boolean> {
		if ((await this.supabase.auth.getSession()).data.session == null)
			return false
		else if ((await this.getUserInfor()) instanceof Error)
			return false
		else 
			return true
	}

	public async getUserInfor(): Promise<User | Error> {
		const resp = await this.supabase.auth.getUser();
		return resp.error == null ? resp.data.user : resp.error;
	}


	public async AuthenticateSession(ref: string, uref?: string, metadata? :any): Promise<{
		Email: string
		SignalingConfig: SignalingConfig
		WebRTCConfig: RTCConfiguration
		PingCallback: () => Promise<void>
		FetchCallback: () => Promise<WorkerStatus[]>
	}> {
		const session = await this.supabase.auth.getSession()
		if (session.error != null && uref == undefined)
			throw new Error(session.error.message)

		const headers = uref == undefined ?
			{ access_token: session.data?.session?.access_token } :
			{ uref: uref }

		if (headers.access_token == undefined && headers.uref == undefined)
			throw new Error('no authentication method available')
		else if (ref == undefined || ref == null || ref == "null")
			throw	new Error('Reference not provided')

		const { data, error } = await SupabaseFuncInvoke('session_authenticate', {
			headers : headers,
			body : JSON.stringify({ reference: ref , metadata}),
			method: 'POST',
		})
		if (error != null)
			throw new Error(error)


		const pingFunc = async () => {
			const { error } = await this.supabase.rpc(`ping_session`, {
				session_id: data.id
			})

			if (error != null) {
				throw new Error(`unable to ping ${error.message}`)
			}
		}

		const FetchWorkerStatus = async () : Promise<WorkerStatus[]> => {
			const session = await this.supabase.auth.getSession()
			if (session.error != null)
				throw new Error(session.error.message)

			const status = await this.supabase.rpc(`fetch_worker_status`, {
				session_id: data.id
			})

			if (status.error != null) 
				throw new Error(`unable to fetch ${status.error.message}`)

			return status.data
		}

		return {
			Email: data.email,
			SignalingConfig: data.signaling,
			WebRTCConfig: data.webrtc,
			PingCallback: pingFunc,
			FetchCallback: FetchWorkerStatus
		}
	}
}


