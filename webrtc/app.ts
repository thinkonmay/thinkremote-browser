import getConfig from "next/config";
import { json } from "stream/consumers";
import { DataChannel } from "./datachannel/datachannel";
import { HID } from "./gui/hid";
import { ConnectionEvent, Log, LogConnectionEvent, LogLevel } from "./utils/log";
import { DeviceSelection, DeviceSelectionResult } from "./models/devices.model";
import { WebRTC } from "./webrtc";
import { SignallingClient } from "./signaling/websocket";

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()
const SIGNALLING_URL  = publicRuntimeConfig.NEXT_PUBLIC_SIGNALING_URL ? publicRuntimeConfig.NEXT_PUBLIC_SIGNALING_URL : "wss:/localhost:234"




export class OneplayApp  {
    video : any
    audio : any

    webrtc : WebRTC
    hid : HID
    signaling : SignallingClient
    datachannels : Map<string,DataChannel>;
    
    DeviceSelection: ((input: DeviceSelection) => Promise<DeviceSelectionResult>);

    started : boolean

    constructor(vid : any,
                audio: any,
                token : string,
                DeviceSelection : ((n: DeviceSelection) => Promise<DeviceSelectionResult>)) {
        this.started = false;
        this.video = vid;
        this.audio = audio;
        

        this.DeviceSelection = DeviceSelection;




        
        this.datachannels = new Map<string,DataChannel>();
        this.hid = new HID(this.video,((data: string) => {
            let channel = this.datachannels.get("hid")
            if (channel == null) {
                Log(LogLevel.Warning,"attempting to send message while data channel is not established");
                return;
            }
            channel.sendMessage(data);
        }));
        this.signaling = new SignallingClient(SIGNALLING_URL,token,
                                 ((ev: Map<string,string>) => {this.handleIncomingPacket(ev)}).bind(this));

        this.webrtc = new WebRTC(((ev : string, data : Map<string,string>) => { var signaling = this.signaling; signaling.SignallingSend(ev,data) }).bind(this),
                                 ((ev : RTCTrackEvent) => { this.handleIncomingTrack(ev) }).bind(this),
                                 ((ev : RTCDataChannelEvent) => { this.handleIncomingDataChannel(ev) }).bind(this));
    }

    private handleIncomingTrack(evt: RTCTrackEvent): any
    {
        this.started = true;
        Log(LogLevel.Infor,`Incoming ${evt.track.kind} stream`);
        if (evt.track.kind == "audio")
        {
            if ( this.audio.current.srcObject !== evt.streams[0]) {
                LogConnectionEvent(ConnectionEvent.ReceivedAudioStream)
                this.audio.current.srcObject = evt.streams[0]
            }
        } else if (evt.track.kind == "video") {
            if ( this.video.current.srcObject !== evt.streams[0]) {
                LogConnectionEvent(ConnectionEvent.ReceivedVideoStream)
                this.video.current.srcObject = evt.streams[0]
            }
        }
    }
    private handleIncomingDataChannel(a: RTCDataChannelEvent)
    {
        LogConnectionEvent(ConnectionEvent.ReceivedDatachannel)
        Log(LogLevel.Infor,`incoming data channel: ${a.channel.label}`)
        if(!a.channel)
            return;

        this.datachannels.set(a.channel.label,new DataChannel(a.channel,(data) => {
            Log(LogLevel.Debug,`message from data channel ${a.channel.label}: ${data}`);
        }));
    }

    private async handleIncomingPacket(pkt : Map<string,string>)
    {
        var target = pkt.get("Target");
        if(target == "SDP") {
            var sdp = pkt.get("SDP")
            if(sdp === undefined) {
                Log(LogLevel.Error,"missing sdp");
                return;
            }
            var type = pkt.get("Type")
            if(type == undefined) {
                Log(LogLevel.Error,"missing sdp type");
                return;
            }

            this.webrtc.onIncomingSDP({
                sdp: sdp,
                type: (type == "offer") ? "offer" : "answer"
            })
        } else if (target == "ICE") {
            var sdpmid = pkt.get("SDPMid")
            if(sdpmid == undefined) {
                Log(LogLevel.Error,"Missing sdp mid field");
            }
            var lineidx = pkt.get("SDPMLineIndex")
            if(lineidx === undefined) {
                Log(LogLevel.Error,"Missing sdp line index field");
                return;
            }
            var can = pkt.get("Candidate")
            if(can == undefined) {
                Log(LogLevel.Error,"Missing sdp candidate field");
                return;
            }

            this.webrtc.onIncomingICE({
                candidate: can,
                sdpMid: sdpmid,
                sdpMLineIndex: Number.parseInt(lineidx)
            })
        } else if (target == "PREFLIGHT") { //TODO
            let i = new DeviceSelection(pkt["Devices"]);
            let result = this.DeviceSelection(i);
            var dat = new Map<string,string>();
            dat.set("Type","answer");
            signaling.SignallingSend("PREFLIGHT",dat)
        } else if (target == "START") {
            var signaling = this.signaling
            var dat = new Map<string,string>();
            signaling.SignallingSend("START",dat)
        }
    }
}