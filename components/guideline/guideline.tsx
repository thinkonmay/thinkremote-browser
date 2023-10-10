"use client"

import React from 'react';
import styled from 'styled-components';
import SportsEsportsOutlinedIcon from '@mui/icons-material/SportsEsportsOutlined';
import MouseOutlinedIcon from '@mui/icons-material/MouseOutlined';
import { Icon, Modal } from '@mui/material';
import { Fullscreen, LockReset, } from "@mui/icons-material";
import VideoSettingsOutlinedIcon from '@mui/icons-material/VideoSettingsOutlined';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import SettingsIcon from '@mui/icons-material/Settings';

const Container = styled.div`
	width: 350px;
    height: fit-content;
    position: fixed;
    top: 50%;
    left: 50%;
	transform: translate(-50%, -50%);
	border-radius: 8px;

	padding: 32px 18px 24px 18px;
	background: #5FCCFB;
	
	display: flex;
	flex-direction: column;
	gap: 8px;
	
`

const WrapperContent = styled.div`

`
const Content = styled.div`
	display: flex;
	gap: 8px;

	align-items: center;
`
const ContainerIcon = styled.div`
	border-radius: 50%;
	background: #fff;
	width: 24px;
	min-width: 24px;
	height: 24px;
	font-size: 14px;

	display: flex;
	justify-content: center;
	align-items: center;

`

const Text = styled.span`
	font-size: 14px;

`
const Title = styled.h3`
	font-size: 18px;
	font-bold: 600;
	color: #222222;
	text-align: center;
`
const ContainerButton = styled.div`
	display: flex;
	gap: 8px;
	align-self: self-end;
`
const ResetButton = styled.button`
	height: 36px;
	outline: none;
	border: none;
	background: none;
	border-radius: 8px;
	padding: 6px 14px;
	display: flex;
	justify-content: center;
	align-items: center;
	font-weight: 600;

`

const ButtonDontShow = styled(ResetButton)`
	background: #F44336;
	color: white;
	border: 2px solid black;

`
const ButtonGotit = styled(ResetButton)`
	background: white;
	color: black;
	
`
const buttonsMobile = [
	{
		icon: <VideoSettingsOutlinedIcon fontSize='inherit'/>,
		name: "Tăng giảm chất lượng hình ảnh",

	},
	{
		icon: <KeyboardIcon fontSize='inherit'/>,
		name: "Mở bàn phím ảo",

	},
	{
		icon: <LockReset fontSize='inherit'/>,
		name: "Reset khi không lên hình hoặc mất tiếng",
	},
	{
		icon: <SettingsIcon fontSize='inherit'/>,
		name: "Thay đổi kích thước, vị trí của gamepad ảo.",
	}
]
const buttonsDesktop = [
	{
		icon: <LockReset fontSize='inherit'/>,
		name: "Reset khi không lên hình hoặc mất tiếng",
	},
	{
		icon: <VideoSettingsOutlinedIcon fontSize='inherit'/>,
		name: "Tăng giảm chất lượng hình ảnh",

	},
	{
		icon: <SportsEsportsOutlinedIcon fontSize='inherit'/>,
		name: "Tạo QR, quét để dùng điện thoại thay thế gamepad",

	},
	{
		icon: <Fullscreen fontSize='inherit'/>,
		name: "Lưu ý: bắt buộc fullscreen khi chơi game",
	}
]
function GuideLine({ isModalOpen, closeModal, platform }) {
	const [buttons, setButtons] = React.useState(buttonsDesktop)
	const handleDontShow = () => {
		localStorage.setItem('isGuideModalLocal', 'false')
		closeModal()

	}
	const handleGotit = () => {
		closeModal()
	}

	React.useEffect(()=>{
		if(platform == 'mobile'){
			setButtons(buttonsMobile)
			return
		}
		setButtons(buttonsDesktop)

	},[platform])
	return (
		<Modal open={isModalOpen}>
			<Container>
				<Title>CHÚ Ý: Mở game trong ổ D, không lưu file ở ổ C</Title>
				{
					buttons.map(btn => (
						<Content>
							<ContainerIcon>
								{btn.icon}
							</ContainerIcon>
							<Text>{btn.name}</Text>
						</Content>
					))
				}
				

				<ContainerButton style={{marginTop: 14}}>
					<ButtonDontShow onClick={handleDontShow}>Không hiện lại</ButtonDontShow>
					<ButtonGotit onClick={handleGotit}>Oke!</ButtonGotit>
				</ContainerButton>
			</Container>
		</Modal>
	);
}

export default GuideLine;