import { Button, Stack } from "@mui/material";
import React, { useRef, useState, useEffect } from "react"; // we need this to make JSX compile
import Draggable from "react-draggable";
import {
    IJoystickUpdateEvent,
    Joystick,
} from "react-joystick-component/build/lib/Joystick";
import { ButtonMode } from "../control/control";

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

export const ButtonGroup = (input: {draggable: ButtonMode}):JSX.Element =>  {
    const [JoyStick, setJoyStick] = useState<{
        element: JSX.Element;
    }[] >([]);
    const onMove = (stick:IJoystickUpdateEvent) => {
        console.log(`X: ${stick.x}`);
        console.log(`Y: ${stick.y}`);
    };
    const onStop = () => {
    };
    const defaultPosX = JSON.parse(localStorage.getItem("posX")) ?? 500;
    const defaultPosY = JSON.parse(localStorage.getItem("posX")) ?? 500;
    const [posBtn, setPosBtn] = useState({
        deltaPosition: {
            x: defaultPosX,
            y: defaultPosY
        },
    });

    const handleDrag = (e, ui) => {
        const { x, y } = posBtn.deltaPosition;
        setPosBtn({
            deltaPosition: {
                x: x + ui.deltaX,
                y: y + ui.deltaY,
            },
        });
        localStorage.setItem("posX", JSON.stringify(posBtn.deltaPosition.x));
        localStorage.setItem("posY", JSON.stringify(posBtn.deltaPosition.y));
    };


    return <Draggable onDrag={handleDrag} defaultPosition={{x: posBtn.deltaPosition.x, y: posBtn.deltaPosition.y}} disabled={input.draggable != 'draggable'}>
        <Stack style={{opacity: 0.2, position: "absolute", bottom: 16, left: 16, zIndex: 0 }} direction="column">
            <Button
                onClick={() =>
                console.log('y')
                }
            >Y</Button>
            <Stack direction="row">
                <Button
                onClick={() =>
                    console.log('x')
                }
                >X</Button>
                <Button
                onClick={() =>
                    console.log('b')
                }
                >B</Button>
            </Stack>
            <Button
                onClick={() =>
                console.log('a')
                }
            >A</Button>
        </Stack>
    </Draggable>
}

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
