import styled from "styled-components";

const Wrapper = styled.div`
    position: absolute;
    top: 48%;
    right: 30%;
`;
const Container = styled.div`
    width: ${(props) => props.size ?? "20"}px;
    height: ${(props) => props.size ?? "20"}px;
    /* background: red; */
    position: relative;
`;
export const DefaultGamePadButton = styled.button`
    /* depened on Container */
    display: flex;
    align-items: center;
    justify-content:center;
    outline: none;

    width: inherit;
    height: inherit;
    color: rgba(255, 255, 255, 0.5);

    border: 1px solid currentColor;
    border-radius: 50%;
    background-color: transparent;
    -webkit-user-select: none;
    -ms-user-select: none; 
    user-select: none;
`;

const DefaultYbxaBtn = styled(DefaultGamePadButton)`
    position: absolute;
    

`
const ButtonY = styled(DefaultYbxaBtn)`
    top: 0;
    right: 50%;

    transform: translate(50%, -100%);
`;

const ButtonB = styled(DefaultYbxaBtn)`
    bottom: 0;
    right: 50%;

    transform: translate(50%, 100%);
`;
const ButtonX = styled(DefaultYbxaBtn)`
    right: 0;
    top: 50%;
    transform: translate(100%, -50%);
`;
const ButtonA = styled(DefaultYbxaBtn)`
    top: 50%;
    left: 0%;
    transform: translate(-100%, -50%);
`;
interface Props {
    onTouch: (e: React.TouchEvent, type: "up" | "down", index: number) => void;
    size?: number;
    className?: string;
}

export function YBXA(props: Props) {
    const { onTouch, size, className } = props;
    return (
        <Wrapper className={className}>
            <Container size={size}>
                <ButtonY
                    onTouchStart={(e: React.TouchEvent) => onTouch(e, "down", 3) }
                    onTouchEnd={(e: React.TouchEvent) => onTouch(e, "up", 3)}
                >
                    Y
                </ButtonY>
                <ButtonB
                    onTouchStart={(e: React.TouchEvent) => onTouch(e, "down", 0) }
                    onTouchEnd={(e: React.TouchEvent) => onTouch(e, "up", 0)}
                >
                    A
                </ButtonB>
                <ButtonX
                    onTouchStart={(e: React.TouchEvent) => onTouch(e, "down", 1) }
                    onTouchEnd={(e: React.TouchEvent) => onTouch(e, "up", 1)}
                >
                    B
                </ButtonX>
                <ButtonA
                    onTouchStart={(e: React.TouchEvent) => onTouch(e, "down", 2) }
                    onTouchEnd={(e: React.TouchEvent) => onTouch(e, "up", 2)}
                >
                    X
                </ButtonA>
            </Container>
        </Wrapper>
    );
}

