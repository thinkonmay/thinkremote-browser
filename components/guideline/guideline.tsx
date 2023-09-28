"use client"

import React from 'react';
import styled from 'styled-components';
import SportsEsportsOutlinedIcon from '@mui/icons-material/SportsEsportsOutlined';
import MouseOutlinedIcon from '@mui/icons-material/MouseOutlined';
import { Icon, Modal } from '@mui/material';
const Container = styled.div`
	width: 70%;
    height: fit-content;
    position: fixed;
    top: 8%;
    left: 17%;

	border-radius: 8px;

	padding: 32px 24px 24px 24px;
	background: #5FCCFB;
	
	display: flex;
	flex-direction: column;
	gap: 32px;
	
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
	width: 48px;
	min-width: 48px;
	height: 48px;

	display: flex;
	justify-content: center;
	align-items: center;

`

const Text = styled.span`
	font-size: 14px;

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
function GuideLine({ isModalOpen, closeModal }) {
	const handleDontShow = () => {
		localStorage.setItem('isGuideModalLocal', 'false')
		closeModal()

	}
	const handleGotit = () => {
		closeModal()
	}


	return (
		<Modal open={isModalOpen}>
			<Container>
				<div>
					<Content>
						<ContainerIcon>
							<MouseOutlinedIcon fontSize="large" />
						</ContainerIcon>
						<Text>One tap for move, second tap for fix position</Text>
					</Content>
				</div>
				<div>
					<Content>
						<ContainerIcon>
							<SportsEsportsOutlinedIcon fontSize='large' />
						</ContainerIcon>
						<Text>Disable virtual controller when virtual mouse is on</Text>
					</Content>
				</div>

				<ContainerButton>
					<ButtonDontShow onClick={handleDontShow}>Dont show it again!</ButtonDontShow>
					<ButtonGotit onClick={handleGotit}>Got it!</ButtonGotit>
				</ContainerButton>
			</Container>
		</Modal>
	);
}

export default GuideLine;