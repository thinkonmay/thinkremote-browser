// worker_session_create
export class IPFilter{
	public_ip : string  = ""
	private_ip : string  = ""
} 

export class IDFilter {
  	worker_id : number = 0
}

export class MediaFilter {
	monitor_name   : string = ""
	soudcard_name  : string = ""
}

export class WorkerSessionDeactivateBody{
  	worker_session_id : number = 0
}

export type WorkerSessionCreateBody = ( IPFilter | IDFilter ) & MediaFilter
