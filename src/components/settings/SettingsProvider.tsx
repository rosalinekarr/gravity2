import React, {useState} from 'react';
import SettingsContext, {Settings} from '../../contexts/settings';

interface SettingsProviderProps {
    children: React.ReactNode;
}

const DEFAULT_SETTINGS: Settings = {
	gravitationalConstant: 6.674 * (10.0 ** -11),
	particleColor: '#FFFFFF',
	particleDensity: 1000.0,
	scale: 10.0,
	showForces: true,
	showScale: true,
	showVelocities: true,
	timeScale: 40.0,
	velocityLineColor: '#FF0000',
	velocityLineScale: 10000.0,
	velocityLineWidth: 1.5,
};

function SettingsProvider({children}: SettingsProviderProps) {
	const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

	return (
		<SettingsContext.Provider value={[settings, setSettings]}>
			{children}
		</SettingsContext.Provider>
	);
}

export default SettingsProvider;