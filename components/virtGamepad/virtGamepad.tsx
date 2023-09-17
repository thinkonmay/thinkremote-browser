"use client"
import React, { useRef, useState, useEffect, useLayoutEffect, useTransition, useContext } from "react"; // we need this to make JSX compile
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import styled from "styled-components";
import { ButtonMode, ConTrolContext } from "../control/control";
import { YBXA } from "./gamepad/y_b_x_a";
import DPad from "./gamepad/d_pad";
import { LeftFuncButton, RightFuncButton } from "./gamepad/func_button";
import { useSetting } from "../../context/settingProvider";
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { JoyStick } from "../joystick/joystick";
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
    rs?: Coordinates
    ls?: Coordinates
}
const defaultButtonGroupRightValue = {
    ybxa: { x: 0.92, y: 0.45 },
    joystick: { x: 0.62, y: 0.45 },
    funcBtn: { x: 0.75, y: 0.043 },
    subBtn: { x: 0.45, y: 0.03 },
    rs: { x: 0.75, y: 0.8 },
}
export const ButtonGroupRight = (props: ButtonGroupProps) => {
    const { settingValue } = useSetting()
    const [isPending, startTransition] = useTransition()
    const { DefaultPosition } = useContext(ConTrolContext);


    const {
        leftJt,
        rightJt,
        dpad,
        ybxa,
        rbRt,
        lbLt, 
        rs
    } = settingValue.gamePad

    const [posBtn, setPosBtn] = useState<Position>(defaultButtonGroupRightValue);
    //delete storage
    useEffect(()=>{
        localStorage.removeItem("right_group_pos");
    }, [])
    useLayoutEffect(() => {
        let cache = localStorage.getItem(`right_group_pos1`);
        if (cache === null) {
            const deviceWidth = window.innerWidth
            const deviceHeight = window.innerHeight
            setPosBtn({
                ybxa: { x: deviceWidth * defaultButtonGroupRightValue.ybxa.x, y: deviceHeight * defaultButtonGroupRightValue.ybxa.y },
                joystick: { x: deviceWidth * defaultButtonGroupRightValue.joystick.x, y: deviceHeight * defaultButtonGroupRightValue.joystick.y },
                funcBtn: { x: deviceWidth * defaultButtonGroupRightValue.funcBtn.x, y: deviceHeight * defaultButtonGroupRightValue.funcBtn.y },
                subBtn: { x: deviceWidth * defaultButtonGroupRightValue.subBtn.x, y: deviceHeight * defaultButtonGroupRightValue.subBtn.y },
                rs: { x: deviceWidth * defaultButtonGroupRightValue.rs.x, y: deviceHeight * defaultButtonGroupRightValue.rs.y },
            })
            return
        }
        const {
            ybxa,
            joystick,
            funcBtn,
            subBtn,
            rs
        } = JSON.parse(cache);

        setPosBtn({
            ybxa,
            joystick,
            funcBtn,
            subBtn,
            rs
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
            localStorage.setItem(`right_group_pos1`, JSON.stringify(posBtn));
        })
    };

    //reset default value
    useEffect(() => {
        if (!DefaultPosition) 
            return

        const deviceWidth = window.innerWidth
        const deviceHeight = window.innerHeight
        const defaultPos = {
            ybxa        : { 
                x: deviceWidth * defaultButtonGroupRightValue.ybxa.x, 
                y: deviceHeight * defaultButtonGroupRightValue.ybxa.y 
            },
            joystick    : { 
                x: deviceWidth * defaultButtonGroupRightValue.joystick.x, 
                y: deviceHeight * defaultButtonGroupRightValue.joystick.y 
            },
            funcBtn     : { 
                x: deviceWidth * defaultButtonGroupRightValue.funcBtn.x, 
                y: deviceHeight * defaultButtonGroupRightValue.funcBtn.y 
            },
            subBtn      : { 
                x: deviceWidth * defaultButtonGroupRightValue.subBtn.x, 
                y: deviceHeight * defaultButtonGroupRightValue.subBtn.y 
            },
        }
        setPosBtn(defaultPos)
        localStorage.setItem(`right_group_pos1`, JSON.stringify(defaultPos));
    }, [DefaultPosition])
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
                position={{ x: posBtn?.rs?.x, y: posBtn?.rs?.y }}
                onStop={handleStop}
                onDrag={handleDrag}
            >
                <WrapperDraggable id="rs">
                    <Rs
                        onTouchStart={() => props.ButtonCallback(11, "down")} 
                        onTouchEnd={() => props.ButtonCallback(11, "up")}
                        draggable={props.draggable}
                        size={BUTTON_SIZE * rs}
                    >RS</Rs>
                </WrapperDraggable>
            </Draggable>
            {/* right */}
        </>
    );
};
const Rs = styled.button`
     /* depened on Container */
    width: ${props => props.size + 'px'};
    height: ${props => props.size + 'px'};
    color: #C3B5B5;
    border: 1px solid currentColor;
    border-radius: 50%;
    position: absolute;
    background-color: transparent;
    -webkit-user-select: none;
    -ms-user-select: none; 
    user-select: none;
    
`;
const Ls = styled.button`
    width: ${props => props.size + 'px'};
    height: ${props => props.size + 'px'};
    color: #C3B5B5;
    border: 1px solid currentColor;
    border-radius: 50%;
    position: absolute;
    background-color: transparent;
    -webkit-user-select: none;
    -ms-user-select: none; 
    user-select: none;
`
const defaultButtonGroupLeftValue = {
    dpad: { x: 0.08, y: 0.45 },
    joystick: { x: 0.3, y: 0.55 },
    funcBtn: { x: 0.13, y: 0.043 },
    ls: { x: 0.2, y: 0.8 }
    
}
export const ButtonGroupLeft = (props: ButtonGroupProps) => {
    const { settingValue } = useSetting()
    const [isPending, startTransition] = useTransition()
    const { DefaultPosition } = useContext(ConTrolContext);

    const {
        leftJt,
        rightJt,
        dpad,
        ybxa,
        rbRt,
        lbLt,
    ls } = settingValue.gamePad
    const [posBtn, setPosBtn] = useState<Position>(defaultButtonGroupLeftValue);
    //delete storage
    useEffect(()=>{
        localStorage.removeItem("left_group_pos");
    }, [])
    useLayoutEffect(() => {
        let cache = localStorage.getItem(`left_group_pos1`);
        if (cache === null) {
            const deviceWidth = window.innerWidth
            const deviceHeight = window.innerHeight
            setPosBtn({
                dpad: { x: deviceWidth * defaultButtonGroupLeftValue.dpad.x, y: deviceHeight * defaultButtonGroupLeftValue.dpad.y },
                joystick: { x: deviceWidth * defaultButtonGroupLeftValue.joystick.x, y: deviceHeight * defaultButtonGroupLeftValue.joystick.y },
                funcBtn: { x: deviceWidth * defaultButtonGroupLeftValue.funcBtn.x, y: deviceHeight * defaultButtonGroupLeftValue.funcBtn.y },
                ls: { x: deviceWidth * defaultButtonGroupLeftValue.ls.x, y: deviceHeight * defaultButtonGroupLeftValue.ls.y },
            })
            return
        }
        const {
            dpad,
            joystick,
            funcBtn,
            ls
        } = JSON.parse(cache);


        setPosBtn({
            dpad,
            joystick,
            funcBtn,
            ls
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
            localStorage.setItem(`left_group_pos1`, JSON.stringify(posBtn));
        })
    };

    //reset default value
    useEffect(() => {
        if (!DefaultPosition) 
            return

        const deviceWidth = window.innerWidth
        const deviceHeight = window.innerHeight
        const defaultPos = {
            dpad: { 
                x: deviceWidth * defaultButtonGroupLeftValue.dpad.x, 
                y: deviceHeight * defaultButtonGroupLeftValue.dpad.y 
            },
            joystick: { 
                x: deviceWidth * defaultButtonGroupLeftValue.joystick.x, 
                y: deviceHeight * defaultButtonGroupLeftValue.joystick.y 
            },
            funcBtn: { 
                x: deviceWidth * defaultButtonGroupLeftValue.funcBtn.x, 
                y: deviceHeight * defaultButtonGroupLeftValue.funcBtn.y 
            },
            ls: { 
                x: deviceWidth * defaultButtonGroupLeftValue.ls.x, 
                y: deviceHeight * defaultButtonGroupLeftValue.ls.y 
            },
        }
        setPosBtn(defaultPos)
        localStorage.setItem(`left_group_pos1`, JSON.stringify(defaultPos));
    }, [DefaultPosition])
    return (
        <>
            <Draggable
                disabled={props.draggable != "draggable"}
                position={{ x: posBtn?.funcBtn?.x, y: posBtn?.funcBtn?.y }}
                onStop={handleStop}
                onDrag={handleDrag}>
                <WrapperDraggable
                    id="funcBtn"
                >
                    <LeftFuncButton
                        Touch={(index, type) => props.ButtonCallback(index, type)}
                        size={BUTTON_SIZE * lbLt}
                    />
                </WrapperDraggable>
            </Draggable>
            <Draggable
                disabled={props.draggable != "draggable"}
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
                            props.ButtonCallback(index, type);
                        }}
                    />

                </WrapperDraggable>
            </Draggable>
            <Draggable
                disabled={props.draggable != "draggable"}
                position={{ x: posBtn?.ls?.x, y: posBtn?.ls?.y }}
                onStop={handleStop}
                onDrag={handleDrag}
            >
                <WrapperDraggable
                    id="ls"
                >
                    <Ls
                        onTouchStart={() => props.ButtonCallback(10, "down")} 
                        onTouchEnd={() => props.ButtonCallback(10, "up")}
                        draggable={props.draggable}
                        size={BUTTON_SIZE * ls}
                    >LS</Ls>
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
