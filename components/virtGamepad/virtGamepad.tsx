"use client"


import { Translate } from "@mui/icons-material";
import { Button, Stack } from "@mui/material";
import React, { useRef, useState, useEffect, useLayoutEffect, useTransition } from "react"; // we need this to make JSX compile
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import styled from "styled-components";
import {
    IJoystickUpdateEvent,
    Joystick,
} from "react-joystick-component/build/lib/Joystick";
import { ButtonMode } from "../control/control";
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
    SelectCallback: () => void;
    StartCallback: () => void;
}) => {
    const { draggable,
        AxisCallback ,
        ButtonCallback,
        SelectCallback,
        StartCallback ,
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
                        SelectCallback={SelectCallback}
                        StartCallback={StartCallback}
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
                baseColor="#000"
                stickColor="hwb(360 51% 76%)"
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
export const ButtonGroupRight = (props: ButtonGroupProps) => {
    const { settingValue } = useSetting()
    const [isPending, startTransition] = useTransition()

    const rightScale = settingValue.gamepad.rightScale

    const [posBtn, setPosBtn] = useState<Position>({
        ybxa: {
            x: 0,
            y: 0
        },
        joystick: {
            x: 0,
            y: 0
        },
        funcBtn: {
            x: 0,
            y: 0
        },
        subBtn: {
            x: 0,
            y: 0
        },
    });

    useLayoutEffect(() => {
        let cache = localStorage.getItem(`right_group_pos`);
        if (cache === null) {
            cache = '{"ybxa":{"x":520,"y":125},"joystick":{"x":400,"y":200},"funcBtn":{"x":518,"y":19},"subBtn":{"x":252,"y":10}}';
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
    console.log(posBtn, 'posBtn');
    const handleDrag = (e: DraggableEvent, data: DraggableData) => {
        //getname => setPos by name. 
        console.log(data);
        const key = data.node.id
        const value = { x: data.x, y: data.y }
        setPosBtn((prev => {
            return {
                ...prev, [key]: value
            }
        }))

    };

    const handleStop = (e: DraggableEvent, data: DraggableData) => {
        localStorage.setItem(`right_group_pos`, JSON.stringify(posBtn));
    };
    return (
        <>
            <WrapperGroupBtn
            >
                <Draggable
                    disabled={props.draggable != "draggable"}
                    position={{ x: posBtn?.funcBtn?.x, y: posBtn?.funcBtn?.y }}
                    onStop={handleStop}
                    onDrag={handleDrag}
                >
                    <div id="funcBtn">
                        <RightFuncButton
                            name='funcBtn'
                            Touch={(index, type) => props.ButtonCallback(index, type)}
                            size={BUTTON_SIZE * rightScale}
                        />
                    </div>
                </Draggable>
                <Draggable
                    disabled={props.draggable != "draggable"}
                    position={{ x: posBtn?.ybxa?.x, y: posBtn?.ybxa?.y }}

                    onStop={handleStop}
                    onDrag={handleDrag}
                >
                    <div id="ybxa">
                        <YBXA
                            size={BUTTON_SIZE * rightScale}
                            onTouch={(e: React.TouchEvent, type, index) =>
                                props.ButtonCallback(index, type)
                            }
                        />
                    </div>
                </Draggable>
                <Draggable
                    disabled={props.draggable != "draggable"}
                    position={{ x: posBtn?.subBtn?.x, y: posBtn?.subBtn?.y }}
                    onStop={handleStop}
                    onDrag={handleDrag}
                >
                    <ContainerSubButton id="subBtn">
                        <SelectBtn onClick={props.SelectCallback}><ArrowLeftIcon /></SelectBtn>
                        <StartBtn onClick={props.StartCallback}><ArrowRightIcon /></StartBtn>
                    </ContainerSubButton>
                </Draggable>
                <Draggable
                    disabled={props.draggable != "draggable"}
                    position={{ x: posBtn?.joystick?.x, y: posBtn?.joystick?.y }}
                    onStop={handleStop}
                    onDrag={handleDrag}
                >
                    <div id="joystick">
                        <JoyStickRight
                            moveCallback={(x: number, y: number) =>
                                props.AxisCallback(x, y, "right")
                            }
                            draggable={props.draggable}
                            size={JOYSTICK_SIZE * rightScale}
                        />
                    </div>
                </Draggable>
                {/* right */}
            </WrapperGroupBtn>
        </>
    );
};
export const ButtonGroupLeft = (param: ButtonGroupProps) => {
    const { settingValue } = useSetting()
    const [isPending, startTransition] = useTransition()

    const leftScale = settingValue.gamepad.leftScale

    const [posBtn, setPosBtn] = useState<Position>({
        dpad: {
            x: 0,
            y: 0
        },
        joystick: {
            x: 0,
            y: 0
        },
        funcBtn: {
            x: 0,
            y: 0
        },
    });

    useLayoutEffect(() => {
        let cache = localStorage.getItem(`left_group_pos`);
        if (cache === null) {
            cache = '{"dpad":{"x":166,"y":107},"joystick":{"x":244,"y":150},"funcBtn":{"x":132,"y":18}}';
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
    console.log(posBtn, 'posBtn');
    const handleDrag = (e: DraggableEvent, data: DraggableData) => {
        //getname => setPos by name. 
        console.log(data);
        const key = data.node.id
        const value = { x: data.x, y: data.y }
        setPosBtn((prev => {
            return {
                ...prev, [key]: value
            }
        }))

    };

    const handleStop = (e: DraggableEvent, data: DraggableData) => {
        localStorage.setItem(`left_group_pos`, JSON.stringify(posBtn));
    };
    return (
        <>
            <WrapperGroupBtn>
                <Draggable
                    disabled={param.draggable != "draggable"}
                    position={{ x: posBtn?.funcBtn?.x, y: posBtn?.funcBtn?.y }}
                    onStop={handleStop}
                    onDrag={handleDrag}>
                    <div
                        id="funcBtn"
                    >
                        <LeftFuncButton
                            Touch={(index, type) => param.ButtonCallback(index, type)}
                            size={BUTTON_SIZE * leftScale}
                        />
                    </div>
                </Draggable>
                <Draggable
                    disabled={param.draggable != "draggable"}
                    position={{ x: posBtn?.dpad?.x, y: posBtn?.dpad?.y }}
                    onStop={handleStop}
                    onDrag={handleDrag}
                >
                    <div
                        id="dpad"
                    >
                        <DPad
                            size={BUTTON_SIZE * leftScale}
                            onTouch={(e: React.TouchEvent, type, index) => {
                                param.ButtonCallback(index, type);
                            }}
                        />

                    </div>
                </Draggable>
                <Draggable
                    disabled={param.draggable != "draggable"}
                    position={{ x: posBtn?.joystick?.x, y: posBtn?.joystick?.y }}
                    onStop={handleStop}
                    onDrag={handleDrag}
                >
                    <div
                        id="joystick"
                    >
                        <JoyStickLeft
                            moveCallback={async (x: number, y: number) => {
                                param.AxisCallback(x, y, "left");
                                return;
                            }}
                            draggable={param.draggable}
                            size={JOYSTICK_SIZE * leftScale}
                        />
                    </div>
                </Draggable>
                {/* left */}
            </WrapperGroupBtn>
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
    SelectCallback?: () => void;
    StartCallback?: () => void;
}

const SubButton = () => {

    return (
        <></>
    )
}

const ContainerVirGamepad = styled.div`
    display: flex;
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
`