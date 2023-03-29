import { WorkerProfile } from "./type"

export interface Hardware {
	Hostname    : string  
	CPU         : string  
	RAM         : string  
	BIOS        : string  

	PublicIP    : string  
	PrivateIP   : string  

	GPUs        : string[]
	Disks       : string[]
	NICs        : string[]
}


export interface FetchResponse {
	active: WorkerProfile[]
	unactive: WorkerProfile[]
}