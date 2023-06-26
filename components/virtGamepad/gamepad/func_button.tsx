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


const DefaultFuncBtn = styled.button`
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
    -webkit-user-select: none;
    -ms-user-select: none; 
    user-select: none;
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
            <DefaultFuncBtn

                style={{ ...buttonSize }}
                onTouchStart={(e: React.TouchEvent) => Touch(7, 'down')}
                onTouchEnd={(e: React.TouchEvent) => Touch(7, 'up')}
            >RT</DefaultFuncBtn>
            <DefaultFuncBtn

                style={{ ...buttonSize }}
                onTouchStart={(e: React.TouchEvent) => Touch(5, 'down')}
                onTouchEnd={(e: React.TouchEvent) => Touch(5, 'up')}
            >RB</DefaultFuncBtn>
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
            <DefaultFuncBtn
                style={{ ...buttonSize }}
                onTouchStart={(e: React.TouchEvent) => Touch(6, 'down')}
                onTouchEnd={(e: React.TouchEvent) => Touch(6, 'up')}
            >LT</DefaultFuncBtn>
            <DefaultFuncBtn
                style={{ ...buttonSize }}
                onTouchStart={(e: React.TouchEvent) => Touch(4, 'down')}
                onTouchEnd={(e: React.TouchEvent) => Touch(4, 'up')}
            >LB</DefaultFuncBtn>
        </ContainerLeftBtn>
    );
}
