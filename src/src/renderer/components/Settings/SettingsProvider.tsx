import {
	ReactNode,
	createContext,
	useContext,
	useState,
	useEffect,
	useMemo,
} from 'react';
import { settingsData } from './Settings';

interface SettingsProps {
	settings: Map<string, string>;
	setSettingsProperty: (id: string, value: string) => void;
	getSettingsProperty: (id: string) => string;
}

const SettingsContext = createContext<SettingsProps | undefined>(undefined);

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

	// gets the setting with the specified id
	function getSettingsProperty(id: string): string {
		if (settings.has(id)) {
			return settings.get(id) as string;
		}
		return '';
	}

	// sets the value of the setting with the specified id
	function setSettingsProperty(id: string, value: string) {
		if (value === undefined || value === null) return;
		if (settings.get(id) !== value) {
			setSettings((prev) => new Map<string, string>(prev.set(id, value)));
			window.electronAPI.setSettingsProperty(id, value);
		}
	}

	// load settings from saved config
	useEffect(() => {
		settings.forEach(async (value, id) => {
			const loadedValue =
				(await window.electronAPI.getSettingsProperty(id)) ?? '';
			if (loadedValue !== '') {
				setSettingsProperty(id, loadedValue);
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const memoSettings = useMemo(
		() => ({ settings, setSettingsProperty, getSettingsProperty }),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[settings],
	);

	return (
		<SettingsContext.Provider value={memoSettings}>
			{children}
		</SettingsContext.Provider>
	);
}

export const useSettings = () => useContext(SettingsContext);
