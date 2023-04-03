"use client"

import { SupabaseClient, User } from "@supabase/supabase-js";
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'

export type SbFunction = 'worker_session_create' | 'worker_session_deactivate' | 'worker_profile_fetch' | 'session_authenticate' 
export const createBrowserClient = () => createBrowserSupabaseClient()
export type AuthSessionResp = {
	id : number
	token : string
	webrtc : RTCConfiguration
	signaling : {
        HostName      : string 
        SignalingPort : number 
        WebsocketURL  : string 
    }
}
export default class SbCore {
	private supabase: SupabaseClient;
	constructor() {
		this.supabase = createBrowserClient()
	}

	public async LoginWithGoogle() {
		const redirectTo = localStorage.getItem("redirectTo")
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
		const {data,error} = await this.supabase.functions.invoke<AuthSessionResp>("session_authenticate" as SbFunction,{
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
}


