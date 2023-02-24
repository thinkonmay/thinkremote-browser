import { Button, Stack } from "@mui/material";
import React, { useRef, useState } from "react"; // we need this to make JSX compile
import Draggable from "react-draggable";
import {
    IJoystickUpdateEvent,
    Joystick,
} from "react-joystick-component/build/lib/Joystick";
import { ButtonMode } from "../control/control";
import YBXA from "../gamepad/y_b_x_a";

type CardProps = {
    title: string;
    paragraph: string;
};

export const JoyStick = (param: { draggable: ButtonMode }) => {
    const JoystickRef = useRef<Joystick>(null);
    const move = (event: IJoystickUpdateEvent) => {
        // console.log(JSON.stringify(event));
    };

    return (
        <Draggable disabled={param.draggable != "draggable"}>
            <div style={{ opacity: 0.2, zIndex: 2 }}>
                <Joystick
                    start={move}
                    stop={move}
                    move={move}
                    ref={JoystickRef}
                    baseColor="#000"
                    stickColor="hwb(360 51% 76%)"
                >
                    {" "}
                </Joystick>
            </div>
        </Draggable>
    );
};
export const ButtonGroup = (input: { draggable: ButtonMode }): JSX.Element => {
    return (
        <Draggable disabled={input.draggable != "draggable"}>
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
            <YBXA
              onStartTouchY= {(e: React.TouchEvent) => console.log(e)}
              onEndTouchY= {(e: React.TouchEvent) => console.log(e)}
              onStartTouchB= {(e: React.TouchEvent) => console.log(e)}
              onEndTouchB= {(e: React.TouchEvent) => console.log(e)}
              onStartTouchX= {(e: React.TouchEvent) => console.log(e)}
              onEndTouchX= {(e: React.TouchEvent) => console.log(e)}
              onStartTouchA= {(e: React.TouchEvent) => console.log(e)}
              onEndTouchA= {(e: React.TouchEvent) => console.log(e)}
            ></YBXA>
        </Draggable>
    );
};

export const VirtualGamepad = (param: { draggable: ButtonMode }) => {
    return (
        <div>
            {param.draggable == "static" || param.draggable == "draggable" ? (
                <div style={{ zIndex: 2 }}>
                    <ButtonGroup draggable={param.draggable}> </ButtonGroup>
                    <ButtonGroup draggable={param.draggable}> </ButtonGroup>
                    <JoyStick draggable={param.draggable}></JoyStick>
                    <JoyStick draggable={param.draggable}></JoyStick>
                </div>
            ) : null}
        </div>
    );
};
