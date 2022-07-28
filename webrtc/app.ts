import { DataChannel } from "./datachannel";
import { setDebug } from "./log";
import { WebRTC } from "./webrtc";
import { SignallingClient } from "./websocket";

const SIGNALLING_URL  = "ws://localhost:8088/ws"

export class OneplayApp  {
    video : HTMLVideoElement

    webrtc : WebRTC
    signaling : SignallingClient
    datachannels : Map<string,DataChannel>;


    constructor(vid : HTMLVideoElement,
                token : string) {
        this.video = vid;
        this.datachannels = new Map<string,DataChannel>();
        this.signaling = new SignallingClient(SIGNALLING_URL,token,
                                 ((ev: Map<string,string>) => {this.handleIncomingPacket(ev)}).bind(this));

        this.webrtc = new WebRTC(((ev : string, data : Map<string,string>) => { var signaling = this.signaling; signaling.SignallingSend(ev,data) }).bind(this),
                                 ((ev : RTCTrackEvent) => { this.handleIncomingTrack(ev) }).bind(this),
                                 ((ev : RTCDataChannelEvent) => { this.handleIncomingDataChannel(ev) }).bind(this));
    }

    private handleIncomingTrack(evt: RTCTrackEvent): any
    {
        if (evt.streams[0] !== this.video.srcObject) {
            // TODO
            this.video.srcObject = evt.streams[0]
            console.log('Incoming stream');
        }
    }
    private handleIncomingDataChannel(a: RTCDataChannelEvent)
    {
        if(!a.channel)
            return;

        setDebug(`incoming data channel label: ${a.channel.label}`)
        this.datachannels.set(a.channel.label,new DataChannel(a.channel));
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