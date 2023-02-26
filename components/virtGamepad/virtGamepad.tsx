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
import {YBXA} from "../gamepad/y_b_x_a";
import DPad from "../gamepad/d_pad";
import { LeftFuncButton, RightFuncButton } from "../gamepad/func_button";



export const JoyStick = (param: { draggable: ButtonMode , moveCallback: ((x:number,y:number) => Promise<void>) }) => {
    const [enableJT,setenableJT] = useState<boolean>(false);


    const move = (event: IJoystickUpdateEvent) => {
        if(event.type == 'move') {
            if (!enableJT) {
                param.moveCallback(0,0)
                return
            }
            param.moveCallback(event.x,-event.y)
        } else if(event.type == 'stop') {
            setenableJT(false);
            param.moveCallback(0,0)
        } else if(event.type == 'start') {
            setenableJT(true);
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
    ButtonCallback:  ((index: number,type: 'up' | 'down') => Promise<void>),
}
export const ButtonGroupRight = (param: ButtonGroupProps) => {
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
                <RightFuncButton
                    Touch={(index,type) => param.ButtonCallback(index,type)}
                />

                <YBXA
                    size={50}
                    onTouch={(e: React.TouchEvent,type,index) => param.ButtonCallback(index,type)}
                ></YBXA>

                <JoyStick 
                    moveCallback={(x:number,y:number) => param.AxisCallback(x,y,'right')} 
                    draggable={param.draggable}/>

            </WrapperDrag>
        </Draggable>
     )
};
export const ButtonGroupLeft = (param: ButtonGroupProps) => {
    const [posBtn, setPosBtn] = useState({ x: 0, y: 0 });
    useEffect(() => {
        let cache = localStorage.getItem(`left_group_pos`)
        const {x,y} = JSON.parse(cache != null ? cache : `{"x": 0, "y" : 0}`);
        if (x == null || y == null) {
            return;
        }

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
    }
    return (
        <Draggable 
            disabled={param.draggable != 'draggable'} 
            position={{x: posBtn.x, y: posBtn.y}} 
            onStop={handleStop} 
            onDrag={handleDrag}
            
        >
            <WrapperDrag>
                <LeftFuncButton
                    Touch={(index,type) => param.ButtonCallback(index,type)}
                />

                <DPad
                    size={50}
                    onTouch={(e: React.TouchEvent,type,index) => {
                        param.ButtonCallback(index,type)
                    }}
                />

                <JoyStick moveCallback={async (x:number,y:number) => {
                        param.AxisCallback(x,y,'left')
                        return;
                    }} draggable={param.draggable}/>

            </WrapperDrag>
        </Draggable>
     )
};

export const VirtualGamepad = (param: { 
    draggable: ButtonMode, 
    AxisCallback:    ((x: number,y: number,type: 'left' | 'right') => Promise<void>),
    ButtonCallback:  ((index: number,type: 'up' | 'down') => Promise<void>),
    }) => {
    return (
        <div>
            {param.draggable == "static" || param.draggable == "draggable" ? (
                <div style={{ zIndex: 2 }}>
                    <ButtonGroupLeft  
                        AxisCallback={param.AxisCallback} 
                        ButtonCallback={param.ButtonCallback} 
                        draggable={param.draggable}
                    />
                    <ButtonGroupRight  
                        AxisCallback={param.AxisCallback} 
                        ButtonCallback={param.ButtonCallback} 
                        draggable={param.draggable}
                    /> 
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
