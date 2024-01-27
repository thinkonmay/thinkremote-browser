"use client"

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import styled from "styled-components";
import video_desktop from "../public/assets/videos/video_demo_desktop.mp4";

import { Modal } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import QRCode from "react-qr-code";
import { WebRTCControl } from "../components/control/control";
import GuideLine from "../components/custom/guideline/guideline";
import Metric from "../components/metric/metric";
import {
    AskSelectDisplay,
    TurnOnAlert,
    TurnOnConfirm,
} from "../components/popup/popup";
import { Metrics, RemoteDesktopClient } from "../core/app";
import { EventCode } from "../core/models/keys.model";
import { AudioWrapper } from "../core/pipeline/sink/audio/wrapper";
import { VideoWrapper } from "../core/pipeline/sink/video/wrapper";
import { AudioMetrics, NetworkMetrics, VideoMetrics } from "../core/qos/models";
import {
    AddNotifier,
    ConnectionEvent,
    Log,
    LogConnectionEvent,
    LogLevel,
} from "../core/utils/log";
import {
    Platform,
    getBrowser,
    getOS,
    getPlatform,
    getResolution,
} from "../core/utils/platform";
import { IconHorizontalPhone } from "../public/assets/svg/svg_cpn";
import SbCore, { WorkerStatus } from "../supabase";
import { formatError } from "../utils/formatError";


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
    let scancode_local        = ''
    let demo_local        = ''
    if (typeof window !== 'undefined'){
        demo_local          = localStorage.getItem('demo')
        ref_local       =  localStorage.getItem("reference")
        scancode_local          = localStorage.getItem('scancode')

    }


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
    const scancode     = searchParams.get('scancode') ?? scancode_local
    const demo         = searchParams.get('demo') ?? demo_local
    const show_gamepad = searchParams.get('show_gamepad') == 'true'
    let   vm_password  = "unknown"
    let   ads_period   = 100
    try { 
        vm_password  = atob(atob(searchParams.get('vm_password') ?? "ZFc1cmJtOTNiZz09")) 
        ads_period   = parseInt(searchParams.get('period')) 
        if (Number.isNaN(ads_period)) 
            ads_period = 100
    } catch { }

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
    const shouldResetKey                           = useRef(true) 
    const [isGuideModalOpen, setGuideModalOpen] = useState(true)

    const router = useRouter();

	const checkHorizontal = (width: number,height:number) => {
        if (platform == 'mobile') 
            setWarning(width < height)
	}    

    useLayoutEffect(()=>{
        // demo check or return
        const checkDemo = async() =>{
            if(demo=='true'){
                // Clear search params.
                if (typeof window !== "undefined") { 
                    await new Promise(r => setTimeout(r, 1000));
                    window.history.replaceState(null, '', '/') 
                }
                // Delete local data
                await new Promise(r => setTimeout(r, 2 * 60 * 1000));
                localStorage.clear()
                await new Promise(r => setTimeout(r, 10 * 60 * 1000));
                TurnOnAlert('Will close after 3 minutes ','Your DEMO', 'info')
                await new Promise(r => setTimeout(r, 3 * 60  * 1000));

                setTimeout(() => client?.Close(), 100);
                router.push(REDIRECT_PAGE)
            }
        }
        checkDemo()


    },[client])
    useLayoutEffect(()=>{
        const isGuideModalLocal = localStorage.getItem('isGuideModalLocal2')
        if(isGuideModalLocal == 'false' || isGuideModalLocal == 'true'){
            setGuideModalOpen(JSON.parse(isGuideModalLocal))
        }
    },[])

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
            const text = 'Are you sure (｡◕‿‿◕｡)'
            e = e || window.event;
            if (e)
                e.returnValue = text
            return text;
        };


        const handleState = () => {
            navigator.clipboard.readText()
            .then(_clipboard => {
                shouldResetKey.current = true
                if (_clipboard == clipboard) 
                    return
                    
                client?.hid?.SetClipboard(_clipboard)
                clipboard = _clipboard
            })
            .catch(() => { // not in focus zone
                if(shouldResetKey?.current == true)
                    client?.hid?.ResetKeyStuck()

                shouldResetKey.current = false
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
        return () => { 
            clearInterval(UIStateLoop) 
            client?.hid?.ResetKeyStuck()
            client?.Close()
            localStorage.setItem('signaling','{}')
            localStorage.setItem('webrtc'   ,'{}')
        }
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
            const interval = setInterval(() => {
                const second = client.hid.last_active()
                if (second > 3*60 && second < 5 * 60) {
                    TurnOnAlert('Must be active','You are AFK', 'info')
                    
                } else if (second > 5 * 60) {
                    TurnOnAlert("If you aren't active, Pc will shut down after 10 minutes!",'Warning', 'warning')
                    return
                }

                callback()
            }, 12 * 1000)
            return () =>{ clearInterval(interval) }
        }
    }, [videoConnectivity,audioConnectivity])

    const SetupConnection = async () => {
        if (videoConnectivity != 'not started' && audioConnectivity != 'not started')
            return
        else if(ref == null || ref == 'null') 
            throw new Error(`invalid URL, please check again (｡◕‿‿◕｡)`)

        localStorage.setItem("reference",ref)
        localStorage.setItem("scancode", scancode)
        localStorage.setItem("demo", demo)
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
            show_gamepad,
            screen: { 
                width:  window.screen.width,
                height: window.screen.height 
            }
        })

        const {Email ,SignalingConfig ,WebRTCConfig,PingCallback,FetchCallback} = result
        callback = PingCallback
        fetch_callback = FetchCallback
        await LogConnectionEvent(ConnectionEvent.ApplicationStarted,`Login as ${Email}`)


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
                ads_period,
                platform,
                no_video,
                no_mic,
                scancode:scancode =='true' ,
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
                        await TurnOnAlert('RemotePC is shutdown')
                        setTimeout(() => router.push(REDIRECT_PAGE),5000)
                    }
                },30 * 1000)
            })
    }, []);





    const selection = async (displays: string[]) => {
        const result = await AskSelectDisplay(displays)
        console.log(result)
        if(!result) return
        return result
    }


    const displaySelect = useCallback( async function () {
        client.SwitchDisplay(selection)
    }, [client])
    const fullscreenCallback = useCallback(async function () {
        setIOSFullscreen(old => !old)
    },[])
    const touchModeCallback=useCallback(async function(mode: 'trackpad' | 'gamepad' | 'mouse' | 'none') { 
        client?.hid?.setTouchMode(mode)
    },[client])
    const bitrateCallback= useCallback(async function (bitrate: number) { 
        client?.ChangeBitrate(bitrate);
        // client?.ChangeFramerate(55);
    },[client])
    const GamepadACallback=useCallback(async function(x: number, y: number, type: "left" | "right"): Promise<void> {
        client?.hid?.VirtualGamepadAxis(x,y,type);
    },[client] )
    const GamepadBCallback=useCallback(async function(index: number, type: "up" | "down"): Promise<void> {
        client?.hid?.VirtualGamepadButtonSlider(type == 'down',index);
    } ,[client] )
    const MouseMoveCallback=useCallback(async function (x: number, y: number): Promise<void> {
        client?.hid?.mouseMoveRel({movementX:x,movementY:y});
    },[client] )

    const MouseButtonCallback=useCallback(async function (index: number, type: "up" | "down"): Promise<void> {
        type == 'down' 
            ? client?.hid?.MouseButtonDown({button: index}) 
            : client?.hid?.MouseButtonUp({button: index})
    },[client] )
    const resetConnection = useCallback(async() => {
        client?.hid?.ResetKeyStuck();
        client?.HardReset()                    
        SetupWebRTC()
    },[client])
    const keyboardCallback = useCallback(async(val,action: "up" | "down") => {
        client?.hid?.TriggerKey(action == "up" ? EventCode.KeyUp : EventCode.KeyDown,val)
    },[client])
    const gamepadQR = useCallback(async() => {
        setQRShow(`${THIS_PAGE}/?ref=${localStorage.getItem("reference")}&no_video=true&show_gamepad=true&turn=${turn ? "true" : "false"}`)
        setTimeout(() => setQRShow(null),10000)
    },[])

    const setClipBoard = useCallback(async(content: string) => {
        client?.hid?.SetClipboard(content)
    },[client])
    const Customization = ()=> {
        return <GuideLine 
            platform={platform} 
            isModalOpen={isGuideModalOpen} 
            closeModal={() => setGuideModalOpen(false)}
        />
    }

    return (
        <Body>
            <WebRTCControl 
                platform={platform} 
                vm_password={vm_password}
                touch_mode_callback={touchModeCallback}
                bitrate_callback={bitrateCallback}
                display_callback={displaySelect}
                gamepad_callback_a={GamepadACallback}
                gamepad_callback_b={GamepadBCallback}
                mouse_move_callback={MouseMoveCallback}
                mouse_button_callback={MouseButtonCallback}
                reset_callback={resetConnection}
                fullscreen_callback={fullscreenCallback}
                keyboard_callback={keyboardCallback}
                clipboard_callback={setClipBoard}
                gamepad_qr={gamepadQR}
                show_gamepad={show_gamepad}
                video={remoteVideo.current}
            ></WebRTCControl>
            <RemoteVideo
                ref={remoteVideo}
                src={!no_video 
                    ? platform == 'desktop' 
                    ? video_desktop 
                    : video_desktop
                    : null}
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
                    <ButtonModal onClick={()=>{setWarning(false)}}>OK</ButtonModal>
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
            <Customization/>
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
const ButtonModal = styled.button`
    border: 0;
    border-radius: 0.25em;
    background: initial;
    background-color: #7066e0;
    color: #fff;
    font-size: 1em;
    cursor: pointer;
    argin: 0.3125em;
    padding: 0.625em 1.1em;
    transition: box-shadow .1s;
    box-shadow: 0 0 0 3px rgba(0,0,0,0);
    font-weight: 500;
`