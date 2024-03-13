import {useContext} from 'react';
import SettingsContext, {Settings} from '../contexts/settings';

export default function useSettings() {
	const settingsContext = useContext(SettingsContext);
	if (!settingsContext) throw new Error('Missing Settings Provider');

	const [settings, setSettings] = settingsContext;

	function changeSetting(key: keyof Settings, value: Settings[keyof Settings]) {
		setSettings((prevSettings: Settings) => ({...prevSettings, [key]: value}));
	}

	return {...settings, changeSetting};
}