import { IconButton, Modal, Slider, ThemeProvider, createTheme } from '@mui/material'
import React, { startTransition, useLayoutEffect } from 'react'
import styled from 'styled-components'
import CloseIcon from '@mui/icons-material/Close';
import { useSetting } from '../../context/settingProvider';
const MAIN_COLOR = '#003F2A'
const SECOND_COLOR = '#F4DE00'
const THIRD_COLOR = '#F84D07'
const SUB_COLOR = '#F5E8D5'


const theme = createTheme({
	components: {
		MuiSlider: {
			styleOverrides: {
				root: {
					'@media (min-width: 600px)': {
						padding: 0,
					}
				},
				track: {
					height: 10,
					borderRadius: 4,
					color: "#d9d9d9"
				},
				thumb: {
					height: 20,
					width: 20,
					color: "#fff",
				},
				rail: {
					color: "#fff"
				}
			},
		},
	},
});

interface Props {
	isOpen: boolean
	closeModal: () => void
	onDraggable: (type: 'VGamePad' | 'VMouse', value: boolean) => void
}

const STANDARD_VALUE = 50

function Setting(props: Props) {
	const [listBtn, setListBtn] = React.useState([{
		name: 'Left Joystick',
		key: 'leftJt',
		value: 50
	}, {
		name: 'Right Joystick',
		key: 'rightJt',
		value: 50
	}, {
		name: 'Dpad',
		key: 'dpad',
		value: 50
	}, {
		name: 'YBXA',
		key: 'ybxa',
		value: 50
	}, {
		name: 'RB & RT ',
		key: 'rbRt',
		value: 50
	}, {
		name: 'LB & LT',
		key: 'lbLt',
		value: 50
	}, {
		name: 'RS',
		key: 'rs',
		value: 50
	}, {
		name: 'LS',
		key: 'ls',
		value: 50
	}])
	const { isOpen, closeModal, onDraggable } = props
	const { dispatch, settingValue } = useSetting()

	const calScaleValue = (value: number) => {
	
		const scaleValue = value  / STANDARD_VALUE
	
		return scaleValue
	
	}
	useLayoutEffect(()=>{
		const {gamePad} = settingValue

		setListBtn(prev => {
			const newData = prev.map(item =>({...item, value: gamePad[item.key] * STANDARD_VALUE}))
			return newData
		})
	}, [])

	const handleChangeAdjust = (event: Event, value: number) => {

		//@ts-ignore
		const name: string = event.target.name

		if(value < 1) return
		setListBtn(prev => {
			const newData = prev.map(item =>{
				if(item.key == name) {
					return {...item, value: value}
				}
				return item
			})
			return newData
		})
		startTransition(()=>{
			dispatch({ type: 'UPDATE', data: { name, value: calScaleValue(value), type: 'gamePad' } })
		})
	

	}

	const onChangeInput =(event: React.ChangeEvent<HTMLInputElement>) =>{
		const type = event.target.name as ('VGamePad' | 'VMouse')
		const value = event.target.checked
		onDraggable(type, value)

	}	
	return (
		<Modal open={isOpen}>
			<Container>
				<Title>Setting</Title>
				<IconButton
					sx={{
						position: 'absolute',
						top: 8,
						right: 8
					}}
					onClick={closeModal}
				>
					<CloseIcon sx={{ fontSize: '4rem', color: THIRD_COLOR }} fontSize="large" />
				</IconButton>
				<Content>
					<WrapperButton>
						<ButtonName>Draggable</ButtonName>
						<WrapperCheckbox>
							<CheckBox>
								<label style={{fontSize: '1.5rem'}} htmlFor="checkbox1">Gamepad</label>
								<input style={{width: 20, height: 20}} onChange={onChangeInput} type="checkbox" name="VGamePad" id="checkbox1" />
							</CheckBox>
							<CheckBox>
								<label style={{fontSize: '1.5rem'}} htmlFor="checkbox2">Mouse</label>
								<input style={{width: 20, height: 20}} onChange={onChangeInput} type="checkbox" name="VMouse" id="checkbox2" />
							</CheckBox>
						</WrapperCheckbox>
						
					</WrapperButton>
					{listBtn. map(btn => (
						<WrapperButton key={btn.key}>
							<ButtonName>{btn.name}</ButtonName>
							<ThemeProvider theme={theme}>
								<Slider
									sx={{
										padding: 0,
									}}
									name={btn.key}
									aria-label="Temperature"
									defaultValue={btn.value}
									onChange={handleChangeAdjust}
									value={btn.value}
								/>
							</ThemeProvider>
						</WrapperButton>
					))}
				</Content>
				{/*<BtnSave>Save</BtnSave>	*/}
			</Container>
		</Modal>
	);
}

export default Setting;

const WrapperCheckbox = styled.div`
	display: flex;
	gap: 150px;
	align-items: center;
`
const CheckBox = styled.div`
	display: flex;
	align-items: center;
	gap: 16px;
	font-size: 1.5rem;
`
const Container = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	background: rgba(136, 136, 136, 0.71);
	padding: 16px 40px;
	color: #FCFFE7;
`
const Content = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
`
const Title = styled.h3`
	color: #FCFFE7;
	font-size: 32px;
    margin-bottom: 16px;
`
const WrapperButton = styled.div`
	display: flex;
	align-items: center;
`

const ButtonName = styled.div`
	min-width: 155px;
	color: ${SUB_COLOR};
	font-size: 1.6rem;

`

const DefaultButton = styled.div`
	border: none;
	outline: unset;
	background: none;
`
const BtnSave = styled(DefaultButton)`
	border-radius: 8px;
	display: flex;
	justify-content:center;
	align-items: center;
	background: ${SUB_COLOR};
	color: ${MAIN_COLOR};
	height: 46px;
    font-size: 18px;
    font-weight: bold;
	margin-top: auto;
`