"use client"

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import video_desktop from "../public/assets/videos/video_demo_desktop.mp4";
import styled from "styled-components";

import {
    TurnOnAlert,
    TurnOnConfirm,
    TurnOnStatus,
} from "../components/popup/popup";
import { Metrics, RemoteDesktopClient } from "../core/app";
import { useRouter, useSearchParams } from "next/navigation";
import {
    AddNotifier,
    ConnectionEvent,
    Log,
    LogConnectionEvent,
    LogLevel,
} from "../core/utils/log";
import { WebRTCControl } from "../components/control/control";
import {
    getBrowser,
	getOS,
	getPlatform,
	getResolution,
	Platform,
} from "../core/utils/platform";
import SbCore, { WorkerStatus } from "../supabase";
import { Modal } from "@mui/material";
import { IconHorizontalPhone } from "../public/assets/svg/svg_cpn";
import Metric  from "../components/metric/metric";
import { AudioMetrics, NetworkMetrics, VideoMetrics } from "../core/qos/models";
import { VideoWrapper } from "../core/pipeline/sink/video/wrapper";
import { AudioWrapper } from "../core/pipeline/sink/audio/wrapper";
import { formatError } from "../utils/formatError";
import { EventCode } from "../core/models/keys.model";
import QRCode from "react-qr-code";


type StatsView = {
    index                             : number
    receivefps                        : number
    decodefps                         : number
    packetloss                        : number     
    bandwidth                         : number     
    buffer                            : number
}

const REDIRECT_PAGE = "https://app.thinkmay.net/"
const THIS_PAGE     = "https://remote.thinkmay.net"
let client : RemoteDesktopClient = null
let callback       : () => Promise<void> = async () => {};
let fetch_callback : () => Promise<WorkerStatus[]> = async () => {return[]};
let video : VideoWrapper = null
let audio : AudioWrapper = null
let clipboard : string  = ""
let pointer   : boolean = false



