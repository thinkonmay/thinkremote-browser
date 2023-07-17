"use client"

import { SupabaseClient, createClient } from "@supabase/supabase-js";

export default class Warehouse{
    private supabase: SupabaseClient;
	
    constructor() {
		this.supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_WH_URL, process.env.NEXT_PUBLIC_SUPABASE_WH_ANON_KEY);
	}

     async WarehousePush(event: string){
        await this.supabase.rpc('stream_events_update', { 
            user_id: window.location.search.split('=')[1],
            new_event: event
        })
    }

	public async WarehouseLoggingSession(): Promise<any> {
        
        var originallog = console.log;

        console.log = function(txt: string) {
        try {
            if(txt.includes('Infor: WH')){
                new Warehouse().WarehousePush(txt.replace("Infor: WH Connect Status : ", ""))
            }
            originallog.apply(console, arguments);
        } catch {}
        }

	}

    public async UpdateUserSetting(event: any): Promise<any> {
        try {
            await this.supabase.rpc('user_setting_update', { 
                identity: window.location.search.split('=')[1], 
                new_setting: event
            })
        } catch {}
    }

    public async UpdateLeftGroupPos(event: any): Promise<any>{
        try {
            await this.supabase.rpc('left_group_pos_update', { 
                identity: window.location.search.split('=')[1], 
                new_setting: event
            })
        } catch {}
    }

    public async UpdateRightGroupPos(event: any): Promise<any>{
        try {
            await this.supabase.rpc('right_group_pos_update', { 
                identity: window.location.search.split('=')[1], 
                new_setting: event
            })
        } catch {}
    }
    public async UpdateMouseGroupPos(event: any): Promise<any>{
        try {
            await this.supabase.rpc('mouse_group_pos_update', { 
                identity: window.location.search.split('=')[1], 
                new_setting: event
            })
        } catch {}
    }
}