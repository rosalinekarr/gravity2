import React, {useState} from 'react';
import SettingsContext, {Settings} from '../../contexts/settings';

interface SettingsProviderProps {
    children: React.ReactNode;
}

const DEFAULT_SETTINGS: Settings = {
	font: '10px Kode Mono',
	highlightLineColor: '#FF00FF',
	highlightLineWidth: 2.0,
	nameOffsetX: 1,
	nameOffsetY: 1,
	particleColor: '#FFFFFF',
	scaleRate: 0.001,
	selectionHighlightOffset: 2.0,
	showForces: false,
	showNames: true,
	showScale: true,
	showVelocities: true,
	textColor: '#FFFFFF',
	timeScale: 40.0,
	velocityLineColor: '#FF0000',
	velocityLineScale: 1000.0,
	velocityLineWidth: 1.0,
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