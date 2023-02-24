import React from 'react';
import styled from 'styled-components';
import { IconCircle, IconTriangle } from '../../public/assets/svg/svg_cpn';
const Container = styled.div`
  width: calc(10px * 5);
  height: calc(10px * 5);
  background-color: red;
  position: relative;
`;
// Ban kinh gap 5 lan chieu rong
// chieu dai gap 2.25 chieu rong
const DefaultButton = styled.button`
  display: block;
  /* width: 10px; */
  /* height: calc(10px * 2.25); */
  position: absolute;
  background-color: yellow;
`;
const Top = styled(DefaultButton)`
  top: 0;
  right: 50%;
  -webkit-transform: translate(50%, 0%);
  -ms-transform: translate(50%, 0%);
  transform: translate(50%, -78%);
  rotate: 0deg;
`;
const Right = styled(DefaultButton)`
  bottom: 50%;
  left: 50%;
  -webkit-transform: translate(50%, 0%);
  -ms-transform: translate(50%, 0%);
  transform: translate(43%, -55%);
  rotate: 90deg;
`;
const Left = styled(DefaultButton)`
  top: 0;
  right: 50%;
  -webkit-transform: translate(50%, 0%);
  -ms-transform: translate(50%, 0%);
  transform: translate(-23%, -56%);
  rotate: 270deg;
`;
const Bottom = styled(DefaultButton)`
  bottom: 0;
  left: 50%;
  -webkit-transform: translate(50%, 0%);
  -ms-transform: translate(50%, 0%);
  transform: translate(50%, -80%);
  rotate: 180deg;
`;
interface Props {
  onTouchTop: () => void;
  onTouchBottom: () => void;
  onTouchRight: () => void;
  onTouchLeft: () => void;
}
const DPad = (props: Props) => {
  const { onTouchTop, onTouchBottom, onTouchRight, onTouchLeft } = props;
  return (
    <Container>
      <Top
        onTouchStart={() => {
          console.log('touch top');
        }}
      >
        <IconTriangle></IconTriangle>
      </Top>
      <Bottom>
        <IconTriangle></IconTriangle>
      </Bottom>
      <Right>
        <IconTriangle></IconTriangle>
      </Right>
      <Left>
        <IconTriangle></IconTriangle>
      </Left>
    </Container>
  );
};
export default DPad;
