import {createContext, Dispatch, SetStateAction} from 'react';

export interface Settings {
    gravitationalConstant: number;
    particleColor: string;
    particleDensity: number;
    scale: number;
    showForces: boolean;
    showScale: boolean;
    showVelocities: boolean;
    timeScale: number;
    velocityLineColor: string;
    velocityLineScale: number;
    velocityLineWidth: number;
}

type SettingsContext = [
    settings: Settings,
    setSettings: Dispatch<SetStateAction<Settings>>,
];

const SettingsContext = createContext<SettingsContext | null>(null);

export default SettingsContext;