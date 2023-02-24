import styled from 'styled-components';

const Container = styled.div`
  width: 20px;
  height: 20px;
  background: red;
  position: relative;
`;
const DefaultButton = styled.button`
  width: 30px;
  height: 30px;
  border: 1px solid;
  border-radius: 50%;
  position: absolute;
`;

const ButtonY = styled(DefaultButton)`
  top: 0;
  right: 50%;
  transform: translate(50%, -78%);
`;
const ButtonB = styled(DefaultButton)`
  bottom: 50%;
  left: 50%;
  transform: translate(43%, -55%);
`;
const ButtonX = styled(DefaultButton)`
  bottom: 0;
  left: 50%;

  transform: translate(50%, -80%);
`;
const ButtonA = styled(DefaultButton)`
  top: 0;
  right: 50%;
  transform: translate(-23%, -56%);
`;
function YBXA() {
  return (
    <Container>
      <ButtonY>Y</ButtonY>
      <ButtonB>B</ButtonB>
      <ButtonX>X</ButtonX>
      <ButtonA>A</ButtonA>
    </Container>
  );
}

export default YBXA;
