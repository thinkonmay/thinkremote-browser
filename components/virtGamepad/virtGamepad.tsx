"use client"
import React, { useRef, useState, useEffect, useLayoutEffect, useTransition, useContext } from "react"; // we need this to make JSX compile
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import styled from "styled-components";
import {
    IJoystickUpdateEvent,
    Joystick,
} from "react-joystick-component/build/lib/Joystick";

import { ButtonMode, ConTrolContext } from "../control/control";
import { YBXA } from "./gamepad/y_b_x_a";
import DPad from "./gamepad/d_pad";
import { LeftFuncButton, RightFuncButton } from "./gamepad/func_button";
import { useSetting } from "../../context/settingProvider";
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
const BUTTON_SIZE = 50
const JOYSTICK_SIZE = 100

export const VirtualGamepad = (props: {
    draggable: ButtonMode;
    AxisCallback: (
        x: number,
        y: number,
        type: "left" | "right"
    ) => Promise<void>;
    ButtonCallback: (index: number, type: "up" | "down") => Promise<void>;
}) => {
    const { draggable,
        AxisCallback,
        ButtonCallback,
    } = props


    return (
        <>
            {draggable == "static" || draggable == "draggable" ? (
                <ContainerVirGamepad style={{ zIndex: 2 }}>
                    <ButtonGroupLeft
                        AxisCallback={AxisCallback}
                        ButtonCallback={ButtonCallback}
                        draggable={draggable}
                    />

                    <ButtonGroupRight
                        AxisCallback={AxisCallback}
                        ButtonCallback={ButtonCallback}
                        draggable={draggable}
                    />
                </ContainerVirGamepad>
            ) : null}
        </>
    );
};

export const JoyStick = (param: {
    draggable: ButtonMode;
    moveCallback: (x: number, y: number) => Promise<void>;
    className: string;
    size: number,
}) => {

    const { draggable, moveCallback, className, size = 100 } = param
    const [enableJT, setenableJT] = useState<boolean>(false);

    const move = (event: IJoystickUpdateEvent) => {
        if (event.type == "move") {
            if (!enableJT) {
                moveCallback(0, 0);
                return;
            }
            moveCallback(event.x, -event.y);
        } else if (event.type == "stop") {
            setenableJT(false);
            moveCallback(0, 0);
        } else if (event.type == "start") {
            setenableJT(true);
        }
    };

    return (
        <WrapperJoyStick className={className}>
            <Joystick
                start={move}
                stop={move}
                move={move}
                size={size}
                baseColor="rgba(0, 0, 0, 0.1)"
                stickColor="rgba(255, 255, 255, 0.52"
                disabled={draggable === 'draggable'}
            />
        </WrapperJoyStick>
    );
};
interface Coordinates {
    x: number;
    y: number
}

