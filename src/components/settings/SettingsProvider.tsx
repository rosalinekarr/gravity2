import React, {useState} from 'react';
import SettingsContext, {Settings} from '../../contexts/settings';

interface SettingsProviderProps {
    children: React.ReactNode;
}

const DEFAULT_SETTINGS: Settings = {
	font: '10px Kode Mono',
	highlightLineColor: '#FF00FF',
	highlightLineWidth: 1.0,
	nameOffsetX: 1,
	nameOffsetY: 1,
	particleColor: '#FFFFFF',
	scale: 10.0,
	selectionHighlightOffset: 2.0,
	showForces: true,
	showNames: true,
	showScale: true,
	showVelocities: true,
	textColor: '#FFFFFF',
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