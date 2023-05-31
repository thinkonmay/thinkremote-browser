import styled from "styled-components";

const DefautContainer = styled.div`
    display: flex;
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
    display: flex;
    align-items: center;
    justify-content:center;
    outline: none;
    color: #C3B5B5;
   
    border: 1px solid #C3B5B5;
    border-radius: 50%;
    background-color: transparent;
    :active {
        background-color: rgba(0, 0, 0, 0.05);
    }
`;
export const TriggerBtn = styled.button`
    display: flex;
    align-items: center;
    justify-content:center;
    outline: none;
    color: #C3B5B5;
    border: 1px solid #C3B5B5;
    border-radius: 50%;

    background-color: transparent;
    :active {
        background-color: rgb(97 76 76 / 15%);;
    }
`;

interface PropsTrigger {
    Touch: (index: number, type: 'up' | 'down') => void
    name?: string
    className?: string
    style?: any
    size: number;
}

export function RightFuncButton(props: PropsTrigger) {
    const { Touch, name, className,size, ...rest } = props;

    const buttonSize = {
        width: size,
        height: size
    }
    return (
        <ContainerRightBtn
            className={className}
            {...rest}
        >
            <TriggerBtn

                style={{ ...buttonSize }}
                onTouchStart={(e: React.TouchEvent) => Touch(7, 'down')}
                onTouchEnd={(e: React.TouchEvent) => Touch(7, 'up')}
            >RT</TriggerBtn>
            <BumperBtn

                style={{ ...buttonSize }}
                onTouchStart={(e: React.TouchEvent) => Touch(5, 'down')}
                onTouchEnd={(e: React.TouchEvent) => Touch(5, 'up')}
            >RB</BumperBtn>
        </ContainerRightBtn>
    );
}

export function LeftFuncButton(props: PropsTrigger) {
    const { Touch, size = 50, className } = props;
    const buttonSize = {
        width: size,
        height: size
    }
    return (
        <ContainerLeftBtn
        className={className}
        >
            <TriggerBtn
                style={{ ...buttonSize }}
                onTouchStart={(e: React.TouchEvent) => Touch(6, 'down')}
                onTouchEnd={(e: React.TouchEvent) => Touch(6, 'up')}
            >LT</TriggerBtn>
            <BumperBtn
                style={{ ...buttonSize }}
                onTouchStart={(e: React.TouchEvent) => Touch(4, 'down')}
                onTouchEnd={(e: React.TouchEvent) => Touch(4, 'up')}
            >LB</BumperBtn>
        </ContainerLeftBtn>
    );
}
