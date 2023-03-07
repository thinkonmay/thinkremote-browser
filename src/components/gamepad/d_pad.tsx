import React from "react";
import styled from "styled-components";
import {
    IconCircle,
    DPadTop,
    DPadRight,
    DPadBottom,
    DPadLeft,
} from "../../../public/assets/svg/svg_cpn";
const Container = styled.div`
    width: ${(props) => props.size ?? "20"}px;
    height: ${(props) => props.size ?? "20"}px;
    /* background-color: red; */
    position: absolute;
    right: 25%;
    bottom: 15%;
`;
// Ban kinh gap 5 lan chieu rong
// chieu dai gap 2.25 chieu rong
const DefaultButton = styled.button`
    display: block;
    /* width: 10px; */
    /* height: calc(10px * 2.25); */
    position: absolute;
    background-color: transparent;
    border: unset;
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
    const { onTouch = () => {}, size } = props;
    return (
        <Container size={size}>
            <Top
                onTouchStart={(e: React.TouchEvent) => onTouch(e, "down", 12)}
                onTouchEnd={(e: React.TouchEvent) => onTouch(e, "up", 12)}
            >
                <DPadTop></DPadTop>
            </Top>
            <Bottom
                onTouchStart={(e: React.TouchEvent) => onTouch(e, "down", 13)}
                onTouchEnd={(e: React.TouchEvent) => onTouch(e, "up", 13)}
            >
                <DPadBottom></DPadBottom>
            </Bottom>
            <Right
                onTouchStart={(e: React.TouchEvent) => onTouch(e, "down", 15)}
                onTouchEnd={(e: React.TouchEvent) => onTouch(e, "up", 15)}
            >
                <DPadRight></DPadRight>
            </Right>
            <Left
                onTouchStart={(e: React.TouchEvent) => onTouch(e, "down", 14)}
                onTouchEnd={(e: React.TouchEvent) => onTouch(e, "up", 14)}
            >
                <DPadLeft></DPadLeft>
            </Left>
        </Container>
    );
};
export default DPad;
