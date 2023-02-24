import React from 'react';
import styled from 'styled-components';
import { IconCircle, DPadTop, DPadRight, DPadBottom, DPadLeft } from '../../public/assets/svg/svg_cpn';
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
  onTouchTop: (e: React.TouchEvent) => void;
  onTouchBottom: (e: React.TouchEvent) => void;
  onTouchRight: (e: React.TouchEvent) => void;
  onTouchLeft: (e: React.TouchEvent) => void;
}
const DPad = (props: Props) => {
  const { onTouchTop, onTouchBottom, onTouchRight, onTouchLeft } = props;
  return (
    <Container>
      <Top
        onTouchStart={(e: React.TouchEvent) => {
          onTouchTop(e);
        }}
      >
        <DPadTop></DPadTop>
      </Top>
      <Bottom
        onTouchBottom={(e: React.TouchEvent) => {
          onTouchTop(e);
        }}
      >
        <DPadBottom></DPadBottom>
      </Bottom>
      <Right
        onTouchRight={(e: React.TouchEvent) => {
          onTouchTop(e);
        }}
      >
        <DPadRight></DPadRight>
      </Right>
      <Left
        onTouchLeft={(e: React.TouchEvent) => {
          onTouchTop(e);
        }}
      >
        <DPadLeft></DPadLeft>
      </Left>
    </Container>
  );
};
export default DPad;
