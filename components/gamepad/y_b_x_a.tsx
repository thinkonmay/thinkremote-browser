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
  onStartTouchY: (e: React.TouchEvent) => void;
  onEndTouchY: (e: React.TouchEvent) => void;
  onStartTouchB: (e: React.TouchEvent) => void;
  onEndTouchB: (e: React.TouchEvent) => void;
  onStartTouchX: (e: React.TouchEvent) => void;
  onEndTouchX: (e: React.TouchEvent) => void;
  onStartTouchA: (e: React.TouchEvent) => void;
  onEndTouchA: (e: React.TouchEvent) => void;
}
function YBXA(props: Props) {
  const {
    onStartTouchY,
    onEndTouchY,
    onStartTouchB,
    onEndTouchB,
    onStartTouchX,
    onEndTouchX,
    onStartTouchA,
    onEndTouchA
  } = props;
  return (
    <Container>
      <ButtonY
        onTouchStart={(e: React.TouchEvent) => {
          onStartTouchY(e);
        }}
        onTouchEnd={(e:React.TouchEvent) =>{
          onEndTouchY
        }}
      >
        Y
      </ButtonY>
      <ButtonB
        onTouchStart={(e: React.TouchEvent) => {
          onStartTouchB(e);
        }}
        onTouchEnd={(e:React.TouchEvent) =>{
          onEndTouchB
        }}
      >
        B
      </ButtonB>
      <ButtonX
        onTouchStart={(e: React.TouchEvent) => {
          onStartTouchX(e);
        }}
        onTouchEnd={(e:React.TouchEvent) =>{
          onEndTouchX
        }}
      >
        X
      </ButtonX>
      <ButtonA
        onTouchStart={(e: React.TouchEvent) => {
          onStartTouchA(e);
        }}
        onTouchEnd={(e:React.TouchEvent) =>{
          onEndTouchA
        }}
      >
        A
      </ButtonA>
    </Container>
  );
}

export default YBXA;
