import styled from 'styled-components';

const Container = styled.div`
  width: 20px;
  height: 20px;
  /* background: red; */
  position: relative;
`;
const DefaultButton = styled.button`
  width: 30px;
  height: 30px;
  border: 1px solid;
  border-radius: 50%;
  position: absolute;
  color: black;
  background-color: transparent;
`;

const ButtonY = styled(DefaultButton)`
  top: 0;
  right: 50%;

  transform: translate(50%, -100%);
`;
const ButtonB = styled(DefaultButton)`
  bottom: 0;
  right: 50%;

  transform: translate(50%, 100%);
`;
const ButtonX = styled(DefaultButton)`
  right: 0;
  top: 50%;
  transform: translate(100%, -50%);
`;
const ButtonA = styled(DefaultButton)`
  top: 50%;
  left: 0%;
  transform: translate(-100%, -50%);
`;
interface Props {
  onTouchY: (e: React.TouchEvent) => void;
  onTouchB: (e: React.TouchEvent) => void;
  onTouchX: (e: React.TouchEvent) => void;
  onTouchA: (e: React.TouchEvent) => void;
}
function YBXA(props: Props) {
  const { onTouchY, onTouchB, onTouchX, onTouchA } = props;
  return (
    <Container>
      <ButtonY
        onTouchStart={(e: React.TouchEvent) => {
          onTouchY(e);
        }}
      >
        Y
      </ButtonY>
      <ButtonB
        onTouchStart={(e: React.TouchEvent) => {
          onTouchB(e);
        }}
      >
        B
      </ButtonB>
      <ButtonX
        onTouchStart={(e: React.TouchEvent) => {
          onTouchX(e);
        }}
      >
        X
      </ButtonX>
      <ButtonA
        onTouchStart={(e: React.TouchEvent) => {
          onTouchA(e);
        }}
      >
        A
      </ButtonA>
    </Container>
  );
}

export default YBXA;
