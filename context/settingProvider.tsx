"use client"
import React, { useContext } from 'react';
const Context = React.createContext(null)

interface ISettingState {
	gamePad: IGamePadValue
	virtMouse: any
}
interface IGamePadValue {
	leftScale: number
	rightScale: number
	leftJt: number
	rightJt: number
	dpad: number
	ybxa: number
	rbRt: number
	lbLt: number
	subBtn: number

}

const initialSetting: ISettingState = {
	gamePad: {
		leftScale: 1,
		rightScale: 1,
		leftJt: 1,
		rightJt: 1,
		dpad: 1,
		ybxa: 1,
		rbRt: 1,
		lbLt: 1,
		subBtn: 1,
	},
	virtMouse:{}
};

interface IActionData {
	name: string
	value: number
	type: 'gamePad' | 'virtMouse'
}
interface IAction {
	type: string
	data: IActionData
}

const reducer = (state: ISettingState, action: IAction) => {
	const { data } = action
	switch (action.type) {
		case "INIT": {
			return data
		}
		case "UPDATE": {
			const newData = { ...state}
			const {	name, value, type	} = data
			newData[type][name] = value
			return newData
			
		}

		default:
			return state;
	}
};


let initialData: ISettingState 
if (typeof window !== 'undefined') {
	// Perform localStorage action
	initialData = JSON.parse(localStorage.getItem('settingData')) ?? initialSetting
}

function SettingProvider({ children }: { children: React.ReactNode }) {
	const [state, dispatch] = React.useReducer(reducer, initialData)
	const saveDataLocal = React.useCallback(() => {
		localStorage.setItem('settingData', JSON.stringify(state))
	}, [state])
	
	
	
	React.useEffect(() => {
		saveDataLocal()
	}, [saveDataLocal])
	return (
		<Context.Provider value={{ settingValue: state, dispatch }}>
			{children}
		</Context.Provider>
	);
}

export const useSetting = () => useContext(Context)
export default SettingProvider;