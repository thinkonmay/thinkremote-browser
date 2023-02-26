import styled from "styled-components";

const DefautContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 18px;
    width: max-content;
`;
const ContainerRightBtn = styled(DefautContainer)`
    align-items: flex-start;
`;
const ContainerLeftBtn = styled(DefautContainer)`
    align-items: flex-end;
`;
export const BumperBtn = styled.button`
    outline: none;
    width: 55px;
    height: 25px;
    border: 2px solid;
    border-radius: 10px;
    background-color: transparent;
    :active {
        background-color: rgba(0, 0, 0, 0.05);
    }
`;
export const TriggerBtn = styled.button`
    outline: none;
    width: 40px;
    height: 55px;
    border: 2px solid;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    background-color: transparent;
    :active {
        background-color: rgba(0, 0, 0, 0.05);
    }
`;

interface PropsRight {
    onStartTouchRb: (e: React.TouchEvent) => void;
    onEndTouchRb: (e: React.TouchEvent) => void;
    onStartTouchRt: (e: React.TouchEvent) => void;
    onEndTouchRt: (e: React.TouchEvent) => void;
}

export function RightFuncButton(props: PropsRight) {
    const { onStartTouchRb, onEndTouchRb, onStartTouchRt, onEndTouchRt } =
        props;
    return (
        <ContainerRightBtn>
            <TriggerBtn
                onTouchStart={(e: React.TouchEvent) => {
                    onStartTouchRt && onStartTouchRt(e);
                }}
                onTouchEnd={(e: React.TouchEvent) => {
                    onEndTouchRt && onEndTouchRt(e);
                }}
            ></TriggerBtn>
            <BumperBtn
                onTouchStart={(e: React.TouchEvent) => {
                    onStartTouchRb && onStartTouchRb(e);
                }}
                onTouchEnd={(e: React.TouchEvent) => {
                    onEndTouchRb && onEndTouchRb(e);
                }}
            ></BumperBtn>
        </ContainerRightBtn>
    );
}
interface PropsLeft {
    onStartTouchLb?: (e: React.TouchEvent) => void;
    onEndTouchLb?: (e: React.TouchEvent) => void;
    onStartTouchLt?: (e: React.TouchEvent) => void;
    onEndTouchLt?: (e: React.TouchEvent) => void;
}
export function LeftFuncButton(props: PropsLeft) {
    const { onStartTouchLb, onEndTouchLb, onStartTouchLt, onEndTouchLt } =
        props;
    return (
        <ContainerLeftBtn>
            <TriggerBtn
                onTouchStart={(e: React.TouchEvent) => {
                    onStartTouchLb && onStartTouchLt(e);
                    console.log("Touch LT");
                }}
                onTouchEnd={(e: React.TouchEvent) => {
                    onEndTouchLt && onEndTouchLt(e);
                }}
            ></TriggerBtn>
            <BumperBtn
                onTouchStart={(e: React.TouchEvent) => {
                    onStartTouchLb && onStartTouchLb(e);
                    console.log("Touch Lb");
                }}
                onTouchEnd={(e: React.TouchEvent) => {
                    console.log("End touch LB");
                    onEndTouchLb && onEndTouchLb(e);
                }}
            ></BumperBtn>
        </ContainerLeftBtn>
    );
}
