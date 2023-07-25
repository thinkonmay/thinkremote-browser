"use client"

import { SupabaseClient, createClient } from "@supabase/supabase-js";

// console._log_old = console.log

// console.log = function(msg) {
//     if(msg.contain('Infor: WH'))
//         console.log("Lagsana")
// }

export default class Warehouse{
    private supabase: SupabaseClient;
	
    constructor() {
		this.supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_WH_URL, process.env.NEXT_PUBLIC_SUPABASE_WH_ANON_KEY);
	}

    public async WarehousePush(event: string){
        await this.supabase.rpc('stream_events_update', { 
            user_id: window.location.search.split('=')[1],
            new_event: event
        })
    }

	public async WarehouseLoggingSession(): Promise<any> {

        var originallog = console.log;

        console.log = function(txt: string) {
            if(txt.includes('Infor: WH')){
                new Warehouse().WarehousePush(txt.replace("Infor: WH Connect Status :", ""))
            }
            originallog.apply(console, arguments);
        }

	}
}