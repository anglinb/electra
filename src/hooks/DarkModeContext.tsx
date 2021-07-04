import { FC, createContext, useEffect, useState } from 'react';
import { productName } from '../config';
import { toSlug } from '../utils';

// These are the values in the dabase, they 
// can't change
const darkModeKey = `${toSlug(productName)}_darkMode`;
const getLocalDarkMode = () => {
	try {
		let value = localStorage.getItem(darkModeKey);
		if (value === 'true') {
			return true
		}
	} catch {
	}
	return undefined;
}

type  DarkModeContextStoreType = {
	darkModeEnabled: boolean;
};

export type DarkModeContextType = {
	darkMode: DarkModeContextStoreType 
	toggleDarkMode: () => void;
	disableDarkMode: () => void;
	enableDarkMode: () => void;
};

export const DarkModeContext = createContext<DarkModeContextType>(
	{ 
		darkMode: {
			darkModeEnabled: false,
		},
		toggleDarkMode: () => {},
		disableDarkMode: () => {},
		enableDarkMode: () => {},
	}
);

export const DarkModeContextProvider:FC = ({ children }) => {

	const [darkMode, setDarkMode] = useState<DarkModeContextStoreType>({
		darkModeEnabled: !!getLocalDarkMode()
	})

	useEffect(() => {
		try {
			localStorage.setItem(darkModeKey, JSON.stringify(darkMode.darkModeEnabled))
		} catch {}
	}, [darkMode])

	return (
    <DarkModeContext.Provider
      value={{
				darkMode,
				toggleDarkMode: () => {
					setDarkMode((darkMode) => { 
						return {
							...darkMode,
						 	darkModeEnabled: !darkMode.darkModeEnabled 
						}
					})
				},
				disableDarkMode: () => {
					setDarkMode((darkMode) => { 
						return {
							...darkMode,
						 	darkModeEnabled: false 
						}
					})
				},
				enableDarkMode: () => {
					setDarkMode((darkMode) => { 
						return {
							...darkMode,
						 	darkModeEnabled: true
						}
					})
				},
			}}
			>
				{children}
		</DarkModeContext.Provider>
	)
}

export default DarkModeContextProvider;
