import { Button, Stack } from '@mui/material';
import React, { useState } from 'react'; // we need this to make JSX compile
import Draggable from 'react-draggable';
import { IJoystickUpdateEvent, Joystick } from 'react-joystick-component/build/lib/Joystick';

type CardProps = {
  title: string,
  paragraph: string
}

export const JoyStick = () =>  {
    return <div>
        <Draggable>
            <div style={{zIndex: 1,opacity: 0.3}}>
                <Joystick > </Joystick> 
            </div>
        </Draggable>


    </div>
}
export const ButtonGroup = ():JSX.Element =>  {
    const [JoyStick, setJoyStick] = useState<{
        element: JSX.Element;
    }[] >([]);
    const onMove = (stick:IJoystickUpdateEvent) => {
        console.log(`X: ${stick.x}`);
        console.log(`Y: ${stick.y}`);
    };
    const onStop = () => {
    };


    return <Draggable>
        <Stack style={{opacity: 0.3, position: "absolute", bottom: 16, left: 16, zIndex: 2 }} direction="column">
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

export const VirtualGamepad = () =>  {
    

    return <div>
        <ButtonGroup>
        </ButtonGroup>

        <ButtonGroup>
        </ButtonGroup>

        <JoyStick></JoyStick>
        <JoyStick></JoyStick>
    </div>
}
