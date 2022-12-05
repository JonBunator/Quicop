import { useTheme } from '@primer/react';
import { useState, useEffect } from 'react';
import Store from 'electron-store';

export default function useSettingsService() {
	const settingsKeys = ['color-mode'];
	const [settings, setSettings] = useState(new Map<string, string>());
	const store = new Store();

	const { setColorMode } = useTheme();

	useEffect(() => {
		const map = new Map<string, string>();
		settingsKeys.forEach((key) => {
			// map.set(key, store.get(key) as string);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const setSettingsProperty = (id: string, value: string) => {
		// store.set(id, value);
		setSettings((prev) => new Map(prev.set(id, value)));

		switch (id) {
			case 'color-mode': {
				setColorMode(value as 'day' | 'night' | 'auto');
				break;
			}
			default: {
				console.log(`No setting found with id ${id}`);
				break;
			}
		}
	};

	const getSettings = () => {
		return settings;
	};
	return { setSettingsProperty, getSettings };
}
