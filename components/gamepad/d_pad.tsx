import React from "react";
import styled from "styled-components";
import {
    IconCircle,
    DPadTop,
    DPadRight,
    DPadBottom,
    DPadLeft,
} from "../../public/assets/svg/svg_cpn";
const Container = styled.div`
    width: calc(5px * 5);
    height: calc(5px * 5);
    /* background-color: red; */
    position: relative;
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
    onStartTouchTop: (e: React.TouchEvent) => void;
    onEndTouchTop: (e: React.TouchEvent) => void;
    onStartTouchBottom: (e: React.TouchEvent) => void;
    onEndTouchBottom: (e: React.TouchEvent) => void;
    onStartTouchRight: (e: React.TouchEvent) => void;
    onEndTouchRight: (e: React.TouchEvent) => void;
    onStartTouchLeft: (e: React.TouchEvent) => void;
    onEndTouchLeft: (e: React.TouchEvent) => void;
}
const DPad = (props: Props) => {
    const {
        onStartTouchTop,
        onEndTouchTop,
        onStartTouchBottom,
        onEndTouchBottom,
        onStartTouchRight,
        onEndTouchRight,
        onStartTouchLeft,
        onEndTouchLeft,
    } = props;
    return (
        <Container>
            <Top
                onTouchStart={(e: React.TouchEvent) => {
                    onStartTouchTop && onStartTouchTop(e);
                }}
                onTouchEnd={(e: React.TouchEvent) => {
                    onEndTouchTop && onEndTouchTop(e);
                }}
            >
                <DPadTop></DPadTop>
            </Top>
            <Bottom
                onTouchStart={(e: React.TouchEvent) => {
                    onStartTouchBottom && onStartTouchBottom(e);
                }}
                onTouchEnd={(e: React.TouchEvent) => {
                    onEndTouchBottom && onEndTouchBottom(e);
                }}
            >
                <DPadBottom></DPadBottom>
            </Bottom>
            <Right
                onTouchStart={(e: React.TouchEvent) => {
                    onStartTouchRight && onStartTouchRight(e);
                }}
                onTouchEnd={(e: React.TouchEvent) => {
                    onEndTouchRight && onEndTouchRight(e);
                }}
            >
                <DPadRight></DPadRight>
            </Right>
            <Left
                onTouchStart={(e: React.TouchEvent) => {
                    onStartTouchLeft && onStartTouchLeft(e);
                }}
                onTouchEnd={(e: React.TouchEvent) => {
                    onEndTouchLeft && onEndTouchLeft(e);
                }}
            >
                <DPadLeft></DPadLeft>
            </Left>
        </Container>
    );
};
export default DPad;
