'use client'
import React, { FunctionComponent, useState, MutableRefObject, useEffect } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import styled, { keyframes } from "styled-components";
import { useShift } from "../../core/utils/convert";



const slideInAnimation = keyframes`
  from {
    transform: translateX(-95%);
  }
  to {
    transform: translateX(0);
  }
`;

const slideOutAnimation = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-95%);
  }
  `


interface IProps {
  keyBoardCallBack: (key, type) => void;
  keyboardRef: MutableRefObject<Keyboard>;
  isOpen: boolean
  close: () => void
}

const VirtKeyboard: FunctionComponent<IProps> = ({
  isOpen,
  keyBoardCallBack,
  keyboardRef,
  close
}) => {
  const [layoutName, setLayoutName] = useState("default");
  const onKeyPress = (button: string) => {
    if (button === "Shift") {
      setLayoutName(layoutName === "default" ? "shift" : "default");
    }
    

    const shift = useShift(button)

    if (shift)
      keyBoardCallBack("Shift", "down")

    keyBoardCallBack(button, "down")
    keyBoardCallBack(button, "up")
    if (shift)
      keyBoardCallBack("Shift", "up")
    //keyBoardCallBack(button, 'down')
    //keyBoardCallBack(button, 'up')
    //console.log(button);
    if (button === "Enter" || button =='Close') {
      close()
    }
  };
 
 
 

  return (
    <Container id='keyboard' className={isOpen ? 'slide-in' : 'slide-out'}>
      <Keyboard
        keyboardRef={r => (keyboardRef.current = r)}
        layoutName={layoutName}
        onKeyPress={onKeyPress}
        onRender={() => console.log("Rendered")}
        disableButtonHold={true}
        display={{
          'Backspace': 'Back',
          'Close': 'X',
        }}
        layout={
          {
            'default': [
              'Close ` 1 2 3 4 5 6 7 8 9 0 - =',
              'q w e r t y u i o p [ ] \\',
              'a s d f g h j k l ; \'',
              'z x c v b n m , . / Backspace',
              'Shift Space Enter'
            ],
            'shift': [
              'Close ~ ! @ # $ % ^ & * ( ) _ +',
              'Q W E R T Y U I O P { } |',
              'A S D F G H J K L : "',
              'Z X C V B N M < > ? Backspace',
              'Shift Space Enter'
            ]
          }
        }
      />
    </Container>
  );
};

export default VirtKeyboard;

const Container = styled.div`
  
  position: fixed;
  z-index: 6;

  bottom: 0;
  left: 0;
  right: 0;
  transition: all ease-in-out 0.5s;
  transform: translateY(100%);

  &.slide-in {
		transform: translateY(0%)
	}

	&.slide-out {
		transform: translateY(100%)
	}	
  
`