type Position = {
    ybxa?: Coordinates
    joystick: Coordinates
    funcBtn: Coordinates
    dpad?: Coordinates
    subBtn?: Coordinates
}
const defaultButtonGroupRightValue = {
    ybxa: { x: 0.85, y: 0.45 },
    joystick: { x: 0.65, y: 0.7 },
    funcBtn: { x: 0.75, y: 0.043 },
    subBtn: { x: 0.45, y: 0.03 }
}
export const ButtonGroupRight = (props: ButtonGroupProps) => {
    const { settingValue } = useSetting()
    const [isPending, startTransition] = useTransition()
    const { isSetVGamePadDefaultValue } = useContext(ConTrolContext);


    const {
        leftJt,
        rightJt,
        dpad,
        ybxa,
        rbRt,
        lbLt, } = settingValue.gamePad

    const [posBtn, setPosBtn] = useState<Position>(defaultButtonGroupRightValue);

    useLayoutEffect(() => {
        let cache = localStorage.getItem(`right_group_pos`);
        if (cache === null) {
            const deviceWidth = window.innerWidth
            const deviceHeight = window.innerHeight
            setPosBtn({
                ybxa: { x: deviceWidth * defaultButtonGroupRightValue.ybxa.x, y: deviceHeight * defaultButtonGroupRightValue.ybxa.y },
                joystick: { x: deviceWidth * defaultButtonGroupRightValue.joystick.x, y: deviceHeight * defaultButtonGroupRightValue.joystick.y },
                funcBtn: { x: deviceWidth * defaultButtonGroupRightValue.funcBtn.x, y: deviceHeight * defaultButtonGroupRightValue.funcBtn.y },
                subBtn: { x: deviceWidth * defaultButtonGroupRightValue.subBtn.x, y: deviceHeight * defaultButtonGroupRightValue.subBtn.y },
            })
            return
        }
        const {
            ybxa,
            joystick,
            funcBtn,
            subBtn
        } = JSON.parse(cache);

        setPosBtn({
            ybxa,
            joystick,
            funcBtn,
            subBtn
        });
    }, []);
    const handleDrag = (e: DraggableEvent, data: DraggableData) => {
        //getname => setPos by name. 
        const key = data.node.id
        const value = { x: data.x, y: data.y }
        startTransition(() => {
            setPosBtn((prev => {
                return {
                    ...prev, [key]: value
                }
            }))
        })

    };

    const handleStop = (e: DraggableEvent, data: DraggableData) => {
        startTransition(() => {
            localStorage.setItem(`right_group_pos`, JSON.stringify(posBtn));
        })
    };

    //reset default value
    useEffect(() => {
        if (isSetVGamePadDefaultValue === true) {
            const deviceWidth = window.innerWidth
            const deviceHeight = window.innerHeight
            const defaultPos = {
                ybxa: { x: deviceWidth * defaultButtonGroupRightValue.ybxa.x, y: deviceHeight * defaultButtonGroupRightValue.ybxa.y },
                joystick: { x: deviceWidth * defaultButtonGroupRightValue.joystick.x, y: deviceHeight * defaultButtonGroupRightValue.joystick.y },
                funcBtn: { x: deviceWidth * defaultButtonGroupRightValue.funcBtn.x, y: deviceHeight * defaultButtonGroupRightValue.funcBtn.y },
                subBtn: { x: deviceWidth * defaultButtonGroupRightValue.subBtn.x, y: deviceHeight * defaultButtonGroupRightValue.subBtn.y },
            }
            setPosBtn(defaultPos)
            localStorage.setItem(`right_group_pos`, JSON.stringify(defaultPos));

        }
    }, [isSetVGamePadDefaultValue])
    return (
        <>
            <Draggable
                disabled={props.draggable != "draggable"}
                position={{ x: posBtn?.funcBtn?.x, y: posBtn?.funcBtn?.y }}
                onStop={handleStop}
                onDrag={handleDrag}
            >
                <WrapperDraggable id="funcBtn">
                    <RightFuncButton
                        name='funcBtn'
                        Touch={(index, type) => props.ButtonCallback(index, type)}
                        size={BUTTON_SIZE * rbRt}
                    />
                </WrapperDraggable>
            </Draggable>
            <Draggable
                disabled={props.draggable != "draggable"}
                position={{ x: posBtn?.ybxa?.x, y: posBtn?.ybxa?.y }}

                onStop={handleStop}
                onDrag={handleDrag}
            >
                <WrapperDraggable id="ybxa">
                    <YBXA
                        size={BUTTON_SIZE * ybxa}
                        onTouch={(e: React.TouchEvent, type, index) =>
                            props.ButtonCallback(index, type)
                        }
                    />
                </WrapperDraggable>
            </Draggable>
            <Draggable
                disabled={props.draggable != "draggable"}
                position={{ x: posBtn?.subBtn?.x, y: posBtn?.subBtn?.y }}
                onStop={handleStop}
                onDrag={handleDrag}
            >
                <ContainerSubButton id="subBtn">
                    <SelectBtn 
                        onTouchStart={() => props.ButtonCallback(8, "down")} 
                        onTouchEnd={() => props.ButtonCallback(8, "up")}
                    >
                        <ArrowLeftIcon />
                    </SelectBtn>
                    <StartBtn
                        onTouchStart={() => props.ButtonCallback(9, "down")} 
                        onTouchEnd={() => props.ButtonCallback(9, "up")}
                    >
                        <ArrowRightIcon />
                    </StartBtn>
                </ContainerSubButton>
            </Draggable>
            <Draggable
                disabled={props.draggable != "draggable"}
                position={{ x: posBtn?.joystick?.x, y: posBtn?.joystick?.y }}
                onStop={handleStop}
                onDrag={handleDrag}
            >
                <WrapperDraggable id="joystick">
                    <JoyStickRight
                        moveCallback={(x: number, y: number) =>
                            props.AxisCallback(x, y, "right")
                        }
                        draggable={props.draggable}
                        size={JOYSTICK_SIZE * rightJt}
                    />
                </WrapperDraggable>
            </Draggable>
            {/* right */}
        </>
    );
};

