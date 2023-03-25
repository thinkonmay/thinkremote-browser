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