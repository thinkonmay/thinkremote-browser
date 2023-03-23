"use client"

import { createClient, SupabaseClient, User } from "@supabase/supabase-js";

export default class VirtualOSBrowserCore {
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


	public async FetchAuthorizedWorker(): Promise<{}[] | Error> {
		const resp = await this.supabase.auth.getUser();
		return []
	}
}
