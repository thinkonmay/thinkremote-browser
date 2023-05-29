import styled from "styled-components";

const DefautContainer = styled.div`
    display: flex;
    gap: 18px;
    width: max-content;
`;
const ContainerRightBtn = styled(DefautContainer)`
    align-items: flex-start;
    /*position: absolute;
    top: 5%;
    right: 35%;*/
`;
const ContainerLeftBtn = styled(DefautContainer)`
    align-items: flex-end;
    /*position: absolute;
    top: 5%;
    left: 35%;*/
`;
export const BumperBtn = styled.button`
    display: flex;
    align-items: center;
    justify-content:center;
    outline: none;
    color: #C3B5B5;
   
    border: 2px solid #C3B5B5;
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
    border: 2px solid #C3B5B5;
    border-radius: 50%;
    /*border-top-left-radius: 20px;
    border-top-right-radius: 20px;*/
    background-color: transparent;
    :active {
        background-color: rgba(0, 0, 0, 0.05);
    }
`;

interface PropsTrigger {
    Touch: (index: number, type: 'up' | 'down') => void
    scale: number
    name?: string
    className?: string
    style?: any
}


const TRIGGER_WIDTH = 50
const TRIGGER_HEIGHT = 50
const BUMPER_WIDTH = 50
const BUMPER_HEIGHT = 50
export function RightFuncButton(props: PropsTrigger){
    const { Touch, scale,   name, className, style={}, ...rest } =
        props;

    const triggerBtnSizeWidth = TRIGGER_WIDTH * scale
    const triggerBtnSizeHeight = TRIGGER_HEIGHT * scale

    const bumperBtnSizeWidth = BUMPER_WIDTH * scale
    const bumperBtnSizeHeight = BUMPER_HEIGHT * scale

    const triggerBtnCss = {
        width: triggerBtnSizeWidth,
        height: triggerBtnSizeHeight
    }
    const bumperBtnCss = {
        width: bumperBtnSizeWidth,
        height: bumperBtnSizeHeight
    }
    return (
        <ContainerRightBtn 
            name={name}
            className={className}
            style={style}
            {...rest}
        >
            <TriggerBtn
            name={name}

                style={{ ...triggerBtnCss }}
                scale={scale}
                onTouchStart={(e: React.TouchEvent) => Touch(7, 'down')}
                onTouchEnd={(e: React.TouchEvent) => Touch(7, 'up')}
            >RT</TriggerBtn>
            <BumperBtn
            name={name}

                style={{ ...bumperBtnCss }}
                scale={scale}
                onTouchStart={(e: React.TouchEvent) => Touch(5, 'down')}
                onTouchEnd={(e: React.TouchEvent) => Touch(5, 'up')}
            >RB</BumperBtn>
        </ContainerRightBtn>
    );
}

export function LeftFuncButton(props: PropsTrigger) {
    const { Touch, scale } =
        props;
    const triggerBtnSizeWidth = TRIGGER_WIDTH * scale
    const triggerBtnSizeHeight = TRIGGER_HEIGHT * scale

    const bumperBtnSizeWidth = BUMPER_WIDTH * scale
    const bumperBtnSizeHeight = BUMPER_HEIGHT * scale

    const triggerBtnCss = {
        width: triggerBtnSizeWidth,
        height: triggerBtnSizeHeight
    }
    const bumperBtnCss = {
        width: bumperBtnSizeWidth,
        height: bumperBtnSizeHeight
    }
    return (
        <ContainerLeftBtn>
            <TriggerBtn
                style={{ ...triggerBtnCss }}
                scale={scale}
                onTouchStart={(e: React.TouchEvent) => Touch(6, 'down')}
                onTouchEnd={(e: React.TouchEvent) => Touch(6, 'up')}
            >LT</TriggerBtn>
            <BumperBtn
                style={{ ...bumperBtnCss }}
                scale={scale}
                onTouchStart={(e: React.TouchEvent) => Touch(4, 'down')}
                onTouchEnd={(e: React.TouchEvent) => Touch(4, 'up')}
            >LB</BumperBtn>
        </ContainerLeftBtn>
    );
}
