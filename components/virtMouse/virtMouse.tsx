"use client"


import React, { useState, useEffect } from "react"; // we need this to make JSX compile
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import styled from "styled-components";
import {
    IJoystickUpdateEvent,
    Joystick,
} from "react-joystick-component/build/lib/Joystick";
import { ButtonMode } from "../control/control";
import { LR } from "../gamepad/y_b_x_a";

export const JoyStick = (param: {
    draggable: ButtonMode;
    moveCallback: (x: number, y: number) => Promise<void>;
}) => {
    const [enableJT, setenableJT] = useState<boolean>(false);
    const [position, setPosition] = useState<{ x: number; y: number }>({
        x: 0,
        y: 0,
    });
    // set interval to send position per 100ms

    const move = (event: IJoystickUpdateEvent) => {
        if (event.type == "move") {
            if (!enableJT) {
                // param.moveCallback(0, 0);
                setPosition({ x: 0, y: 0 });
                return;
            }
            // param.moveCallback(event.`x, -event.y);
            setPosition({ x: event.x, y: -event.y });
        } else if (event.type == "stop") {
            setenableJT(false);
            setPosition({ x: 0, y: 0 });
        } else if (event.type == "start") {
            setenableJT(true);
        }
    };
    useEffect(() => {
        const set = () => { param.moveCallback(position.x * 6, position.y * 6) }

        set();
        const intervalSendPos = setInterval(set, 5);
        return () => { clearInterval(intervalSendPos); };
    }, [position]);
    return (
        <Joystick
            start={move}
            stop={move}
            move={move}
            baseColor="#000"
            stickColor="hwb(360 51% 76%)"
        />
    );
};

interface ButtonGroupProps {
    draggable: Partial<ButtonMode>;
    AxisCallback: (x: number, y: number) => Promise<void>;
    ButtonCallback: (index: number, type: "up" | "down") => Promise<void>;
}

const MouseGroup = (param: ButtonGroupProps) => {
    const [posBtn, setPosBtn] = useState({ x: 0, y: 0 });
    useEffect(() => {
        let cache = localStorage.getItem(`mouse_group_pos`);
        const { x, y } = JSON.parse(
            cache != null ? cache : `{"x": 25, "y" : 140}`
        );
        if (x == null || y == null) {
            return;
        }

        console.log(`get ${x} ${y} from storage`);
        setPosBtn({ x: x, y: y });
    }, []);

    const handleDrag = (e: DraggableEvent, data: DraggableData) => {
        setPosBtn({
            x: data.x,
            y: data.y,
        });
    };

    const handleStop = (e: DraggableEvent, data: DraggableData) => {
        const { x, y } = posBtn;
        if (x == null || y == null) {
            return;
        }

        localStorage.setItem(`mouse_group_pos`, JSON.stringify(posBtn));
        console.log(`set ${x} ${y} to storage`);
    };

    return (
        <Draggable
            disabled={param.draggable != "draggable"}
            position={{ x: posBtn.x, y: posBtn.y }}
            onStop={handleStop}
            onDrag={handleDrag}
        >
            <WrapperDrag>
                <LR
                    size={120}
                    onTouch={(e: React.TouchEvent, type, index) => {
                        param.ButtonCallback(index, type);
                    }}
                ></LR>
                {/* <JoyStick moveCallback={param.AxisCallback} draggable={param.draggable}></JoyStick>  */}
            </WrapperDrag>
        </Draggable>
    );
};
const JoyStickBtn = (param: ButtonGroupProps) => {
    const [posBtn, setPosBtn] = useState({ x: 0, y: 0 });
    useEffect(() => {
        let cache = localStorage.getItem(`joystick_btn_pos`);
        const { x, y } = JSON.parse(
            cache != null ? cache : `{"x": 160, "y" : 25}`
        );
        if (x == null || y == null) {
            return;
        }

        console.log(`get ${x} ${y} from storage`);
        setPosBtn({ x: x, y: y });
    }, []);

    const handleDrag = (e: DraggableEvent, data: DraggableData) => {
        const { x, y } = posBtn;
        setPosBtn({
            x: data.x,
            y: data.y,
        });
    };

    const handleStop = (e: DraggableEvent, data: DraggableData) => {
        const { x, y } = posBtn;
        if (x == null || y == null) {
            return;
        }

        localStorage.setItem(`joystick_btn_pos`, JSON.stringify(posBtn));
        console.log(`set ${x} ${y} to storage`);
    };

    return (
        <Draggable
            disabled={param.draggable != "draggable"}
            position={{ x: posBtn.x, y: posBtn.y }}
            onStop={handleStop}
            onDrag={handleDrag}
        >
            <WrapperDrag>
                <JoyStick
                    moveCallback={param.AxisCallback}
                    draggable={param.draggable}
                ></JoyStick>
            </WrapperDrag>
        </Draggable>
    );
};
export const VirtualMouse = (param: {
    draggable: ButtonMode;
    MouseMoveCallback: (move_x: number, move_y: number) => Promise<void>;
    MouseButtonCallback: (index: number, type: "up" | "down") => Promise<void>;
}) => {
    return (
        <div>
            {param.draggable == "static" || param.draggable == "draggable" ? (
                <ContainerVirtMouse>
                    <MouseGroup
                        AxisCallback={param.MouseMoveCallback}
                        ButtonCallback={param.MouseButtonCallback}
                        draggable={param.draggable}
                    />
                    <JoyStickBtn
                        AxisCallback={param.MouseMoveCallback}
                        ButtonCallback={param.MouseButtonCallback}
                        draggable={param.draggable}
                    />
                </ContainerVirtMouse>
            ) : null}
        </div>
    );
};

const ContainerVirtMouse = styled.div`
    display: flex;
    align-items: center;
`;
const WrapperDrag = styled.div`
    max-width: max-content;
    opacity: 0.3;
`;
