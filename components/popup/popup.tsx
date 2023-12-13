"use client"
import Swal from "sweetalert2";
import 'sweetalert2/src/sweetalert2.scss'

let have_swal : 'confirm' | 'popup' | 'none' = "none";

export async function TurnOnAlert(error: string, title?: string, icon?: 'error' | 'info' | 'warning' ): Promise<void> {
    if (have_swal == 'popup') {
        TurnOffStatus();
        have_swal = 'none'
    } 

    if (have_swal == 'confirm') {
        return
    }


    have_swal = 'popup';
    Swal.fire({
        title: title ?? "Opps...",
        text: error,
        icon: icon ?? "error",
        confirmButtonText: "OK",
    });
}

export async function TurnOnConfirm(status: string, text?: string): Promise<void> {
    while (have_swal == 'confirm') {
		await new Promise(r => setTimeout(r, 300));
    }

    if (have_swal == 'popup') {
        TurnOffStatus();
        have_swal = 'none'
    }


    have_swal = 'confirm'
    await Swal.fire({
        title: `${status}`,
        text: text ?? "Please click on screen to start",
        confirmButtonText: "START",
        showConfirmButton: true,
    });
    have_swal = 'none'
}
export function TurnOnStatus(status: string, text?: string): void {
    if (have_swal == 'popup') {
        TurnOffStatus();
    } 

    if (have_swal == 'confirm') {
        return
    }

    have_swal = 'popup';
    Swal.fire({
        title: `${status}`,
        text: text ?? "Please wait while the client is getting ready...",
        showConfirmButton: false,
        timer: 2000,
        willOpen: () => Swal.showLoading(null),
        willClose: () => Swal.hideLoading(),
    });
}

export function TurnOffStatus(): void {
    Swal.close();
}


export async function TurnOnClipboard(): Promise<string | null> {
    const { value: text } = await Swal.fire({
        input: 'textarea',
        inputLabel: 'Message',
        inputPlaceholder: 'Type your message here...',
        inputAttributes: {
            'aria-label': 'Type your message here'
        },
        showCancelButton: false
    })
    Swal.close();

    if (text) {
        return text
    } else {
        return null
    }
}


export async function AskSelectDisplay( monitors: string[]): Promise<{
        display:string,
        width:number,
        height:number,
        framerate:number,
    }> {

    TurnOffStatus();
    const swalInput = {};

    const ratio = window.screen.width / window.screen.height
    const options = [
        4  / 3,
        16 / 10,
        16 / 9,
        2  / 1
    ]

    const selection = options
        .sort( (a,b) => Math.abs(a - ratio) - Math.abs(b - ratio))
        .at(0)

    monitors.forEach(monitor => {
        swalInput[`${monitor}`] = {}
        swalInput[`${monitor}`][`${monitor}|1280|720|240`]     = "HD"
        swalInput[`${monitor}`][`${monitor}|1920|${1920 / selection}|240`]    = "FullHD"
        swalInput[`${monitor}`][`${monitor}|2560|${2560 / selection}|240`]    = "2K"
        swalInput[`${monitor}`][`${monitor}|3840|${3840 / selection}|240`]    = "4K"
    })

    const { value } = await Swal.fire({
        title: "Select monitor",
        input: "select",
        inputOptions: swalInput,
        inputPlaceholder: "Select monitor",
        showCancelButton: false,
        inputValidator: (value) => "" ,
    });

    if(!value) return
    return {
        display:              (value as string).split('|').at(0),
        width:       parseInt((value as string).split('|').at(1)),
        height:      parseInt((value as string).split('|').at(2)),
        framerate:   parseInt((value as string).split('|').at(3)),
    };
}


export async function AskSelectBitrate(): Promise<number> {
    TurnOffStatus();
    const { value: bitrate } = await Swal.fire({
        title: "Select bitrate",
        input: "select",
        inputOptions: {
            "500": "500 kbps",
            "1000": "1 mbps",
            "2000": "2 mbps",
            "3000": "3 mbps",
            "6000": "6 mbps (*Recommend)",
            "8000": "8 mbps",
            "10000": "10 mbps",
             "20000": "20 mbps",
            //  "30000": "30 mbps",
            //  "40000": "40 mbps",
            // "60000": "60 mbps",
            // "80000": "80 mbps",
        },
        inputPlaceholder: "Select bitrate",
        showCancelButton: false,
        inputValidator: (value) => {
            return "";
        },
    });

    return Number.parseInt(bitrate);
}
