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
import YBXA from "../gamepad/y_b_x_a";
import DPad from "../gamepad/d_pad";

type CardProps = {
    title: string;
    paragraph: string;
};

export const JoyStick = (param: { type: 'left' | 'right', draggable: ButtonMode , moveCallback: ((x:number,y:number) => Promise<void>) }) => {
    const move = (event: IJoystickUpdateEvent) => {
        if(event.type == 'move') {
            param.moveCallback(event.x,-event.y)
        }
        if(event.type == 'stop') {
            param.moveCallback(0,0)
        }
    };

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
    AxisCallback:    ((x: number,y: number,type: 'left' | 'right') => Promise<void>),
    ButtonCallback:  ((index: number,type: 'press' | 'release') => Promise<void>),
}
export const ButtonGroupRight = (param: ButtonGroupProps): JSX.Element => {
    const [posBtn, setPosBtn] = useState({ x: 0, y: 0 });
    useEffect(() => {
        let cache = localStorage.getItem(`right_group_pos`)
        const {x,y} = JSON.parse(cache != null ? cache : `{"x": 0, "y" : 0}`);
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

        localStorage.setItem(`right_group_pos`, JSON.stringify(posBtn));
        console.log(`set ${x} ${y} to storage`);
    }



    
    return (
        <Draggable 
            disabled={param.draggable != 'draggable'} 
            position={{x: posBtn.x, y: posBtn.y}} 
            onStop={handleStop} 
            onDrag={handleDrag}
        >
            <WrapperDrag>
                <YBXA
                    size={50}
                    onStartTouchY={(e: React.TouchEvent) => console.log(`onStartTouchY`)}
                    onEndTouchY={(e: React.TouchEvent) => console.log(`onEndTouchY`)}
                    onStartTouchB={(e: React.TouchEvent) => console.log(`onStartTouchB`)}
                    onEndTouchB={(e: React.TouchEvent) => console.log(`onEndTouchB`)}
                    onStartTouchX={(e: React.TouchEvent) => console.log(`onStartTouchX`)}
                    onEndTouchX={(e: React.TouchEvent) => console.log(`onEndTouchX`)}
                    onStartTouchA={(e: React.TouchEvent) => console.log(`onStartTouchA`)}
                    onEndTouchA={(e: React.TouchEvent) => console.log(`onEndTouchA`)}
                ></YBXA>

                <JoyStick type={'right'} moveCallback={async (x:number,y:number) => {
                    param.AxisCallback(x,y,'right')
                    return;
                }} draggable={param.draggable}></JoyStick> 
                {/* right */}
            </WrapperDrag>
        </Draggable>
     )
};
export const ButtonGroupLeft = (param: ButtonGroupProps): JSX.Element => {
    const [posBtn, setPosBtn] = useState({ x: 0, y: 0 });
    useEffect(() => {
        let cache = localStorage.getItem(`left_group_pos`)
        const {x,y} = JSON.parse(cache != null ? cache : `{"x": 0, "y" : 0}`);
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

        localStorage.setItem(`left_group_pos`, JSON.stringify(posBtn));
        console.log(`set ${x} ${y} to storage`);
    }
    return (
        <Draggable 
            disabled={param.draggable != 'draggable'} 
            position={{x: posBtn.x, y: posBtn.y}} 
            onStop={handleStop} 
            onDrag={handleDrag}
            
        >
            <WrapperDrag>
                <DPad
                    size={50}
                    onStartTouchTop={(e: React.TouchEvent) => console.log(`onStartTouchTop`)}
                    onEndTouchTop={(e: React.TouchEvent) => console.log(`onEndTouchTop`)}
                    onStartTouchBottom={(e: React.TouchEvent) => console.log(`onStartTouchBottom`)}
                    onEndTouchBottom={(e: React.TouchEvent) => console.log(`onEndTouchBottom`)}
                    onStartTouchRight={(e: React.TouchEvent) => console.log(`onStartTouchRight`)}
                    onEndTouchRight={(e: React.TouchEvent) => console.log(`onEndTouchRight`)}
                    onStartTouchLeft={(e: React.TouchEvent) => console.log(`onStartTouchLeft`)}
                    onEndTouchLeft={(e: React.TouchEvent) => console.log(`onEndTouchLeft`)}
                >
                </DPad>

                <JoyStick type={'left'} moveCallback={async (x:number,y:number) => {
                        param.AxisCallback(x,y,'left')
                        return;
                    }} draggable={param.draggable}></JoyStick>
                    {/* left */}
            </WrapperDrag>
        </Draggable>
     )
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
                    <ButtonGroupLeft  
                        AxisCallback={param.AxisCallback} 
                        ButtonCallback={param.ButtonCallback} 
                        draggable={param.draggable}
                    > </ButtonGroupLeft>
                    <ButtonGroupRight  
                        AxisCallback={param.AxisCallback} 
                        ButtonCallback={param.ButtonCallback} 
                        draggable={param.draggable}
                    > </ButtonGroupRight>
                </div>
            ) : null}
        </div>
    )
};

// export const DPadGroup = () =>{
//   return (<Draggable>
//     <WrapperDrag>
//       <DPad></DPad>
//     </WrapperDrag>
//   </Draggable>)
// }

const WrapperDrag = styled.div`
    max-width: max-content;
    opacity: 0.3;
`;
