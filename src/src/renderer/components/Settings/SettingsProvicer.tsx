import {
	ReactNode,
	createContext,
	useContext,
	useState,
	useEffect,
} from 'react';
import { ThemeProvider } from '@primer/react';
import { GlobalStyle, systemTheme } from 'renderer/Theme';
import { settingsData } from './Settings';

const SettingsContext = createContext<SettingsProps | undefined>(undefined);

interface SettingsProps {
	settings: Map<string, string>;
	setSettingsProperty: (id: string, value: string) => void;
	getSettingsProperty: (id: string) => string;
}

export type Props = {
	children: ReactNode;
};

// returns a map with (settings-id, defaultValue) pairs
function getDefaultValues(): Map<string, string> {
	const map = new Map<string, string>();
	const { sections } = settingsData;
	for (let i = 0; i < sections.length; i += 1) {
		const { properties } = sections[i];
		for (let j = 0; j < properties.length; j += 1) {
			map.set(properties[j].id, properties[j].defaultValue);
		}
	}
	return map;
}

export default function SettingsProvider(props: Props) {
	const { children } = props;
	const [settings, setSettings] = useState(getDefaultValues());
	const [colorMode, setColorMode] = useState('auto');

	// change internal settings
	function setSettingsProp(id: string, value: string) {
		if (settings.get(id) !== value) {
			setSettings((prev) => new Map<string, string>(prev.set(id, value)));
		}
	}

	// load settings from saved config
	useEffect(() => {
		settings.forEach(async (value, id) => {
			const savedValue = await window.electronAPI.getSettingsProperty(id);
			if (savedValue !== value) {
				setSettingsProp(id, savedValue);
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// gets the setting with the specified id
	function getSettingsProperty(id: string): string {
		if (settings.has(id)) {
			return settings.get(id) as string;
		}
		return '';
	}

	// when color mode changes
	useEffect(() => {
		setColorMode(getSettingsProperty('color-mode'));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [settings]);

	// sets the value of the setting with the specified id
	function setSettingsProperty(id: string, value: string) {
		if (settings.get(id) !== value) {
			setSettingsProp(id, value);
			window.electronAPI.setSettingsProperty(id, value);
		}
	}

	return (
		<SettingsContext.Provider
			value={{ settings, setSettingsProperty, getSettingsProperty }}
		>
			<ThemeProvider theme={systemTheme} colorMode={colorMode}>
				<GlobalStyle />
				{children}
			</ThemeProvider>
		</SettingsContext.Provider>
	);
}

export const useSettings = () => useContext(SettingsContext);
