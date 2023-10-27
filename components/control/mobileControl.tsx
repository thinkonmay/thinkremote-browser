"use client"

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
	
	height: auto;
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
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin-right: 16px;
	/*background: rgb(242 232 232 / 60%);#5fccfbab*/
	background: #5fccfbab;
`;
const WrapperButton = styled.div`
    width: 100%;
	justify-content: center;
    height: 45px;
	display: flex;
	align-items: center;
`
const WrapperKey = styled.div`
    width: 100%;
    height: 45px;
	display: flex;
	justify-content: center;
	align-items: center;
`
const Text = styled.span`
	color: white;
`
const Button = styled.button`
	position: absolute;
	height:100%;
    right: -4px;
	outline: none;
	border: none;
	background: none;
`
const ButtonIcon = styled.button`
	outline: none;
	border: none;
	background: none;
	width: auto;
	padding: 0 8px;
	min-width: 45px;
	height: 100%;
	font-weight: 500;    
	
`;

const BtnKey = styled(ButtonIcon)`
	/*padding: 0 8px;*/
	border-right: 1px solid;

	&: last-child {
		border-right: unset;

	}	
`
interface Action {
	icon: React.ReactNode,
	name: string
	action: () => void,
}
interface Props {
	isClose: boolean
	handleOpen: () => void

	actions: Action[],
	isShowBtn: boolean

	onOkey: () => Promise<void>
	onDefault: () => Promise<void>

	keyBoardCallBack: (key: string, type: 'up' | 'down') => Promise<void>


}
const listKeyBroad = [
	{
		name: 'Esc',
		val: ['Escape']
	},
	{
		name: 'Backspace',
		val: ['Backspace']
	},
	{
		name: 'Alt F4',
		val: ['Alt', 'F4']
	},
	{
		name: 'Alt Tab',
		val: ['Alt', 'Tab']
	},
	{
		name: 'Ctrl V',
		val: ['control', 'v']
	},
	
]
function MobileControl({ isClose, handleOpen, actions, isShowBtn, onOkey, onDefault, keyBoardCallBack }: Props) {

	const clickKey = (keys = []) => {
		if(keys.length <= 1){
			keyBoardCallBack(keys?.at(0), 'down')
			keyBoardCallBack(keys?.at(0), 'up')
			return
		}	

		keys.forEach((k, i)=>{
			keyBoardCallBack(k, 'down')
		})
		keys.forEach((k, i)=>{
			keyBoardCallBack(k, 'up')
		})
	}
	return (
		<Container className={!isClose ? 'slide-out' : 'slide-in'}>

			<WrapperContent >
				{
					isShowBtn ?
						<div style={{display: 'flex', height:40}}>
							<ButtonIcon onClick={onDefault}>Default</ButtonIcon>
							<ButtonIcon onClick={onOkey}>Ok</ButtonIcon>
						</div> :
						<>
							<WrapperButton>
								{actions.map((action,index) => (
									<ButtonIcon key={index} onClick={() => { action.action() }}>
										{action.icon}
									</ButtonIcon>
								))}
							</WrapperButton>
							<hr style={{width: '100%'}}/>
							<WrapperKey>
								{
									listKeyBroad.map((key,index) => (
										<BtnKey key={index} onClick={() => { clickKey(key.val) }}>{key.name}</BtnKey>
									))
								}
							</WrapperKey>
						</>



				}

			</WrapperContent>
			<Button onClick={handleOpen}>
				{
					!isClose
						? <IoIosArrowForward color="white" style={{ fontSize: 20 }} />
						: <IoIosArrowBack color="white" style={{ fontSize: 20 }} />
				}
			</Button>

		</Container>
	);
}

export default MobileControl;