type ConnectStatus = 'not started' | 'started' | 'connecting' | 'connected' | 'closed'
export default function Home () {    
    let ref_local        = ''
    if (typeof window !== 'undefined')
        ref_local        = localStorage.getItem("reference")


    const searchParams = useSearchParams();
    const user_ref     = searchParams.get('uref') ?? undefined
    const ref          = searchParams.get('ref')  ?? ref_local 
    const Platform     = searchParams.get('platform'); 
    const turn         = searchParams.get('turn') == "true";
    const no_video     = searchParams.get('no_video') == "true";
    const low_bitrate  = searchParams.get('low_bitrate') == "true";
    const no_mic       = searchParams.get('mutemic') == "true";
    const no_hid       = searchParams.get('viewonly') == "true";
    const no_stretch   = searchParams.get('no_stretch') == 'true'
    const view_pointer = searchParams.get('pointer') == 'visible'
    const show_gamepad = searchParams.get('show_gamepad') == 'true'

    const [connectionPath,setConnectionPath]       = useState<any[]>([]);
    const [videoConnectivity,setVideoConnectivity] = useState<ConnectStatus>('not started');
    const [audioConnectivity,setAudioConnectivity] = useState<ConnectStatus>('not started');
    const [metrics,setMetrics]                     = useState<StatsView[]>([])
    const remoteVideo                              = useRef<HTMLVideoElement>(null);
    const remoteAudio                              = useRef<HTMLAudioElement>(null);

    const [platform,setPlatform]                   = useState<Platform>(null);
    const [IOSFullscreen,setIOSFullscreen]         = useState<boolean>(false);
 	const [showQR, setQRShow]                      = useState<string|null>(null)
 	const [warningRotate, setWarning]              = useState(false)
    const router = useRouter();

	const checkHorizontal = (width: number,height:number) => {
        if (platform == 'mobile') 
            setWarning(width < height)
	}    
    useEffect(() => {
		checkHorizontal(window.innerWidth,window.innerHeight)
        window.addEventListener('resize', (e: UIEvent) => {
            checkHorizontal(window.innerWidth, window.innerHeight)
		})

		return () => { 
            window.removeEventListener('resize', (e: UIEvent) => { 
                checkHorizontal(window.innerWidth, window.innerHeight)
            })
		}
    }, [platform]);
    useEffect(() => {
        remoteVideo.current.style.objectFit = 
            IOSFullscreen
            ?  "fill"
            :  "contain"
    }, [IOSFullscreen]);





    useEffect(()=>{
        window.onbeforeunload = (e: BeforeUnloadEvent) => {
            client?.hid?.ResetKeyStuck()
            client?.Close()

            localStorage.setItem('signaling','{}')
            localStorage.setItem('webrtc'   ,'{}')
            const text = 'Are you sure (｡◕‿‿◕｡)'
            e = e || window.event;
            if (e)
                e.returnValue = text
            return text;
        };


        const handleState = () => {
            navigator.clipboard.readText()
            .then(_clipboard => {
                if (_clipboard == clipboard) 
                    return
                    
                client?.hid?.SetClipboard(_clipboard)
                clipboard = _clipboard
            })
            .catch(() => { // not in focus zone
                client?.hid?.ResetKeyStuck()
            })

            if(getOS() == 'iOS' || getBrowser() == 'Safari') 
                return 
            
            const fullscreen = document.fullscreenElement != null
            const havingPtrLock = document.pointerLockElement != null

            // remoteVideo.current.style.cursor = 'none'
            remoteVideo.current.style.objectFit = 
                !  fullscreen 
                ?  "contain"
                :  no_stretch 
                ?  "contain"
                :  "fill"

            if (pointer != fullscreen) {
                client?.PointerVisible(view_pointer ? true : fullscreen)
                pointer = fullscreen
            }

            if ((fullscreen && !havingPtrLock ) && getBrowser() != 'Safari')
                try {remoteVideo.current.requestPointerLock()}catch(e){}
            else if ((!fullscreen && havingPtrLock) && getBrowser() != 'Safari') 
                document.exitPointerLock();
        }

        const UIStateLoop = setInterval(handleState,100)
        return () => { clearInterval(UIStateLoop) }
    },[])










    useEffect(()=>{
        const got_stuck_one = () => { 
            return((['started','closed'].includes(videoConnectivity)  && audioConnectivity == 'connected') || 
                   (['started','closed'].includes(audioConnectivity)  && videoConnectivity == 'connected'))
                   && !no_video
        }
        const got_stuck_both = () => { 
            return (['started','closed'].includes(videoConnectivity)  && 
                    ['started','closed'].includes(audioConnectivity))
        }

        const check_connection = () => {
            if (got_stuck_one() || got_stuck_both()) 
                SetupWebRTC()
        }

        if (got_stuck_one() || got_stuck_both()) {
            console.log('stuck condition happended, retry after 5s')
            const interval = setTimeout(check_connection, 7 * 1000)
            return () =>{ clearTimeout(interval) }
        } else if (videoConnectivity == 'connected') {
            const interval = setInterval(callback, 12 * 1000)
            return () =>{ clearInterval(interval) }
        }
    }, [videoConnectivity,audioConnectivity])

    const SetupConnection = async () => {
        if (videoConnectivity != 'not started' && audioConnectivity != 'not started')
            return
        else if(ref == null || ref == 'null') 
            throw new Error(`invalid URL, please check again (｡◕‿‿◕｡)`)

        localStorage.setItem("reference",ref)
        const core = new SbCore()
        if (!await core.Authenticated() && user_ref == undefined) {
            await core.LoginWithGoogle()
            return
        }

        const result = await core.AuthenticateSession(ref,user_ref,{
            platform    : getOS(), 
            browser     : getBrowser(),
            resolution  : getResolution(),
            turn, 
            no_video, 
            low_bitrate, 
            no_mic, 
            no_hid, 
            no_stretch,
            view_pointer, 
            show_gamepad 
        })

        const {Email ,SignalingConfig ,WebRTCConfig,PingCallback,FetchCallback} = result
        callback = PingCallback
        fetch_callback = FetchCallback
        await LogConnectionEvent(ConnectionEvent.ApplicationStarted,`hi ${Email}`)


        localStorage.setItem("signaling",JSON.stringify(SignalingConfig))
        localStorage.setItem("webrtc",JSON.stringify(WebRTCConfig))
    }


    const SetupWebRTC = () => {
        if (client != null) 
            client.Close()
            
        client = new RemoteDesktopClient( video, audio,   
            JSON.parse(localStorage.getItem('signaling')),
            JSON.parse(localStorage.getItem('webrtc')), {
                turn,
                platform,
                no_video,
                no_mic,
                no_hid
            }
        )
        
        client.HandleMetrics = async (metrics: Metrics) => {
            switch (metrics.type) {
                case 'VIDEO':
                    setMetrics(metrics.decodefps.map((val,index) => { return {
                        index: index,
                        receivefps : metrics.receivefps[index],
                        decodefps  : metrics.decodefps[index],
                        packetloss : metrics.packetloss[index],
                        bandwidth  : metrics.bandwidth[index],
                        buffer     : metrics.buffer[index],
                    }}))
                    break;
                case 'FRAME_LOSS':
                    console.log("frame loss occur")
                    break;
                default:
                    break;
            }

        }
        client.HandleMetricRaw = async (data: NetworkMetrics | VideoMetrics | AudioMetrics) => {
            if (data.type == 'network' && 
                data.address.remote != undefined && 
                data.address.local  != undefined)
                setConnectionPath(old => {
                    if(old.find(x => x.local == data.address.local) == undefined)
                        return [...old,data.address]

                    return old
                })
        }
    }

    useEffect(() => {
        AddNotifier(async (message: ConnectionEvent, text?: string, source?: string) => {
            if (message == ConnectionEvent.WebRTCConnectionClosed) 
                source == "audio" ? setAudioConnectivity("closed") : setVideoConnectivity("closed")
            if (message == ConnectionEvent.WebRTCConnectionDoneChecking) 
                source == "audio" ? setAudioConnectivity("connected") : setVideoConnectivity("connected")
            if (message == ConnectionEvent.WebRTCConnectionChecking) 
                source == "audio" ? setAudioConnectivity("connecting") : setVideoConnectivity("connecting")
            if (message == ConnectionEvent.WebRTCConnectionDoneChecking && source == "video"  && low_bitrate) 
                client.ChangeBitrate(1000)

            if (message == ConnectionEvent.ApplicationStarted) {
                await TurnOnConfirm(message,text)
                setAudioConnectivity("started") 
                setVideoConnectivity("started")
            }

            Log(LogLevel.Infor,`${message} ${text ?? ""} ${source ?? ""}`)
       })

        setPlatform(old => { 
           if (Platform == null) 
               return getPlatform() 
           else 
               return Platform as Platform
        })

        video = new VideoWrapper(remoteVideo.current)
        audio = new AudioWrapper(remoteAudio.current)
        SetupConnection() 
            .catch((err)=>{
                TurnOnAlert(formatError((err as Error)?.message ?? ""))
                setTimeout(() => router.push(REDIRECT_PAGE),5000)
            })
            .then(async () => {
                SetupWebRTC()
                setInterval(async () => { // TODO
                    const result = await fetch_callback()
                    const data = result.at(0)

                    if(data == undefined) 
                        return
                    else if(!data.is_ping_worker_account) {
                        await TurnOnAlert('worker terminated')
                        setTimeout(() => router.push(REDIRECT_PAGE),5000)
                    }
                },30 * 1000)
            })
    }, []);








    const fullscreenCallback = async function () {
        setIOSFullscreen(old => !old)
    }
    const touchModeCallback=async function(mode: 'trackpad' | 'gamepad' | 'mouse' | 'none') { 
        client?.hid?.setTouchMode(mode)
    } 
    const bitrateCallback= async function (bitrate: number) { 
        client?.ChangeBitrate(bitrate);
        // client?.ChangeFramerate(55);
    } 
    const GamepadACallback=async function(x: number, y: number, type: "left" | "right"): Promise<void> {
        client?.hid?.VirtualGamepadAxis(x,y,type);
    } 
    const GamepadBCallback=async function(index: number, type: "up" | "down"): Promise<void> {
        client?.hid?.VirtualGamepadButtonSlider(type == 'down',index);
    }  
    const MouseMoveCallback=async function (x: number, y: number): Promise<void> {
        client?.hid?.mouseMoveRel({movementX:x,movementY:y});
    } 
    const MouseButtonCallback=async function (index: number, type: "up" | "down"): Promise<void> {
        type == 'down' 
            ? client?.hid?.MouseButtonDown({button: index}) 
            : client?.hid?.MouseButtonUp({button: index})
    } 
    const resetConnection = async() => {
        client?.hid?.ResetKeyStuck();
        client?.HardReset()                    
        SetupWebRTC()
    }
    const keyboardCallback = async(val,action: "up" | "down") => {
        client?.hid?.TriggerKey(action == "up" ? EventCode.KeyUp : EventCode.KeyDown,val)
    }
    const gamepadQR = async() => {
        setQRShow(`${THIS_PAGE}/?ref=${localStorage.getItem("reference")}&no_video=true&show_gamepad=true&turn=${turn ? "true" : "false"}`)
        setTimeout(() => setQRShow(null),10000)
    }


    return (
        <Body>
            <WebRTCControl 
                platform={platform} 
                touch_mode_callback={touchModeCallback}
                bitrate_callback={bitrateCallback}
                gamepad_callback_a={GamepadACallback}
                gamepad_callback_b={GamepadBCallback}
                mouse_move_callback={MouseMoveCallback}
                mouse_button_callback={MouseButtonCallback}
                reset_callback={resetConnection}
                fullscreen_callback={fullscreenCallback}
                keyboard_callback={keyboardCallback}
                gamepad_qr={gamepadQR}
                show_gamepad={show_gamepad}
                video={remoteVideo.current}
            ></WebRTCControl>
            <RemoteVideo
                ref={remoteVideo}
                src={no_video ? null : platform == 'desktop' ? video_desktop : video_desktop}
                autoPlay
                muted
                playsInline
                loop
            ></RemoteVideo>
            <audio
                ref={remoteAudio}
                autoPlay={true}
                playsInline={true}
                controls={false}
                muted={false}
                loop={true}
                style={{ zIndex: -5, opacity: 0 }}
            ></audio>
			<Modal open={warningRotate} >
				<ContentModal >
					<IconHorizontalPhone />
					<TextModal>Please rotate the phone horizontally!!</TextModal>
				</ContentModal>
			</Modal>
			<Modal open={showQR != null} >
				<ContentModal >
                    <QRCode value={showQR ?? ""}></QRCode>
				</ContentModal>
			</Modal>
            <Metric
            	videoConnect={videoConnectivity}
	            audioConnect={audioConnectivity}
                decodeFPS   ={metrics.map(x => { return {key: x.index, value: x.decodefps} })}
                receiveFPS  ={metrics.map(x => { return {key: x.index, value: x.receivefps} })}
                packetLoss  ={metrics.map(x => { return {key: x.index, value: x.packetloss} })}
                bandwidth   ={metrics.map(x => { return {key: x.index, value: x.bandwidth} })}
                buffer      ={metrics.map(x => { return {key: x.index, value: x.buffer} })}
                path        ={connectionPath}
                platform    ={platform}
            />
        </Body>
    );
};

const RemoteVideo = styled.video`
    position: absolute;
    z-index: 1;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    margin: 0;
    width: 100%;
    height: 100%;
    max-height: 100%;
    max-width: 100%;
`;
const Body = styled.div`
    position: relative;
    touch-action: none;
    width: 100vw;
    height: 100vh;
    padding: 0;
    margin: 0;
    border: 0;
    overflow: hidden;
    background-color: black;
`;
const App = styled.div`
    position: relative;
    width: 100vw;
    height: 100vh;
`;
const ContentModal = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	
`
const TextModal = styled.p`
	font-weight: 500;
	color: white;
`
//export default Home;?
