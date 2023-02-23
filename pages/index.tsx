import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { AskSelectBitrate, AskSelectDisplay, AskSelectFramerate, AskSelectSoundcard, TurnOnAlert, TurnOnStatus} from "../components/popup";
import { WebRTCClient } from "webrtc-streaming-core/dist/app";
import { useRouter } from "next/router";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import {
  List,
  Fullscreen,
} from "@mui/icons-material";
import Draggable from "react-draggable";
import { DeviceSelection, DeviceSelectionResult } from "webrtc-streaming-core/dist/models/devices.model";
import { ConnectionEvent, Log, LogConnectionEvent, LogLevel } from "webrtc-streaming-core/dist/utils/log";
import { GetServerSideProps } from "next";
import { Joystick } from 'react-joystick-component';
import { IJoystickUpdateEvent } from "react-joystick-component/build/lib/Joystick";
import { GoogleAnalytics } from "nextjs-google-analytics";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

type Props = { host: string | null };

export const getServerSideProps: GetServerSideProps<Props> =
  async context => ({ props: { host: context.req.headers.host || null } });

const buttons = [
  <Button key="one">One</Button>,
  <Button key="two">Two</Button>,
  <Button key="three">Three</Button>,
];


const Home = ({ host }) => {
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const remoteAudio = useRef<HTMLAudioElement>(null);

  const router = useRouter();
  const {signaling, token, fps,bitrate} = router.query
  const signalingURL   = Buffer.from((signaling?signaling:"d3NzOi8vc2VydmljZS50aGlua21heS5uZXQvaGFuZHNoYWtl" ) as string, "base64").toString()
  const signalingToken = (token? token : "none") as string
  var defaultBitrate   = parseInt((bitrate? bitrate : "6000" ) as string,10)
  var defaultFramerate = parseInt((fps? fps : "55") as string,10)
  var defaultSoundcard = "Default Audio Render Device";

  const [actions, setActions] = useState<{
    icon: JSX.Element;
    name: string;
    action: () => void;
  }[] >([]);

  const [JoyStick, setJoyStick] = useState<{
    element: JSX.Element;
  }[] >([]);



  const onMove = (stick:IJoystickUpdateEvent) => {
    console.log(`X: ${stick.x}`);
    console.log(`Y: ${stick.y}`);
  };

  const onStop = () => {
  };

  

  let client : WebRTCClient  
  useEffect(() => {
  client = (client == null) ? client : new WebRTCClient(signalingURL,remoteVideo, remoteAudio, signalingToken, (async (offer: DeviceSelection) => {
      LogConnectionEvent(ConnectionEvent.WaitingAvailableDeviceSelection)

      let ret = new DeviceSelectionResult(offer.soundcards[0].DeviceID,offer.monitors[0].MonitorHandle.toString());
      if(offer.soundcards.length > 1) {

        let exist = false;
        if (defaultSoundcard != null) {
          offer.soundcards.forEach(x => {
            if (x.Name == defaultSoundcard) {
              exist = true;
              ret.SoundcardDeviceID = x.DeviceID;
              defaultSoundcard = null;
            }
          })
        }

        if (!exist) {
          ret.SoundcardDeviceID = await AskSelectSoundcard(offer.soundcards)
          Log(LogLevel.Infor,`selected audio deviceid ${ret.SoundcardDeviceID}`)
        }
      }           

      if(offer.monitors.length > 1) {
        ret.MonitorHandle = await AskSelectDisplay(offer.monitors)
        Log(LogLevel.Infor,`selected monitor handle ${ret.MonitorHandle}`)
      }

      if (defaultBitrate == null) {
        ret.bitrate= await AskSelectBitrate();
      } else {
        ret.bitrate = defaultBitrate;
      }
      if (defaultFramerate == null) {
        ret.framerate = await AskSelectFramerate();
      } else {
        ret.framerate = defaultFramerate;
      }

      return ret;
  })).Notifier(message => {
    console.log(message);
    TurnOnStatus(message);
  }).Alert(message => {
    TurnOnAlert(message);
  });  



  const _actions = [ {
    icon: <Fullscreen/>,
    name: "Bitrate",  
    action: async () => {
      let bitrate = await AskSelectBitrate();
      if (bitrate < 500) {
        return
      }
      
      console.log(`bitrate is change to ${bitrate}`)
      client.ChangeBitrate(bitrate);
    }, }, {
    icon: <Fullscreen />,
    name: "Enter fullscreen",
    action: async () => {
      document.documentElement.requestFullscreen();
    }, 
  },]

  setActions([..._actions]);
  remoteVideo.current?.addEventListener('touchstart',  (ev) => {
    const touches = ev.changedTouches[0];

    setJoyStick(prev => [...prev,{
      element: 
      <div style={{transform: `translate(${touches.screenX}px,${touches.screenY}px)`}}>
      <Joystick>
      </Joystick> 
      </div>
    }])
  });
  remoteVideo.current?.addEventListener('touchend',    () => {
    setJoyStick(prev => {
      return prev.slice(0,prev.length -1)
    })
  });
  remoteVideo.current?.addEventListener('touchcancel', () => {

  });
  remoteVideo.current?.addEventListener('touchmove',   () => {

  });
  },[])



  const onmove = (event: IJoystickUpdateEvent) => {
    // console.log(event.x)
    // console.log(event.y)
  }


  const abxyGroup = 
        <Draggable>
          <Stack style={{ position: "absolute", bottom: 16, left: 16, zIndex: 2 }} direction="column">
            <Button
              onClick={() =>
                console.log('y')
              }
            >Y</Button>
            <Stack direction="row">
              <Button
                onClick={() =>
                  console.log('x')
                }
              >X</Button>
              <Button
                onClick={() =>
                  console.log('b')
                }
              >B</Button>
            </Stack>
            <Button
              onClick={() =>
                console.log('a')
              }
            >A</Button>
          </Stack>

        </Draggable>



















  return (
    <div>
      <GoogleAnalytics trackPageViews />
      <Head>
        <title>WebRTC remote viewer</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.app}>
      {/* TODO: <Joystick baseColor="darkgreen" stickColor="black" move={onMove} stop={onStop} ></Joystick> */}
        <Draggable>
          <SpeedDial
            ariaLabel="SpeedDial basic example"
            sx={{ position: "absolute", bottom: 16, right: 16 }}
            icon={<List />}
          >
            {actions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={action.action}
              />
            ))}
          </SpeedDial>
        </Draggable>

        {abxyGroup}


        {JoyStick.map((val,index,arr) => { 
          return val.element
        })}
        {/* <Draggable>
          <Stack style={{ position: "absolute", bottom: 16, left: 16, zIndex: 2 }} direction="column">
          </Stack>
        </Draggable> */}
      </div>
      <video ref={remoteVideo} className={styles.remoteVideo} autoPlay muted playsInline loop ></video>
      <audio ref={remoteAudio} autoPlay controls style={{ zIndex: -1 }}></audio>
    </div>
  );
};

export default Home;
