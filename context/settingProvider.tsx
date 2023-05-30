"use client"
import React, { useContext, useEffect, useState } from 'react';
const Context = React.createContext(null)

interface ISettingState {
	gamepad: IGamePadValue
}
interface IGamePadValue {
	leftScale: number
	rightScale: number
}

const initialSetting: ISettingState = {
	gamepad: {
		leftScale: 1,
		rightScale: 1
	}
};

const reducer = (state: ISettingState, action) => {
	const { data, type } = action
	switch (type) {
		case "ADD_STEP": {
			return 1
		}

		default:
			return state;
	}
};


//let initialData: ISettingState 
//if (typeof window !== 'undefined') {
//	// Perform localStorage action
//	initialData = JSON.parse(localStorage.getItem('settingData')) ?? 
//}

function SettingProvider({ children }: { children: React.ReactNode }) {
	const [initialData, setInitialData] = useState(initialSetting)
	//React.useLayoutEffect(() => {
	//	// Perform localStorage action
	//	const item  = JSON.parse(localStorage.getItem('settingData'))
	//	if(item) setInitialData(item)
	//  }, [])
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