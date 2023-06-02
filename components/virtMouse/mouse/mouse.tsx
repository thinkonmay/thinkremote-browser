import styled from "styled-components";

const Container = styled.div`
    width: ${(props) => props.size ?? "20"}px;
    height: ${(props) => props.size ?? "20"}px;
    /* background: red; */
    position: relative;
`;
const DefaultButton = styled.button`
    /* depened on Container */
    width: inherit;
    height: inherit;
    :active {
        background-color: rgb(97 76 76 / 15%);;
    }
    color: #C3B5B5;
    border: 1px solid currentColor;
    border-radius: 50%;
    position: absolute;
    background-color: transparent;
`;

const MouseRight = styled(DefaultButton)`
    top: 0;
    right: 50%;
    transform: translate(50%, -100%);
	color: white;
    border: 2px solid currentColor;
`;
const MouseLeft = styled(DefaultButton)`
    bottom: 0;
    right: 50%;
    transform: translate(50%, 100%);
	color: white;
    border: 2px solid currentColor;
`;


interface Props {
    onTouch: (e: React.TouchEvent, type: "up" | "down", index: number) => void;
    size?: number;
    className?: string;
}

export function LR(props: Props) {
    const { onTouch, size } = props;
    return (
        <Container size={size}>
            <MouseRight
                onTouchStart={(e: React.TouchEvent) => onTouch(e, "down", 2)}
                onTouchEnd={(e: React.TouchEvent) => onTouch(e, "up", 2)}
            >
                Right
            </MouseRight>
            <MouseLeft
                onTouchStart={(e: React.TouchEvent) => onTouch(e, "down", 0)}
                onTouchEnd={(e: React.TouchEvent) => onTouch(e, "up", 0)}
            >
                Left
            </MouseLeft>
        </Container>
    );
}
