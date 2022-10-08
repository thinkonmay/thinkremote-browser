export class Soundcard {
    DeviceID: string 
    Name: string 	
	Api: string		

	IsDefault: boolean
	IsLoopback: boolean

    constructor (data: any) {
        this.DeviceID = data.id
        this.Name = data.name
	    this.Api = data.api
	    this.IsDefault = data.isDefault
	    this.IsLoopback = data.isLoopback
    }
}

export class Monitor {
    MonitorHandle: number
    MonitorName: string	
    DeviceName: string	
    Adapter: string 		
	Width: number 
	Height: number
	Framerate: number
	IsPrimary: boolean 

    constructor (data: any) {
        this.MonitorHandle = data.handle
        this.MonitorName = data.name
        this.DeviceName = data.device
        this.Adapter = data.adapter
	    this.Width = data.width
	    this.Height = data.height
	    this.Framerate = data.framerate
	    this.IsPrimary = data.isPrimary
    }

}

export class DeviceSelection {
    monitors:   Array<Monitor>;
    soundcards: Array<Soundcard>;

    constructor (data: string) {
        let parseResult = JSON.parse(data)

        for(var i in parseResult["monitors"]) {
            this.monitors.push(new Monitor(i));
        }
        for(var i in parseResult["soundcards"]) {
            this.soundcards.push(new Soundcard(i));
        }
    }
}



export class DeviceSelectionResult {
    monitorID: number
    soundcardID: string

    bitrate: number
    framerate: number

    constructor(bitrate: number,
                framerate: number,
                soundcard: string,
                monitor: number){
        this.bitrate = bitrate
        this.framerate = framerate
        this.soundcardID = soundcard 
        this.monitorID = monitor
    }

    ToString(): string {
        return JSON.stringify({
            monitor: this.monitorID,
            soundcard: this.soundcardID,
            bitrate: this.bitrate,
            framerate: this.framerate,
        })
    }
}

