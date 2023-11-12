"use client"

import React, { useLayoutEffect } from 'react';
import styled from 'styled-components';
import SportsEsportsOutlinedIcon from '@mui/icons-material/SportsEsportsOutlined';
import MouseOutlinedIcon from '@mui/icons-material/MouseOutlined';
import { Icon, Modal } from '@mui/material';
import { Fullscreen, LockReset, } from "@mui/icons-material";
import VideoSettingsOutlinedIcon from '@mui/icons-material/VideoSettingsOutlined';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import SettingsIcon from '@mui/icons-material/Settings';
import LanguageIcon from '@mui/icons-material/Language';
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
	font-size:14px;
	@media (min-width: 1024px) {
		width: 560px;
		padding: 45px 32px 40px 32px;

  }
	
`

const WrapperContent = styled.div`

`
const Content = styled.div`
	display: flex;
	gap: 8px;

	align-items: center;
	@media (min-width: 1024px) {
		/*width: 500px;*/
		font-size: 20px;
  }
`
const ContainerIcon = styled.div`
	border-radius: 50%;
	background: #fff;
	width: 24px;
	min-width: 24px;
	height: 24px;
	font-size: 16px;

	display: flex;
	justify-content: center;
	align-items: center;

	@media (min-width: 1024px) {
		width: 48px;
		min-width: 48px;
		height: 48px;
		font-size: 24px;
  }
`

const Text = styled.span`
	font-size: 16px;
	@media (min-width: 1024px) {
		font-size: 20px;
  }
`
const Title = styled.h3`
	font-size: 18px;
	color: #222222;
	text-align: center;
	@media (min-width: 1024px) {
		font-size: 24px;
		margin-bottom: 24px;
  }
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
const LanguageSwitch = styled.div`
	&::after {
        display: none;
      }

      select {
        background: rgba(255, 255, 255, 0.8);
        border: 1px solid rgb(238, 236, 235);
        border-bottom: 1px solid rgb(212, 211, 210);
        color: rgb(var(--txt_clr-rgb));
        height: 32px;
        padding-left: 8px;
        border-radius: 6px;
      }	
`
const buttonsMobile = [
	{
		icon: <VideoSettingsOutlinedIcon fontSize='inherit' />,
		name: {
			vn: "Tăng giảm chất lượng hình ảnh",
			en: "Change picture quality"
		},

	},
	{
		icon: <KeyboardIcon fontSize='inherit' />,
		name: {
			vn: "Mở bàn phím ảo",
			en: "Open virtual keyboard"
		}

	},
	{
		icon: <LockReset fontSize='inherit' />,
		name: {
			vn: "Reset khi không lên hình hoặc mất tiếng",
			en: "Reset when no picture or audio"
		}
	},
	{
		icon: <SettingsIcon fontSize='inherit' />,
		name: {
			vn: "Thay đổi kích thước, vị trí của gamepad ảo.",
			en: "Change size and position for gamepad"
		}
	}
]
const buttonsDesktop = [
	{
		icon: <LockReset fontSize='inherit' />,
		name: {
			vn: "Reset khi không lên hình hoặc mất tiếng",
			en: "Reset when no picture or audio"
		}
	},
	{
		icon: <VideoSettingsOutlinedIcon fontSize='inherit' />,
		name: {
			vn: "Tăng giảm chất lượng hình ảnh",
			en: "Change picture quality"
		}

	},
	{
		icon: <SportsEsportsOutlinedIcon fontSize='inherit' />,
		name: {
			vn: "Tạo QR, quét để dùng điện thoại thay thế gamepad",
			en: "Create QR, to transform mobile into gamepad. Scan it"
		}

	},
	{
		icon: <Fullscreen fontSize='inherit' />,
		name: {
			vn: "Lưu ý: bắt buộc fullscreen khi chơi game",
			en: "Notice: Playing requires fullscreen for best experience~"
		}
	}
]

const title = {
	vn: "CHÚ Ý: Mở game trong ổ D, không lưu file ở ổ C",
	en: "NOTICE: Game's in disk D, mustn't save file in disk C"
}
const dontShow = {
	vn: "Không hiện lại",
	en: "Don't show it again~"
}
type Language = 'vn' | 'en'
function GuideLine({ isModalOpen, closeModal, platform }) {
	const [buttons, setButtons] = React.useState(buttonsDesktop)
	const [language, setLanguage] = React.useState<Language>('en')

	useLayoutEffect(()=>{
		const languageLocal = localStorage.getItem('language') as Language
		if(languageLocal) setLanguage(languageLocal)
	},[])
	const handleDontShow = () => {
		localStorage.setItem('isGuideModalLocal1', 'false')
		localStorage.removeItem('isGuideModalLocal')

		closeModal()

	}
	const handleGotit = () => {
		localStorage.removeItem('isGuideModalLocal')
		closeModal()

	}

	React.useEffect(() => {
		if (platform == 'mobile') {
			setButtons(buttonsMobile)
			return
		}
		setButtons(buttonsDesktop)

	}, [platform])
	return (
		<Modal open={isModalOpen}>
			<Container>
				<Title>
					{/*{title[language]}*/}
					THÔNG BÁO: <br/>
					Phím <strong>Esc</strong> chuyển thành <strong>F1</strong>.

				</Title>
				{/*<div style={{display: 'flex', gap: 8, alignItems:'center', marginLeft: 'auto'}}>	
					<LanguageIcon fontSize='large'/>
					<LanguageSwitch>
						<select
							value={language}
							onChange={(e) => {
								setLanguage(e.target.value as Language);
								localStorage.setItem('language', e.target.value)
							}}
						>
							<option value="en">English</option>
							<option value="vn">Vietnamese</option>
						</select>
					</LanguageSwitch>
				</div>
				{
					buttons.map((btn, index) => (
						<Content
							key={index}
						>
							<ContainerIcon>
								{btn.icon}
							</ContainerIcon>
							<Text>{btn.name[language]}</Text>
						</Content>
					))
				}*/}
				<ContainerButton style={{ marginTop: 14 }}>
					<ButtonDontShow onClick={handleDontShow}>{dontShow[language]}</ButtonDontShow>
					<ButtonGotit onClick={handleGotit}>Oke!</ButtonGotit>
				</ContainerButton>
			</Container>
		</Modal>
	);
}

export default GuideLine;