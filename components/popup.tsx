import Swal from "sweetalert2";
import { Monitor } from "../webrtc/app";

function TurnOnAlert(error: string): void {
  Swal.fire({
    title: "Opps...",
    text: error,
    icon: "error",
    confirmButtonText: "OK",
  });
}

function TurnOnLoading(): void {
  Swal.fire({
    title: "Initializing...",
    text: "Please wait while the client is getting ready...",
    showConfirmButton: false,
    willOpen: () => Swal.showLoading(),
    willClose: () => Swal.hideLoading(),
  });
}
function TurnOffLoading(): void {
  Swal.close();
}



export async function AskSelectSoundcard(): Promise<string> {
    const { value: fruit } = await Swal.fire({
    title: 'Select field validation',
    input: 'select',
    inputOptions: {
      'Fruits': {
        apples: 'Apples',
        bananas: 'Bananas',
        grapes: 'Grapes',
        oranges: 'Oranges'
      },
      'Vegetables': {
        potato: 'Potato',
        broccoli: 'Broccoli',
        carrot: 'Carrot'
      },
      'icecream': 'Ice cream'
    },
    inputPlaceholder: 'Select a fruit',
    showCancelButton: true,
    inputValidator: (value) => {
      return new Promise((resolve) => {
        if (value === 'oranges') {
          resolve('')
        } else {
          resolve('You need to select oranges :)')
        }
      })
    }
  })



  return fruit
}

export async function AskSelectDisplay(options: Array<Monitor>): Promise<string> {
    let swalInput = {};

    options.forEach((x) => {
        swalInput[x.Device][x.Name] = x.DeviceID;
    })

    const { value: fruit } = await Swal.fire({
    title: 'Select monitor',
    input: 'select',
    inputOptions: {
      'Fruits': {
        apples: 'Apples',
        bananas: 'Bananas',
        grapes: 'Grapes',
        oranges: 'Oranges'
      },
      'Vegetables': {
        potato: 'Potato',
        broccoli: 'Broccoli',
        carrot: 'Carrot'
      },
    },

    inputPlaceholder: 'Select monitor',
    showCancelButton: true,
    inputValidator: (value) => {
      return new Promise((resolve) => {
        if (value === 'oranges') {
          resolve('')
        } else {
          resolve('You need to select oranges :)')
        }
      })
    }
  })

 

  return fruit
}

export async function AskSelectFramerate(): Promise<string> {
    const { value: fruit } = await Swal.fire({
    title: 'Select bitrate',
    input: 'select',
    inputOptions: {
      'Recommended': '30fps',
      'High': '60fps'
    },
    inputPlaceholder: 'Select bitrate',
    showCancelButton: true,
    inputValidator: (value) => {
        return value;
    }
  })

 

  return fruit
}

export async function AskSelectBitrate(): Promise<string> {
    const { value: fruit } = await Swal.fire({
    title: 'Select framerate',
    input: 'select',
    inputOptions: {
      'Recommended': '30fps',
      'High': '60fps'
    },
    inputPlaceholder: 'Select framerate ',
    showCancelButton: true,
    inputValidator: (value) => {
      return value;
    }
  })

 

  return fruit
}