const defaultButtonGroupLeftValue = {
    dpad: { x: 0.15, y: 0.45 },
    joystick: { x: 0.2, y: 0.7 },
    funcBtn: { x: 0.13, y: 0.043 }
}
export const ButtonGroupLeft = (param: ButtonGroupProps) => {
    const { settingValue } = useSetting()
    const [isPending, startTransition] = useTransition()
    const { isSetVGamePadDefaultValue } = useContext(ConTrolContext);

    const {
        leftJt,
        rightJt,
        dpad,
        ybxa,
        rbRt,
        lbLt, } = settingValue.gamePad
    const [posBtn, setPosBtn] = useState<Position>(defaultButtonGroupLeftValue);

    useLayoutEffect(() => {
        let cache = localStorage.getItem(`left_group_pos`);
        if (cache === null) {
            const deviceWidth = window.innerWidth
            const deviceHeight = window.innerHeight
            setPosBtn({
                dpad: { x: deviceWidth * defaultButtonGroupLeftValue.dpad.x, y: deviceHeight * defaultButtonGroupLeftValue.dpad.y },
                joystick: { x: deviceWidth * defaultButtonGroupLeftValue.joystick.x, y: deviceHeight * defaultButtonGroupLeftValue.joystick.y },
                funcBtn: { x: deviceWidth * defaultButtonGroupLeftValue.funcBtn.x, y: deviceHeight * defaultButtonGroupLeftValue.funcBtn.y },
            })
            return
        }
        const {
            dpad,
            joystick,
            funcBtn,
        } = JSON.parse(cache);


        setPosBtn({
            dpad,
            joystick,
            funcBtn,
        });
    }, []);

    const handleDrag = (e: DraggableEvent, data: DraggableData) => {
        const key = data.node.id
        const value = { x: data.x, y: data.y }
        startTransition(() => {
            setPosBtn((prev => {
                return {
                    ...prev, [key]: value
                }
            }))
        })

    };

    const handleStop = (e: DraggableEvent, data: DraggableData) => {
        startTransition(() => {
            localStorage.setItem(`left_group_pos`, JSON.stringify(posBtn));
        })
    };

    //reset default value
    useEffect(() => {
        if (isSetVGamePadDefaultValue === true) {
            const deviceWidth = window.innerWidth
            const deviceHeight = window.innerHeight
            const defaultPos = {
                dpad: { x: deviceWidth * defaultButtonGroupLeftValue.dpad.x, y: deviceHeight * defaultButtonGroupLeftValue.dpad.y },
                joystick: { x: deviceWidth * defaultButtonGroupLeftValue.joystick.x, y: deviceHeight * defaultButtonGroupLeftValue.joystick.y },
                funcBtn: { x: deviceWidth * defaultButtonGroupLeftValue.funcBtn.x, y: deviceHeight * defaultButtonGroupLeftValue.funcBtn.y },
            }
            setPosBtn(defaultPos)
            localStorage.setItem(`left_group_pos`, JSON.stringify(defaultPos));

        }
    }, [isSetVGamePadDefaultValue])
    return (
        <>
            <Draggable
                disabled={param.draggable != "draggable"}
                position={{ x: posBtn?.funcBtn?.x, y: posBtn?.funcBtn?.y }}
                onStop={handleStop}
                onDrag={handleDrag}>
                <WrapperDraggable
                    id="funcBtn"
                >
                    <LeftFuncButton
                        Touch={(index, type) => param.ButtonCallback(index, type)}
                        size={BUTTON_SIZE * lbLt}
                    />
                </WrapperDraggable>
            </Draggable>
            <Draggable
                disabled={param.draggable != "draggable"}
                position={{ x: posBtn?.dpad?.x, y: posBtn?.dpad?.y }}
                onStop={handleStop}
                onDrag={handleDrag}
            >
                <WrapperDraggable
                    id="dpad"
                >
                    <DPad
                        size={BUTTON_SIZE * dpad}
                        onTouch={(e: React.TouchEvent, type, index) => {
                            param.ButtonCallback(index, type);
                        }}
                    />

                </WrapperDraggable>
            </Draggable>
            <Draggable
                disabled={param.draggable != "draggable"}
                position={{ x: posBtn?.joystick?.x, y: posBtn?.joystick?.y }}
                onStop={handleStop}
                onDrag={handleDrag}
            >
                <WrapperDraggable
                    id="joystick"
                >
                    <JoyStickLeft
                        moveCallback={async (x: number, y: number) => {
                            param.AxisCallback(x, y, "left");
                            return;
                        }}
                        draggable={param.draggable}
                        size={JOYSTICK_SIZE * leftJt}
                    />
                </WrapperDraggable>
            </Draggable>
            {/* left */}
        </>
    );
};
interface ButtonGroupProps {
    draggable: Partial<ButtonMode>;
    AxisCallback: (
        x: number,
        y: number,
        type: "left" | "right"
    ) => Promise<void>;
    ButtonCallback: (index: number, type: "up" | "down") => Promise<void>;
}

const ContainerVirGamepad = styled.div`
    width: 100vw;
    height: 100vh;
    position: relative;
`;
const WrapperJoyStick = styled.div``;
const WrapperDrag = styled.div`
    max-width: max-content;
    opacity: 0.3;
`;
const WrapperGroupBtn = styled.div`
    /*width: 50vw;
    height: 100vh;
    position: relative;*/
`;

const CssDefaultCenterBtn = styled.button`
    width: 50px;
    height: 25px;
    outline: none;
    background-color: transparent;
    color: #C3B5B5;
    border: 1px solid #C3B5B5;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    :active {
        background-color: rgb(97 76 76 / 15%);;
    }
`;
const SelectBtn = styled(CssDefaultCenterBtn)`
    /*position: absolute;
    top: 50%;
    right: 10px;*/
`;
const StartBtn = styled(CssDefaultCenterBtn)`
    /*position: absolute;
    top: 50%;
    left: 10px;*/
`;

const JoyStickRight = styled(JoyStick)`
    /*position: absolute;
    opacity: 0.3;
    bottom: 10%;
    right: 50%;*/
`;
const JoyStickLeft = styled(JoyStick)`
    /*position: absolute;
    opacity: 0.3;
    top: 50%;
    right: 50%;*/
`;

const ContainerSubButton = styled.div`
    display: flex;
    gap: 8px;
    width: max-content;
    position: absolute;
`
const WrapperDraggable = styled.div`
    width: max-content;
    position: absolute;
`
