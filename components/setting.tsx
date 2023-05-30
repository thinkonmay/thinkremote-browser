import styled from 'styled-components'
const MAIN_COLOR = '#003F2A'
const SECOND_COLOR = '#F4DE00'
const THIRD_COLOR = '#F84D07'
const SUB_COLOR = '#F5E8D5'
const arr = [1, 2, 3, 4, 5, 6]
function Setting() {

	return (
		<Container>
			<Title>Setting</Title>
			<Content>
				{arr.map(i => (
					<WrapperButton>
						<ButtonName>JoyStick lef {i}</ButtonName>
						<Range type='range' />
					</WrapperButton>
				))}
			</Content>
			<BtnSave>Save</BtnSave>
		</Container>
	);
}

export default Setting;
const Container = styled.div`
	width: 100%;
	height: 100%;
	background: ${MAIN_COLOR};
	padding: 16px 40px;
`

const Content = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`
const Title = styled.h3`
	color: ${SECOND_COLOR};
	font-size: 24px;
`
const WrapperButton = styled.div`
	display: flex;
`
const Range = styled.input`	
	flex: 1;
    input[type='range'] {
      overflow: hidden;
      width: 80px;
      -webkit-appearance: none;
      background-color: #9a905d;
    }
    
    input[type='range']::-webkit-slider-runnable-track {
      height: 10px;
      -webkit-appearance: none;
      color: #13bba4;
      margin-top: -1px;
    }
    
    input[type='range']::-webkit-slider-thumb {
      width: 10px;
      -webkit-appearance: none;
      height: 10px;
      cursor: ew-resize;
      background: #434343;
      box-shadow: -80px 0 0 80px #43e5f7;
    }

`

const ButtonName = styled.div`
	min-width: 155px;
	color: ${SUB_COLOR};
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
`