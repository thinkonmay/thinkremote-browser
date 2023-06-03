import styled, { keyframes } from "styled-components";
import * as React from 'react';
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";



const slideInAnimation = keyframes`
  from {
    transform: translateX(-95%);
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
    transform: translateX(-95%);
  }
`
const Container = styled.div`
	z-index:3;
	display: flex;
	position: fixed;
	top: 0;
	left: 0;
	
	height: 45px;
	animation-duration: 0.5s;
	animation-timing-function: ease-in-out;
	animation-fill-mode: both;
	/*transform: translateX(5%);		*/
    transform: translateX(-95%);
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
	align-items: center;
	gap: 5px;	
	margin-right: 16px;
	background: rgb(242 232 232 / 60%);

`
const Text = styled.span`
	color: white;
`
const Button = styled.button`
	position: absolute;
	top: -50%;
    right: 0;
    bottom: -50%;
	outline: none;
	border: none;
	background: none;
`
const ButtonIcon = styled.button`
	outline: none;
	border: none;
	background: none;
	width: 45px;
	height: 100%;
	font-weight: 500;
	:active{
		background: black;
		color: white;
	}
`
interface Action {
	icon: React.ReactNode,
	name: string
	action: () => void,
}
interface Props {
	actions: Action[],
	isShowBtn: boolean
	onOkey: () => Promise<void>
	onDefault: () => Promise<void>
}

function MobileControl(props: Props) {
	const { actions, isShowBtn, onOkey, onDefault } = props
	const [isOpen, setOpen] = React.useState(false)

	const handleOpen = () => {
		setOpen(!isOpen)
	}
	
	return (
		<Container className={isOpen ? 'slide-out' : 'slide-in'}>

			<WrapperContent >
				{
					isShowBtn ? 
					<>
						<ButtonIcon onClick={onDefault}>Default</ButtonIcon>
						<ButtonIcon onClick={onOkey}>Ok</ButtonIcon>
					</> : 
					actions.map(action => (
						<ButtonIcon key={Math.random()} onClick={()=>{action.action()}}>
							{action.icon}
						</ButtonIcon>
					))

				}

			</WrapperContent>
			<Button onClick={handleOpen}>
				{
					isOpen 
					? <IoIosArrowForward color="white" /> 
					: <IoIosArrowBack color="white" />
				}
			</Button>

		</Container>
	);
}

export default MobileControl;