import React, {useState} from 'react';
import SettingsContext, {Settings} from '../../contexts/settings';

interface SettingsProviderProps {
    children: React.ReactNode;
}

const DEFAULT_SETTINGS: Settings = {
    forceLineColor: '#0000FF',
    forceLineScale: 0.1,
    forceLineWidth: 1.5,
    gravitationalConstant: 6.674 * (10.0 ** -11),
    particleColor: '#FFFFFF',
    particleDensity: 1000.0,
    scale: 1.0,
    showForces: true,
    showScale: true,
    showVelocities: true,
    timeScale: 1.0,
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