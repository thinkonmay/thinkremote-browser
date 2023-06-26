"use client"

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import video_desktop from "../public/assets/videos/video_demo_desktop.mp4";
import styled from "styled-components";

import {
    TurnOnConfirm,
    TurnOnStatus,
} from "../components/popup/popup";
import { Metrics, RemoteDesktopClient } from "../core/src/app";
import { useSearchParams } from "next/navigation";
import {
    AddNotifier,
    ConnectionEvent,
    LogConnectionEvent,
} from "../core/src/utils/log";
import { WebRTCControl } from "../components/control/control";
import {
	getPlatform,
	Platform,
} from "../core/src/utils/platform";
import SbCore from "../supabase";
import { Modal } from "@mui/material";
import { IconHorizontalPhone } from "../public/assets/svg/svg_cpn";
import Metric  from "../components/metric/metric";

let client : RemoteDesktopClient = null

export default function Home () {
    const [videoConnectivity,setVideoConnectivity] = useState<string>('not started');
    const [audioConnectivity,setAudioConnectivity] = useState<string>('not started');
    const [isGuideModalOpen, setGuideModalOpen] = useState(true)
    const [metrics,setMetrics] = useState<{
        index                             : number
        receivefps                        : number
        decodefps                         : number
        packetloss                        : number     
        bandwidth                         : number     
        buffer                            : number
    }[]>([])

    useLayoutEffect(()=>{
        const isGuideModalLocal = localStorage.getItem('isGuideModalLocal')
        if(isGuideModalLocal == 'false' || isGuideModalLocal == 'true'){
            setGuideModalOpen(JSON.parse(isGuideModalLocal))
        }
    },[])
    const remoteVideo = useRef<HTMLVideoElement>(null);
    const remoteAudio = useRef<HTMLAudioElement>(null);

    let ref_local        = ''
    if (typeof window !== 'undefined') {
        ref_local        = localStorage.getItem("reference")
    }

    const searchParams = useSearchParams();
    const user_ref   = searchParams.get('uref') ?? undefined
    const ref        = searchParams.get('ref')  ?? ref_local 
    const platform   = searchParams.get('platform'); 
    const turn       = searchParams.get('turn') == "true";
    const no_video   = searchParams.get('phonepad') == "true";

    const [Platform,setPlatform] = useState<Platform>(null);

    const SetupConnection = async () => {
        localStorage.setItem("reference",ref)
            
        const core = new SbCore()
        if (!await core.Authenticated() && user_ref == undefined) 
                await core.LoginWithGoogle()
            
        if(ref == null) 
            return

        const result = await core.AuthenticateSession(ref,user_ref)
        if (result instanceof Error) 
            return

        const {Email ,SignalingConfig ,WebRTCConfig,PingCallback} = result
        setInterval(PingCallback,14000)

        await LogConnectionEvent(ConnectionEvent.ApplicationStarted)
        client = new RemoteDesktopClient(
            SignalingConfig,
            {...WebRTCConfig,iceTransportPolicy: turn ? "relay" : "all"},
            remoteVideo.current, 
            remoteAudio.current,   
            Platform,no_video)
        
        client.HandleMetrics = async (metrics: Metrics) => {
            switch (metrics.type) {
                case 'VIDEO':
                    const dat : any[] = []
                    for (let index = 0; index < metrics.decodefps.length; index++) {
                        const element = metrics.decodefps[index];
                        dat.push({
                            index: index,
                            receivefps : metrics.receivefps[index],
                            decodefps  : metrics.decodefps[index],
                            packetloss : metrics.packetloss[index],
                            bandwidth  : metrics.bandwidth[index],
                            buffer     : metrics.buffer[index],
                        })
                    }
                    setMetrics(dat)
                case 'FRAME_LOSS':
                    console.log("frame loss occur")
                    break;
                default:
                    break;
            }

        }
    }


    useEffect(() => {
      AddNotifier(async (message: ConnectionEvent, text?: string, source?: string) => {
           if (message == ConnectionEvent.WebRTCConnectionClosed) 
               await source == "audio" ? setAudioConnectivity("closed") : setVideoConnectivity("closed")
           if (message == ConnectionEvent.WebRTCConnectionDoneChecking) 
               await source == "audio" ? setAudioConnectivity("connected") : setVideoConnectivity("connected")
           if (message == ConnectionEvent.WebRTCConnectionChecking) 
               await source == "audio" ? setAudioConnectivity("connecting") : setVideoConnectivity("connecting")

           if (message == ConnectionEvent.ApplicationStarted) {
               await TurnOnConfirm(message,text)
               setAudioConnectivity("started") 
               setVideoConnectivity("started")
           }
       })

       setPlatform(old => { 
           if (platform == null) 
               return getPlatform() 
           else 
               return platform as Platform
       })

       SetupConnection().catch(error => {
           TurnOnStatus(error);
       })
    }, []);

	const [isModalOpen, setModalOpen] = useState(false)
	const checkHorizontal = (width: number,height:number) => {
        if (Platform == 'mobile') 
            setModalOpen(width < height)
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
    }, [Platform]);


    const toggleMouseTouchCallback=async function(enable: boolean) { 
        client?.hid?.DisableTouch(!enable);
        client?.hid?.DisableMouse(!enable);
    } 
    const bitrateCallback= async function (bitrate: number) { 
        client?.ChangeBitrate(bitrate);
        client?.ChangeFramerate(55);
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
    const keystuckCallback= async function (): Promise<void> {
        client?.hid?.ResetKeyStuck();
    }
    const clipboardSetCallback= async function (val: string): Promise<void> {
        client?.hid?.SetClipboard(val)
        client?.hid?.PasteClipboard()
    }
    const audioCallback = async() => {
        try { 
            client?.ResetAudio()
            await remoteAudio.current.play() 
            await remoteVideo.current.play() 
        } catch (e) {
            console.log(`error play audio ${JSON.stringify(e)}`)
        }
    }
    return (
        <Body>
            <RemoteVideo
                ref={remoteVideo}
                src={platform == 'desktop' ? video_desktop : video_desktop}
                autoPlay
                muted
                playsInline
                loop
            ></RemoteVideo>
            <WebRTCControl 
                platform={Platform} 
                toggle_mouse_touch_callback={toggleMouseTouchCallback}
                bitrate_callback={bitrateCallback}
                GamepadACallback={GamepadACallback}
                GamepadBCallback={GamepadBCallback}
                MouseMoveCallback={MouseMoveCallback}
                MouseButtonCallback={MouseButtonCallback}
                keystuckCallback={keystuckCallback}
                audioCallback={audioCallback}
                clipboardSetCallback={clipboardSetCallback}
            ></WebRTCControl>
            <audio
                ref={remoteAudio}
                autoPlay={true}
                playsInline={true}
                controls={false}
                muted={false}
                loop={true}
                style={{ zIndex: -5, opacity: 0 }}
            ></audio>
			<Modal
				open={isModalOpen}
			>
				<ContentModal
				>
					<IconHorizontalPhone />
					<TextModal>Please rotate the phone horizontally!!</TextModal>
				</ContentModal>
			</Modal>
            <Metric
            	videoConnect={videoConnectivity}
	            audioConnect={audioConnectivity}
                decodeFPS={metrics.map(x => { return {key: x.index, value: x.decodefps} })}
                receiveFPS={metrics.map(x => { return {key: x.index, value: x.receivefps} })}
                packetLoss={metrics.map(x => { return {key: x.index, value: x.packetloss} })}
                bandwidth={metrics.map(x => { return {key: x.index, value: x.bandwidth} })}
                buffer={metrics.map(x => { return {key: x.index, value: x.buffer} })}
                platform={Platform}
            />
        </Body>
    );
};

const RemoteVideo = styled.video`
    position: absolute;
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
