import { ReactNode, useEffect, useState } from 'react';
import { ThemeProvider } from '@primer/react';
import { GlobalStyle, systemTheme } from 'renderer/components/Theme';
import { useSettings } from './Settings/SettingsProvider';

export type StyleProviderProps = {
	children: ReactNode;
};

export default function StyleProvider(props: StyleProviderProps) {
	const [colorMode, setColorMode] = useState('auto');
	const { children } = props;

	const settings = useSettings();

	useEffect(() => {
		const value = settings?.getSettingsProperty('color-mode');
		if (value !== undefined && value !== colorMode) {
			setColorMode(value);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [settings]);

	return (
		<ThemeProvider
			theme={systemTheme}
			colorMode={colorMode as 'auto' | 'day' | 'night'}
		>
			{children}
			<GlobalStyle />
		</ThemeProvider>
	);
}
