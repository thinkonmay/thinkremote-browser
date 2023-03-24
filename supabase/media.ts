export interface Monitor {
	MonitorHandle: number
	MonitorName: string 
	DeviceName: string 
	Adapter: string 
	Width: number 
	Height: number
	Framerate: number
	IsPrimary: boolean   
}

export interface Soundcard {
	DeviceID: string 
	Name: string 
	Api: string 
	IsDefault: boolean 
	IsLoopback: boolean  
}

export interface MediaDevices {
	monitors: Monitor[]
	soundcards: Soundcard[]
}

export interface MediaDevice {
	monitor: Monitor
	soundcard: Soundcard
}