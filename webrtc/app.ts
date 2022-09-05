import { DataChannel } from "./datachannel";
import { HID } from "./hid";
import { setDebug } from "./log";
import { WebRTC } from "./webrtc";
import { SignallingClient } from "./websocket";

const SIGNALLING_URL  = "wss://signaling.thinkmay.net/ws"

export class OneplayApp  {
    video : any
    audio : any

    webrtc : WebRTC
    hid : HID
    signaling : SignallingClient
    datachannels : Map<string,DataChannel>;


    constructor(vid : any,
                audio: any,
                token : string,
                ErrorHandler : ((n: void) => (void))) {
        this.video = vid;
        this.audio = audio;
        



        
        this.datachannels = new Map<string,DataChannel>();
        this.hid = new HID(this.video,((data: string) => {
            let channel = this.datachannels.get("hid")
            if (channel == null) {
                setDebug("channel not established");
                return;
            }
            channel.sendMessage(data);
        }));
        this.signaling = new SignallingClient(SIGNALLING_URL,token,
                                 ((ev: Map<string,string>) => {this.handleIncomingPacket(ev)}).bind(this),
                                 ErrorHandler);

        this.webrtc = new WebRTC(((ev : string, data : Map<string,string>) => { var signaling = this.signaling; signaling.SignallingSend(ev,data) }).bind(this),
                                 ((ev : RTCTrackEvent) => { this.handleIncomingTrack(ev) }).bind(this),
                                 ErrorHandler,
                                 ((ev : RTCDataChannelEvent) => { this.handleIncomingDataChannel(ev) }).bind(this));
    }

    private handleIncomingTrack(evt: RTCTrackEvent): any
    {
        setDebug(`Incoming ${evt.track.kind} stream`);
        if (evt.track.kind == "audio")
        {
            if ( this.audio.current.srcObject !== evt.streams[0]) {
                this.audio.current.srcObject = evt.streams[0]
            }
        } else if (evt.track.kind == "video") {
            if ( this.video.current.srcObject !== evt.streams[0]) {
                this.video.current.srcObject = evt.streams[0]
            }
        }
    }
    private handleIncomingDataChannel(a: RTCDataChannelEvent)
    {
        setDebug(`incoming data channel label: ${a.channel.label}`)
        if(!a.channel)
            return;

        this.datachannels.set(a.channel.label,new DataChannel(a.channel,(data) => {
            setDebug(data);
        }));
    }

    private handleIncomingPacket(pkt : Map<string,string>)
    {
        var target = pkt.get("Target");
        if(target == "SDP") {
            var sdp = pkt.get("SDP")
            if(sdp === undefined) {
                setDebug("missing sdp ");
                return;
            }
            var type = pkt.get("Type")
            if(type == undefined) {
                setDebug("missing sdp type");
                return;
            }

            this.webrtc.onIncomingSDP({
                sdp: sdp,
                type: (type == "offer") ? "offer" : "answer"
            })
        } else if (target == "ICE") {
            var sdpmid = pkt.get("SDPMid")
            if(sdpmid == undefined) {
                setDebug("Missing sdp mid field");
            }
            var lineidx = pkt.get("SDPMLineIndex")
            if(lineidx === undefined) {
                setDebug("Missing sdp line index field");
                return;
            }
            var can = pkt.get("Candidate")
            if(can == undefined) {
                setDebug("Missing sdp candidate field");
                return;
            }

            this.webrtc.onIncomingICE({
                candidate: can,
                sdpMid: sdpmid,
                sdpMLineIndex: Number.parseInt(lineidx)
            })
        } else if (target == "START") {
            var signaling = this.signaling
            var dat = new Map<string,string>();
            signaling.SignallingSend("START",dat)
        }
    }
}