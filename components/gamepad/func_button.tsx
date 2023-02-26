import styled from "styled-components";

const DefautContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 18px;
    width: max-content;
`;
const ContainerRightBtn = styled(DefautContainer)`
    align-items: flex-start;
    position: absolute;
    top: 5%;
    right: 35%;
`;
const ContainerLeftBtn = styled(DefautContainer)`
    align-items: flex-end;
    position: absolute;
    top: 5%;
    left: 35%;
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

interface PropsTrigger {
    Touch: (index: number, type : 'up' | 'down') => void;
}

export function RightFuncButton(props: PropsTrigger) {
    const { Touch } =
        props;
    return (
        <ContainerRightBtn>
            <TriggerBtn
                onTouchStart={(e: React.TouchEvent) => Touch(7,'down')}
                onTouchEnd={(e: React.TouchEvent) => Touch(7,'up')}
            ></TriggerBtn>
            <BumperBtn
                onTouchStart={(e: React.TouchEvent) => Touch(5,'down')}
                onTouchEnd={(e: React.TouchEvent) => Touch(5,'up')}
            ></BumperBtn>
        </ContainerRightBtn>
    );
}

export function LeftFuncButton(props: PropsTrigger) {
    const { Touch } =
        props;
    return (
        <ContainerLeftBtn>
            <TriggerBtn
                onTouchStart={(e: React.TouchEvent) => Touch(6,'down')}
                onTouchEnd={(e: React.TouchEvent) => Touch(6,'up')}
            ></TriggerBtn>
            <BumperBtn
                onTouchStart={(e: React.TouchEvent) => Touch(4,'down')}
                onTouchEnd={(e: React.TouchEvent) => Touch(4,'up')}
            ></BumperBtn>
        </ContainerLeftBtn>
    );
}
