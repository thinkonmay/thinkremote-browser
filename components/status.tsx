import styled, { keyframes } from "styled-components";
import * as React from 'react';
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";


const slideInAnimation = keyframes`
  from {
    transform: translateX(95%);
  }
  to {
    transform: translateX(0);
  }
`;

const slideOutAnimation = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(95%);
  }
`
const Container = styled.div`
	display: flex;
	position: fixed;
	top: 0;
	right: 0;

	width: 200px;
	height: 100px;
	animation-duration: 0.5s;
	animation-timing-function: ease-in-out;
	animation-fill-mode: both;
	/*transform: translateX(5%);		*/

	&.slide-in {
    	animation-name: ${slideInAnimation};
		
	}

	&.slide-out {
		animation-name: ${slideOutAnimation};
	}	
`

const WrapperContent = styled.div`
    width: 100%;
    height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 5px;	
	margin-left: 16px;
	padding-left: 16px;
	background: rgb(242 232 232 / 16%);

`
const Text = styled.span`
	color: white;
`
const Button = styled.button`
	position: absolute;
	top: -50%;
    left: 0;
    bottom: -50%;
	outline: none;
	border: none;
	background: none;
`
interface Props {
	videoConnect?: string
	audioConnect?: string
	fps?: string
}

function StatusConnect(props: Props) {
	const { videoConnect, audioConnect, fps } = props
	const [isOpen, setOpen] = React.useState(true)

	const handleOpen = () => {
		setOpen(!isOpen)
	}
	return (
		<Container className={isOpen ? 'slide-in' : 'slide-out'}>
			<Button onClick={handleOpen}>
				{
					isOpen ? <IoIosArrowForward color="white"/> :
						<IoIosArrowBack color="white"/>
				}
			</Button>
			{
				isOpen &&
				<WrapperContent >
					<Text>Status Video: {videoConnect}</Text>
					<Text>Status Audio: {audioConnect}</Text>
					{/* <Text>Fps: {fps}</Text> */}
				</WrapperContent>
			}

		</Container>
	);
}

export default StatusConnect;