"use client"

import { createClient, SupabaseClient, User } from "@supabase/supabase-js";

export  const supabaseClient = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
	{
		global: {
			fetch: (...args) => fetch(...args),
		},
	}
)

export async function LoginWithGoogle() {
	await supabaseClient.auth.signInWithOAuth({
		provider: "google",
		options: {
			queryParams: {
				access_type: "offline",
				prompt: "consent",
			},
		},
	});
}

export default class VirtualOSBrowserCore {
	constructor() {
		this.supabase = createClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
		);
	}

	public async LoginWithGoogle() {
		await this.supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				queryParams: {
					access_type: "offline",
					prompt: "consent",
				},
			},
		});
	}
	public Logout() {
		this.supabase.auth.signOut();
	}
	public async getUserInfor(): Promise<{
		user: User | null;
		error: Error | null;
	}> {
		const resp = await this.supabase.auth.getUser();
		if (resp.error != null) {
			return {
				error: resp.error,
				user: null,
			};
		}
		return {
			user: resp.data.user,
			error: null,
		};
	}

	private supabase: SupabaseClient;
}
