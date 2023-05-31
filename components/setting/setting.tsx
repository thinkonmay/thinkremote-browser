import { Slider, ThemeProvider, createTheme } from '@mui/material'
import styled from 'styled-components'

const MAIN_COLOR = '#003F2A'
const SECOND_COLOR = '#F4DE00'
const THIRD_COLOR = '#F84D07'
const SUB_COLOR = '#F5E8D5'
const arr = [1, 2, 3, 4, 5, 6]

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
					color: SECOND_COLOR
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
function Setting() {

	return (
		<Container>
			<Title>Setting</Title>
			<Content>
				{arr.map(i => (
					<WrapperButton>
						<ButtonName>JoyStick lef {i}</ButtonName>
						<ThemeProvider theme={theme}>
							<Slider
								sx={{
									padding: 0,
								}}
								aria-label="Temperature"
								defaultValue={30}
							/>
						</ThemeProvider>
					</WrapperButton>
				))}
			</Content>
			<BtnSave>Save</BtnSave>
		</Container>
	);
}

export default Setting;
const Container = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	background: ${MAIN_COLOR};
	padding: 16px 40px;
`
const Content = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
`
const Title = styled.h3`
	color: ${SECOND_COLOR};
	font-size: 32px;
	margin-top: 16px;
    margin-bottom: 32px;
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