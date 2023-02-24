import { Translate } from "@mui/icons-material";
import { Button, Stack } from "@mui/material";
import React, { useRef, useState, useEffect } from "react"; // we need this to make JSX compile
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import {
    IJoystickUpdateEvent,
    Joystick,
} from "react-joystick-component/build/lib/Joystick";
import { ButtonMode } from "../control/control";

type CardProps = {
    title: string;
    paragraph: string;
};

export const JoyStick = (param: { type: 'left' | 'right', draggable: ButtonMode , moveCallback: ((x:number,y:number) => Promise<void>) }) => {
    const [posBtn, setPosBtn] = useState({ x: 0, y: 0 });
    useEffect(() => {
        const {x,y} = JSON.parse(localStorage.getItem(`default${param.type}axis`));
        if (x == null || y == null) {
            return;
        }

        console.log(`get ${x} ${y} from storage`);
        setPosBtn({x:x,y:y})
    },[])

    const handleDrag = ( e: DraggableEvent, data: DraggableData) => {
        const { x, y } = posBtn;
        setPosBtn({
            x: data.x,
            y: data.y,
        });
    };

    const handleStop = ( e: DraggableEvent, data: DraggableData) => {
        const { x, y } = posBtn;
        if (x == null || y == null) {
            return;
        }

        localStorage.setItem(`default${param.type}axis`, JSON.stringify(posBtn));
        console.log(`set ${x} ${y} to storage`);
    }



    
    const JoystickRef = useRef<Joystick>(null);
    const move = (event: IJoystickUpdateEvent) => {
        if(event.type == 'move') {
            param.moveCallback(event.x,-event.y)
        }
        if(event.type == 'stop') {
            param.moveCallback(0,0)
        }
    };

    return (
        <Draggable position={{x: posBtn.x, y: posBtn.y}} onStop={handleStop} onDrag={handleDrag} disabled={param.draggable != "draggable"}>
            <div style={{ opacity: 0.2, zIndex: 2}}>
                <Joystick
                    start={move}
                    stop={move}
                    move={move}
                    ref={JoystickRef}
                    baseColor="#000"
                    stickColor="hwb(360 51% 76%)"
                >
                </Joystick>
            </div>
        </Draggable>
    );
};

export const ButtonGroup = (param: { draggable: 'draggable' | 'static'}): JSX.Element => {
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

    return <Draggable onDrag={handleDrag} defaultPosition={{x: posBtn.deltaPosition.x, y: posBtn.deltaPosition.y}}  disabled={param.draggable != "draggable"}>
            <Stack
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
            </Stack>
        </Draggable>
};

export const VirtualGamepad = (param: { 
    draggable: ButtonMode, 
    AxisCallback:    ((x: number,y: number,type: 'left' | 'right') => Promise<void>),
    ButtonCallback:  ((index: number,type: 'press' | 'release') => Promise<void>),
    }) => {
    return (
        <div>
            {param.draggable == "static" || param.draggable == "draggable" ? (
                <div style={{ zIndex: 2 }}>
                    <ButtonGroup draggable={param.draggable}> </ButtonGroup>
                    <ButtonGroup draggable={param.draggable}> </ButtonGroup>

                    <JoyStick type={'left'} moveCallback={async (x:number,y:number) => {
                        param.AxisCallback(x,y,'left')
                        return;
                    }} draggable={param.draggable}></JoyStick>
                    {/* left */}

                    <JoyStick type={'right'} moveCallback={async (x:number,y:number) => {
                        param.AxisCallback(x,y,'right')
                        return;
                    }} draggable={param.draggable}></JoyStick> 
                    {/* right */}
                </div>
            ) : null}
        </div>
    );
};
