import { Button, Stack } from "@mui/material";
import React, { useRef, useState } from "react"; // we need this to make JSX compile
import Draggable from "react-draggable";
import styled from "styled-components";
import {
    IJoystickUpdateEvent,
    Joystick,
} from "react-joystick-component/build/lib/Joystick";
import { ButtonMode } from "../control/control";
import YBXA from "../gamepad/y_b_x_a";

export const JoyStick = (param: { draggable: ButtonMode }) => {
    const JoystickRef = useRef<Joystick>(null);
    const move = (event: IJoystickUpdateEvent) => {
        // console.log(JSON.stringify(event));
        console.log(1);
    };

    return (
        <Draggable disabled={param.draggable != "draggable"}>
            <WrapperDrag style={{ opacity: 0.2 }}>
                <Joystick
                    start={move}
                    stop={move}
                    move={move}
                    ref={JoystickRef}
                    baseColor="#000"
                    stickColor="hwb(360 51% 76%)"
                />
            </WrapperDrag>
        </Draggable>
    );
};
interface ButtonGroupProps {
    draggable: Partial<ButtonMode>;
}
export const ButtonGroup = (props: ButtonGroupProps): JSX.Element => {
    return (
        <Draggable disabled={false}>
            {/* <Stack
                style={{
                    opacity: 0.2,
                    position: "absolute",
                    bottom: 16,
                    left: 16,
                }}
                direction="column"
            >
                <Button onClick={() => console.log("y")}>Y</Button>
                <Stack direction="row">
                    <Button
                        onTouchStart={() => console.log("x start")}
                        onTouchEnd={() => console.log("x end")}
                    >
                        X
                    </Button>
                    <Button onClick={() => console.log("b")}>B</Button>
                </Stack>
                <Button onClick={() => console.log("a")}>A</Button>
            </Stack> */}
            <WrapperDrag>
                <YBXA
                    onStartTouchY={(e: React.TouchEvent) => console.log(e)}
                    onEndTouchY={(e: React.TouchEvent) => console.log(e)}
                    onStartTouchB={(e: React.TouchEvent) => console.log(e)}
                    onEndTouchB={(e: React.TouchEvent) => console.log(e)}
                    onStartTouchX={(e: React.TouchEvent) => console.log(e)}
                    onEndTouchX={(e: React.TouchEvent) => console.log(e)}
                    onStartTouchA={(e: React.TouchEvent) => console.log(e)}
                    onEndTouchA={(e: React.TouchEvent) => console.log(e)}
                ></YBXA>
            </WrapperDrag>
        </Draggable>
    );
};

export const VirtualGamepad = (props: { draggable: ButtonMode }) => {
    return (
        <>
            <WrapperDrag>
                <ButtonGroup draggable={props.draggable}/> 
                <ButtonGroup draggable={props.draggable}/> 
                <JoyStick draggable={props.draggable}></JoyStick>
                <JoyStick draggable={props.draggable}></JoyStick>
            </WrapperDrag>
        </>
    );
};

const WrapperDrag = styled.div`
    max-width: max-content;
`;
