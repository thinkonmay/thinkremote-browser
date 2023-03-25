"use client"

import { createClient, SupabaseClient, User } from "@supabase/supabase-js";
import { AuthSessionResp } from "./authenticate";
import { WorkerSessionCreateBody, WorkerSessionDeactivateBody } from "./functions";
import { Hardware } from "./hardware";
import { MediaDevice, MediaDevices } from "./media";
import {Schema, WorkerProfile, WorkerSession} from "./type"

export default class SbCore {
	private supabase: SupabaseClient;
	constructor() {
		this.supabase = createClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
		);
	}

	public async LoginWithGoogle() {
		const redirectTo = localStorage.getItem("redirectTo")
		console.log(redirectTo)
		await this.supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				queryParams: {
					access_type: "offline",
					prompt: "consent",
				},
				redirectTo :  redirectTo
			},
		});
	}

	public async Logout() : Promise<void> {
		await this.supabase.auth.signOut();
	}
	public async Authenticated(): Promise<boolean> {
		return (await this.supabase.auth.getSession()).data.session != null
	}

	public async getUserInfor(): Promise< User | Error > {
		const resp = await this.supabase.auth.getUser();
		return resp.error == null ? resp.data.user : resp.error;
	}


	public async AuthenticateSession(ref : string): Promise<{
		token: string
		SignalingURL : string
		WebRTCConfig : RTCConfiguration
		PingCallback : () => (void)
	} | Error> {
		const session = await this.supabase.auth.getSession()
		if (session.error != null) 
			return new Error(session.error.message)

		const body = JSON.stringify({ reference: ref })
		const {data,error} = await this.supabase.functions.invoke<AuthSessionResp>("session_authenticate",{
			headers: { "access_token": session.data.session.access_token },
			body: body,
			method: 'POST',
		})

		if(error != null)
			return new Error(error)

		return  {
			token : data.token,
			SignalingURL : data.signaling.WebsocketURL,
			WebRTCConfig : data.webrtc,
			PingCallback: ()=>{
				const user_session_id = data.id
			}
		}
	}

	public async FetchAuthorizedWorkers(): Promise<WorkerProfile[] | Error> {
		const {data,error} = await this.supabase
			.from('worker_profile' as Schema)
			.select("hardware,media_device,account_id,id,inserted_at,last_check")
		if (error != null) 
			return new Error(error.message)

		return data
	}


	public async FetchAuthorizedWorkerSessions(): Promise<WorkerSession[] | Error> {
		const {data,error} = await this.supabase
			.from('worker_session' as Schema)
			.select("id,signaling_config,media_config,webrtc_config,manifest,session_log,worker_profile_id:metadata->worker_profile_id")

		if (error != null) 
			return new Error(error.message)

		return data 
	}



	public async DeactivateWorkerSession(worker_session_id: number): Promise<string | Error> {
		const session = await this.supabase.auth.getSession()
		if (session.error != null) 
			return new Error(session.error.message)

		const body = JSON.stringify({
			worker_session_id: worker_session_id
		} as WorkerSessionDeactivateBody)

		const {data,error} = await this.supabase.functions.invoke<string>("worker_session_deactivate",{
			headers: { "access_token": session.data.session.access_token },
			body: body,
			method: 'POST',
		})


		return error == null ? data : new Error(error +":"+ data)
	}

	public async CreateWorkerSession(worker_profile_id: number, media: MediaDevice): Promise<string | Error> {
		const session = await this.supabase.auth.getSession()
		if (session.error != null) 
			return new Error(session.error.message)

		const body = JSON.stringify({
			worker_id: worker_profile_id,
			soudcard_name: media.soundcard.Name,
			monitor_name: media.monitor.MonitorName
		} as WorkerSessionCreateBody)

		const {data,error} = await this.supabase.functions.invoke<string>("worker_session_create",{
			headers: { "access_token": session.data.session.access_token },
			body: body,
			method: 'POST',
		})


		return error == null ? data : new Error(error +":"+ data)
	}
}


