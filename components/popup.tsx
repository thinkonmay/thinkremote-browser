import Swal from "sweetalert2";
import { Monitor } from "../webrtc/models/devices.model";
import { Soundcard } from "../webrtc/models/devices.model";

let have_swal = false
export async function TurnOnAlert(error: string): Promise<void> {
  if (have_swal) {
    TurnOffStatus()
  }

  Swal.fire({
    title: "Opps...",
    text: error,
    icon: "error",
    confirmButtonText: "OK",
    timer: 3000
  });
  have_swal = true;
}

export function TurnOnStatus(status: string): void {
  if (have_swal) {
    TurnOffStatus()
  }

  Swal.fire({
    title: `Application status: ${status}`,
    text: "Please wait while the client is getting ready...",
    showConfirmButton: false,
    timer: 3000,
    willOpen: () => Swal.showLoading(null),
    willClose: () => Swal.hideLoading(),
  });
  have_swal = true;
}

export function TurnOffStatus(): void {
  Swal.close();
}



export async function AskSelectSoundcard(soundcards: Array<Soundcard>): Promise<string> {
    TurnOffStatus();

    let swalInput = {};
    soundcards.forEach((x) => {
        if(swalInput[x.Api] == null){
          swalInput[x.Api] = {}
        }
        swalInput[x.Api][x.DeviceID] = x.Name;
    })

    const { value: DeviceID } = await Swal.fire({
    title: 'Select a soundcard device',
    input: 'select',
    inputOptions: swalInput,
    inputPlaceholder: 'Click here',
    showCancelButton: false,
    inputValidator: (value) => {
        for( var x of soundcards) {
          if (x.Name == value) {
            return ''
        }}

    }})



    return DeviceID
}

export async function AskSelectDisplay(monitors: Array<Monitor>): Promise<string> {
    TurnOffStatus();
    let swalInput = {};

    monitors.forEach((x) => {
        if(swalInput[x.Adapter] == null){
          swalInput[x.Adapter] = {}
        }

        swalInput[x.Adapter][x.MonitorHandle] = x.MonitorName;
    })

    const { value: MonitorHandle } = await Swal.fire({
    title: 'Select monitor',
    input: 'select',
    inputOptions: swalInput,
    inputPlaceholder: 'Select monitor',
    showCancelButton: false,
    inputValidator: (value) => {
        for( var x of monitors) {
          if (x.MonitorName == value) {
            return ''
        }}

    }
  })

 

  return MonitorHandle
}

export async function AskSelectFramerate(): Promise<number> {
    TurnOffStatus();
    const { value: framerate } = await Swal.fire({
      title: 'Select framerate',
      input: 'select',
      inputOptions: {
        '30': '30fps',
        '40': '40fps',
        '50': '50fps',
        '55': '55fps',
        '59': '59fps',
        '60': '60fps'
    },
    inputPlaceholder: 'Select framerate',
    showCancelButton: false,
    inputValidator: (value) => {
        return '';
    }
  })

 

  return Number.parseInt(framerate)
}

export async function AskSelectBitrate(): Promise<number> {
    TurnOffStatus();
    const { value: bitrate } = await Swal.fire({
    title: 'Select bitrate',
    input: 'select',
    inputOptions: {
      '500': '500 kbps',
      '1000': '1 mbps',
      '2000': '2 mbps',
      '3000': '3 mbps',
      '6000': '6 mbps',
      '10000': '10 mbps'
    },
    inputPlaceholder: 'Select bitrate',
    showCancelButton: false,
    inputValidator: (value) => {
      return '';
    }
  })

 

  return Number.parseInt(bitrate)
}