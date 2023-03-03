import { Fullscreen  } from "@mui/icons-material";
import SportsEsportsOutlinedIcon from '@mui/icons-material/SportsEsportsOutlined';
import MouseOutlinedIcon from '@mui/icons-material/MouseOutlined';
import VideoSettingsOutlinedIcon from '@mui/icons-material/VideoSettingsOutlined';
import { List, SpeedDial, SpeedDialAction } from "@mui/material";
import React, { useEffect, useState } from "react"; // we need this to make JSX compile
import { WebRTCClient } from "webrtc-streaming-core";
import { getOS , Platform} from "webrtc-streaming-core/dist/utils/platform";
import { AskSelectBitrate } from "../popup/popup";
import { VirtualGamepad } from "../virtGamepad/virtGamepad";
import { VirtualMouse } from "../virtMouse/virtMouse";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";


export type ButtonMode = "static" | "draggable" | "disable";

export const WebRTCControl = (input: { client: WebRTCClient, platform: Platform}) => {
    const [enableVGamepad, setenableVGamepad] = useState<ButtonMode>("disable");
    const [enableVMouse, setenableVMouse] = useState<ButtonMode>("disable");
    const [actions,setactions] = useState<any[]>([]);

    useEffect(()  => {
        console.log(`configuring menu on ${input.platform}`)
        if (input.platform == 'mobile') {
            setactions([{
                icon: <VideoSettingsOutlinedIcon />,
                name: "Bitrate",
                action: async () => {
                    let bitrate = await AskSelectBitrate();
                    if (bitrate < 500 || input.client == null) {
                        return;
                    }
                    console.log(`bitrate is change to ${bitrate}`);
                    input.client?.ChangeBitrate(bitrate);
                },
            },
            {
                icon: <SportsEsportsOutlinedIcon />,
                name: "Edit VGamepad",
                action: async () => {
                    setenableVGamepad((prev) => { try { 
                        switch (prev) {
                            case "disable":
                                    input.client.hid.disableMouse = true; 
                                    input.client.hid.disableTouch(true);
                                return "draggable";
                            case "draggable":
                                return "static";
                            case "static":
                                    input.client.hid.disableMouse = false; 
                                    input.client.hid.disableTouch(false);
                                return "disable";
                        } } catch {} });
                },
            }, {
                icon: <MouseOutlinedIcon />,
                name: "Enable VMouse",
                action: async () => {
                    setenableVMouse((prev) => { try { 
                        switch (prev) {
                            case "disable":
                                input.client.hid.disableMouse = true; 
                                input.client.hid.disableTouch(true);
                                return "draggable";
                            case "draggable":
                                return "static";
                            case "static":
                                input.client.hid.disableMouse = false; 
                                input.client.hid.disableTouch(false);
                                return "disable";
                            }
                        } catch {}
                    });
                },
            } ])
        } else {
            setactions([{
                icon: <VideoSettingsOutlinedIcon />,
                name: "Bitrate",
                action: async () => {
                    let bitrate = await AskSelectBitrate();
                    if (bitrate < 500 || input.client == null) {
                        return;
                    }
                    console.log(`bitrate is change to ${bitrate}`);
                    input.client?.ChangeBitrate(bitrate);
                },
            },
            {
                icon: <Fullscreen />,
                name: "Enter fullscreen",
                action: async () => {
                    document.documentElement.requestFullscreen();
                },
            }])
        }
    },[input.platform])

    











    let Afilter = 0;
	const GamepadACallback = async (x: number, y: number,type: 'left' | 'right') => {
        if (Afilter == 1) {
		    input.client?.hid?.VirtualGamepadAxis(x,y,type);
            Afilter = 0;
        }

        Afilter++;
	}

	const GamepadBCallback = async (index: number,type: 'up' | 'down') => {
		input.client?.hid?.VirtualGamepadButtonSlider(type == 'down',index);
	}

    let filter = 0;
	const MouseJTcallback = async (x: number, y: number) => { // translate cordinate
        if (filter == 30) {
            input.client?.hid?.mouseMoveRel({movementX:x*10,movementY:y*10});
            filter = 0;
        }

        filter++;
	}


	const MouseBTcallback = async (index: number,type: 'up' | 'down' ) => {
		type == 'down' ? input.client?.hid?.MouseButtonDown({button: index}) : input.client?.hid?.MouseButtonUp({button: index})
	}

    return (
        <div>
            <div style={{ zIndex: 2 }}>
                <SpeedDial
                    ariaLabel="SpeedDial basic example"
                    sx={{
                        opacity: 0.3,
                        position: "absolute",
                        bottom: 16,
                        right: 16,
                    }}
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
            </div>

            <PayPalScriptProvider options={{
                "client-id": "AdxCRX7LxtFK0cPQMNwaK7k_0f3zo9ss582ggaFZyuWrsvxzf-KZ5EZMeJKnEcKNMj6pmi2TU_Oa5N5M",
                // "data-client-token": "EJPWK-KL1eYYndvnq_3p4vby028oN8ICwWmWd-UvNyFq35_oZR257bUgaHGC8MVtzrUWd1gM4d_H2BsI",
            }}>
                <PayPalButtons
                    createOrder={(data, actions) => {
                        return actions.order.create({
                            purchase_units: [
                                {
                                    amount: {
                                        value: "0.99",
                                    }
                                }
                            ]
                        });
                    }}
                    onApprove={(data, actions) => {
                        return actions.order.capture().then(function (details){
                            alert("Transaction completed by" + details.payer.name.given_name)
                        });
                    }}
                />
           {/* <BraintreePayPalButtons
                createOrder={(data, actions) => {
                    return actions.braintree.createPayment({
                        flow: "checkout",
                        amount: "10.0",
                        currency: "USD",
                        intent: "capture",  
                    });
                }}
                onApprove={(data, actions) => {
                    return actions.braintree
                        .tokenizePayment(data)
                        .then((payload) => {
                            // call server-side endpoint to finish the sale
                        });
                }}
            /> */}
        </PayPalScriptProvider>

            <VirtualMouse
                MouseMoveCallback={MouseJTcallback} 
                MouseButtonCallback={MouseBTcallback} 
                draggable={enableVMouse}/>

            <VirtualGamepad 
                ButtonCallback={GamepadBCallback} 
                AxisCallback={GamepadACallback} 
                draggable={enableVGamepad}/>
        </div>
    );
};
