import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: calc(10px * 5);
  height: calc(10px * 5);
  background-color: red;
  position: relative;
`;
// Ban kinh gap 5 lan chieu rong
// chieu dai gap 2.25 chieu rong
const DefaultButton = styled.button`
  all: unset !important;
  display: block;
  width: 10px;
  height: calc(10px * 2.25);
  position: absolute;
  background-color: yellow;
  top: -2px;
  right: 50%;
  transform: translate(50%, 0%);
`;
const Top = styled(DefaultButton)``;
const Right = styled(DefaultButton)``;
const Left = styled(DefaultButton)``;
const Bottom = styled(DefaultButton)``;
const DPad = () => {
  return (
    <Container>
      <Top></Top>
      <Bottom></Bottom>
      <Right></Right>
      <Left></Left>
    </Container>
  );
};
export default DPad;
