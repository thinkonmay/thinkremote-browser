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
const EnterButton = styled(DefaultButton)`
    bottom: 0;
    right: 50%;
    transform: translate(150%, 0%);
	color: white;
    border: 2px solid currentColor;
`;



export function MouseButtonGroup({ onTouch,onEnter, size }: {
    onTouch: (type: "up" | "down", index: number ) => void;
    onEnter: (type: "up" | "down") => void;
    className?: string;
    size?: number;
}) {
    return (
        <Container size={size}>
            <MouseRight
                onTouchStart={()  => onTouch("down" , 2)}
                onTouchEnd=  {()  => onTouch("up"   , 2)}
            >
                Right
            </MouseRight>
            <MouseLeft
                onTouchStart={()  => onTouch("down" , 0)}
                onTouchEnd=  {()  => onTouch("up"   , 0)}
            >
                Left
            </MouseLeft>
            <EnterButton
                onTouchStart={()  => onEnter("down"  )}
                onTouchEnd=  {()  => onEnter("up"    )}
            >
                Enter
            </EnterButton>
        </Container>
    );
}
