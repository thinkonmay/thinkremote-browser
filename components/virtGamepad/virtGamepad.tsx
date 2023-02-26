import { Translate } from "@mui/icons-material";
import { Button, Stack } from "@mui/material";
import React, { useRef, useState, useEffect } from "react"; // we need this to make JSX compile
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import styled from "styled-components";
import {
    IJoystickUpdateEvent,
    Joystick,
} from "react-joystick-component/build/lib/Joystick";
import { ButtonMode } from "../control/control";
import { YBXA } from "../gamepad/y_b_x_a";
import DPad from "../gamepad/d_pad";
import { LeftFuncButton, RightFuncButton } from "../gamepad/func_button";

export const JoyStick = (param: {
    draggable: ButtonMode;
    moveCallback: (x: number, y: number) => Promise<void>;
    className: string;
}) => {
    const [enableJT, setenableJT] = useState<boolean>(false);

    const move = (event: IJoystickUpdateEvent) => {
        if (event.type == "move") {
            if (!enableJT) {
                param.moveCallback(0, 0);
                return;
            }
            param.moveCallback(event.x, -event.y);
        } else if (event.type == "stop") {
            setenableJT(false);
            param.moveCallback(0, 0);
        } else if (event.type == "start") {
            setenableJT(true);
        }
    };

    return (
        <WrapperJoyStick className={param.className}>
            <Joystick
                start={move}
                stop={move}
                move={move}
                // className={param.className}
                baseColor="#000"
                stickColor="hwb(360 51% 76%)"
            />
        </WrapperJoyStick>
    );
};
interface ButtonGroupProps {
    draggable: Partial<ButtonMode>;
    AxisCallback: (
        x: number,
        y: number,
        type: "left" | "right"
    ) => Promise<void>;
    ButtonCallback: (index: number, type: "press" | "release") => Promise<void>;
}
export const ButtonGroupRight = (param: ButtonGroupProps) => {
    const [posBtn, setPosBtn] = useState({ x: 0, y: 0 });
    useEffect(() => {
        let cache = localStorage.getItem(`right_group_pos`);
        const { x, y } = JSON.parse(
            cache != null ? cache : `{"x": 0, "y" : 0}`
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

        localStorage.setItem(`right_group_pos`, JSON.stringify(posBtn));
        console.log(`set ${x} ${y} to storage`);
    };

    return (
        <Draggable
            disabled={param.draggable != "draggable"}
            position={{ x: posBtn.x, y: posBtn.y }}
            onStop={handleStop}
            onDrag={handleDrag}
        >
            <WrapperGroupBtn>
                <RightFuncButton />
                <YBXA
                    size={35}
                    onTouch={(e: React.TouchEvent, type, index) => {
                        param.ButtonCallback(
                            index,
                            type == "up" ? "press" : "release"
                        );
                    }}
                />
                <StartBtn />
                <JoyStickRight
                    moveCallback={async (x: number, y: number) => {
                        param.AxisCallback(x, y, "right");
                        return;
                    }}
                    draggable={param.draggable}
                />
                {/* right */}
            </WrapperGroupBtn>
        </Draggable>
    );
};
export const ButtonGroupLeft = (param: ButtonGroupProps) => {
    const [posBtn, setPosBtn] = useState({ x: 0, y: 0 });
    useEffect(() => {
        let cache = localStorage.getItem(`left_group_pos`);
        const { x, y } = JSON.parse(
            cache != null ? cache : `{"x": 0, "y" : 0}`
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

        localStorage.setItem(`left_group_pos`, JSON.stringify(posBtn));
        console.log(`set ${x} ${y} to storage`);
    };
    return (
        <Draggable
            disabled={param.draggable != "draggable"}
            position={{ x: posBtn.x, y: posBtn.y }}
            onStop={handleStop}
            onDrag={handleDrag}
        >
            <WrapperGroupBtn>
                <LeftFuncButton />

                <JoyStickLeft
                    moveCallback={async (x: number, y: number) => {
                        param.AxisCallback(x, y, "left");
                        return;
                    }}
                    draggable={param.draggable}
                />
                <SelectBtn />
                <DPad
                    size={50}
                    onTouch={(e: React.TouchEvent, type, index) => {
                        param.ButtonCallback(
                            index,
                            type == "up" ? "press" : "release"
                        );
                    }}
                ></DPad>
                {/* left */}
            </WrapperGroupBtn>
        </Draggable>
    );
};

export const VirtualGamepad = (param: {
    draggable: ButtonMode;
    AxisCallback: (
        x: number,
        y: number,
        type: "left" | "right"
    ) => Promise<void>;
    ButtonCallback: (index: number, type: "press" | "release") => Promise<void>;
}) => {
    return (
        <div>
            {/* {param.draggable == "static" || param.draggable == "draggable" ? ( */}
            <ContainerVirGamepad style={{ zIndex: 2 }}>
                <ButtonGroupLeft
                    AxisCallback={param.AxisCallback}
                    ButtonCallback={param.ButtonCallback}
                    draggable={param.draggable}
                >
                    {" "}
                </ButtonGroupLeft>
                <ButtonGroupRight
                    AxisCallback={param.AxisCallback}
                    ButtonCallback={param.ButtonCallback}
                    draggable={param.draggable}
                >
                    {" "}
                </ButtonGroupRight>
            </ContainerVirGamepad>
            {/* ) : null} */}
        </div>
    );
};

// export const DPadGroup = () =>{
//   return (<Draggable>
//     <WrapperDrag>
//       <DPad></DPad>
//     </WrapperDrag>
//   </Draggable>)
// }

const ContainerVirGamepad = styled.div`
    display: flex;
`;
const WrapperJoyStick = styled.div``;
const WrapperDrag = styled.div`
    max-width: max-content;
    opacity: 0.3;
`;
const WrapperGroupBtn = styled.div`
    width: 50vw;
    height: 100vh;
    position: relative;
`;

const CssDefaultCenterBtn = styled.button`
    width: 25px;
    height: 25px;
    outline: none;
    background-color: transparent;
    border: 1px solid;
    border-radius: 50%;
`;
const SelectBtn = styled(CssDefaultCenterBtn)`
    position: absolute;
    top: 50%;
    right: 10px;
`;
const StartBtn = styled(CssDefaultCenterBtn)`
    position: absolute;
    top: 50%;
    left: 10px;
`;

const JoyStickRight = styled(JoyStick)`
    position: absolute;
    bottom: 10%;
    right: 50%;
`;
const JoyStickLeft = styled(JoyStick)`
    position: absolute;
    top: 50%;
    right: 50%;
`;
