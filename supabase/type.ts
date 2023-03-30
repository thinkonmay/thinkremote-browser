import { Hardware } from "./hardware"
import { MediaDevices } from "./media"

export interface Database {
	public: {
		Tables: {
			account_relationship: {
				Row: {
					created_at: string
					ended_at: string | null
					from_account: string
					id: number
					metadata: any | null
					relationship:
					| Database["public"]["Enums"]["account_relationship_type"]
					| null
					to_account: string
				}
				Insert: {
					created_at?: string
					ended_at?: string | null
					from_account: string
					id?: never
					metadata?: any | null
					relationship?:
					| Database["public"]["Enums"]["account_relationship_type"]
					| null
					to_account: string
				}
				Update: {
					created_at?: string
					ended_at?: string | null
					from_account?: string
					id?: never
					metadata?: any | null
					relationship?:
					| Database["public"]["Enums"]["account_relationship_type"]
					| null
					to_account?: string
				}
			}
			account_session: {
				Row: {
					account_id: string
					ended: boolean | null
					id: number
					last_check: string
					start_at: string
				}
				Insert: {
					account_id: string
					ended?: boolean | null
					id?: never
					last_check?: string
					start_at?: string
				}
				Update: {
					account_id?: string
					ended?: boolean | null
					id?: never
					last_check?: string
					start_at?: string
				}
			}
			proxy_profile: {
				Row: {
					account_id: string
					id: number
					metadata: any | null
					register_ip: string | null
				}
				Insert: {
					account_id: string
					id?: never
					metadata?: any | null
					register_ip?: string | null
				}
				Update: {
					account_id?: string
					id?: never
					metadata?: any | null
					register_ip?: string | null
				}
			}
			session_relationship: {
				Row: {
					created_at: string
					ended_at: string | null
					from_session: number
					id: number
					metadata: any | null
					realtionship: Database["public"]["Enums"]["session_relationship_type"]
					to_session: number
				}
				Insert: {
					created_at?: string
					ended_at?: string | null
					from_session: number
					id?: never
					metadata?: any | null
					realtionship?: Database["public"]["Enums"]["session_relationship_type"]
					to_session: number
				}
				Update: {
					created_at?: string
					ended_at?: string | null
					from_session?: number
					id?: never
					metadata?: any | null
					realtionship?: Database["public"]["Enums"]["session_relationship_type"]
					to_session?: number
				}
			}
			turn_profile: {
				Row: {
					account_id: string
					id: number
					inserted_at: string
					ip: string
					last_check: string
					metadata: any | null
				}
				Insert: {
					account_id: string
					id?: never
					inserted_at?: string
					ip: string
					last_check?: string
					metadata?: any | null
				}
				Update: {
					account_id?: string
					id?: never
					inserted_at?: string
					ip?: string
					last_check?: string
					metadata?: any | null
				}
			}
			user_profile: {
				Row: {
					account_id: string
					email: string | null
					id: number
					metadata: any | null
					phone: string | null
				}
				Insert: {
					account_id: string
					email?: string | null
					id?: never
					metadata?: any | null
					phone?: string | null
				}
				Update: {
					account_id?: string
					email?: string | null
					id?: never
					metadata?: any | null
					phone?: string | null
				}
			}
			user_session: {
				Row: {
					id: number
					metadata: any | null
					session_id: number
				}
				Insert: {
					id?: never
					metadata?: any | null
					session_id: number
				}
				Update: {
					id?: never
					metadata?: any | null
					session_id?: number
				}
			}
			worker_profile: {
				Row: {
					account_id: string
					hardware: any | null
					id: number
					inserted_at: string
					last_check: string
					media_device: any | null
					metadata: any | null
					private_ip: string | null
					public_ip: string | null
				}
				Insert: {
					account_id: string
					hardware?: any | null
					id?: never
					inserted_at?: string
					last_check?: string
					media_device?: any | null
					metadata?: any | null
					private_ip?: string | null
					public_ip?: string | null
				}
				Update: {
					account_id?: string
					hardware?: any | null
					id?: never
					inserted_at?: string
					last_check?: string
					media_device?: any | null
					metadata?: any | null
					private_ip?: string | null
					public_ip?: string | null
				}
			}
			worker_session: {
				Row: {
					auth_config: any
					id: number
					manifest: any
					media_config: any
					metadata: any | null
					session_id: number
					session_log: any
					signaling_config: any
					webrtc_config: any
				}
				Insert: {
					auth_config?: any
					id?: never
					manifest?: any
					media_config?: any
					metadata?: any | null
					session_id: number
					session_log?: any
					signaling_config?: any
					webrtc_config?: any
				}
				Update: {
					auth_config?: any
					id?: never
					manifest?: any
					media_config?: any
					metadata?: any | null
					session_id?: number
					session_log?: any
					signaling_config?: any
					webrtc_config?: any
				}
			}
		}
		Views: {
			[_ in never]: never
		}
		Functions: {
			authorize_account: {
				Args: {
					user_account: string
					worker_account: string
					relation: Database["public"]["Enums"]["account_relationship_type"]
				}
				Returns: boolean
			}
			authorize_session: {
				Args: {
					user_session: number
					worker_session: number
					relation: Database["public"]["Enums"]["session_relationship_type"]
				}
				Returns: boolean
			}
			ping_account: {
				Args: { account_uid: string }
				Returns: boolean
			}
			ping_session: {
				Args: { session_id: number }
				Returns: boolean
			}
		}
		Enums: {
			account_relationship_type: "OWNER" | "DEPLOY" | "DEPLOY_TURN"
			session_relationship_type: "REMOTE"
		}
	}
}


export type Schema =
	"user_profile" |
	"worker_profile" |
	"proxy_profile" |
	"turn_profile" |
	"account_relationship" |
	"session_relationship" |
	"account_session" |
	"worker_session" |
	"user_session"

export interface WorkerProfile {
	inserted_at: any
	last_check: any
	media_device: MediaDevices
	hardware: Hardware
	account_id: string
	id: number

	match_sessions?: WorkerSession[]
}


export interface RTCConfiguration {
	bundlePolicy?: RTCBundlePolicy;
	iceCandidatePoolSize?: number;
	iceServers?: RTCIceServer[];
	iceTransportPolicy?: RTCIceTransportPolicy;
	rtcpMuxPolicy?: RTCRtcpMuxPolicy;
}
export interface WorkerSession {
	signaling_config: {
		HostName: string,
		WebsocketURL: string,
		SignalingPort: string
	}
	media_config: MediaDevices
	webrtc_config: RTCConfiguration
	manifest: any

	id: number
}