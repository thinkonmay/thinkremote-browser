import React from "react";
import styled from "styled-components";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const Container = styled.div`
    width: ${(props) => props.size ?? "20"}px;
    height: ${(props) => props.size ?? "20"}px;
    position: relative;
  
`;

const DefaultButton = styled.button`
     /* depened on Container */
     width: inherit;
    height: inherit;
    color: #C3B5B5;
    border: 1px solid currentColor;
    border-radius: 50%;
    position: absolute;
    background-color: transparent;
    -webkit-user-select: none;
    -ms-user-select: none; 
    user-select: none;
    
`;
const Top = styled(DefaultButton)`
    top: 0;
    right: 50%;
    transform: translate(50%, -100%);
`;
const Right = styled(DefaultButton)`
    bottom: 50%;
    right: 0;
    transform: translate(100%, 50%);
`;
const Left = styled(DefaultButton)`
    bottom: 50%;
    left: 0;
    transform: translate(-100%, 50%);
`;
const Bottom = styled(DefaultButton)`
    bottom: 0%;
    right: 50%;
    transform: translate(50%, 100%);
`;
interface Props {
    onTouch: (e: React.TouchEvent, type: "up" | "down", index: number) => void;
    size;
}
const DPad = (props: Props) => {
    const { onTouch = () => { }, size } = props;
    return (
        <Container size={size}>
            <Top
                onTouchStart={(e: React.TouchEvent) => onTouch(e, "down", 12)}
                onTouchEnd={(e: React.TouchEvent) => onTouch(e, "up", 12)}
            >
                <KeyboardArrowUpIcon sx={{ color: '#C3B5B5' }} />
            </Top>
            <Bottom
                onTouchStart={(e: React.TouchEvent) => onTouch(e, "down", 13)}
                onTouchEnd={(e: React.TouchEvent) => onTouch(e, "up", 13)}
            >
                <KeyboardArrowDownIcon sx={{ color: '#C3B5B5' }} />
            </Bottom>
            <Right
                onTouchStart={(e: React.TouchEvent) => onTouch(e, "down", 15)}
                onTouchEnd={(e: React.TouchEvent) => onTouch(e, "up", 15)}
            >
                <KeyboardArrowRightIcon sx={{ color: '#C3B5B5' }} />
            </Right>
            <Left
                onTouchStart={(e: React.TouchEvent) => onTouch(e, "down", 14)}
                onTouchEnd={(e: React.TouchEvent) => onTouch(e, "up", 14)}
            >
                <KeyboardArrowLeftIcon sx={{ color: '#C3B5B5' }} />
            </Left>
        </Container>
    );
};
export default DPad;
