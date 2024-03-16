import {createContext, Dispatch, SetStateAction} from 'react';

export interface Settings {
    font: string;
    highlightLineColor: string;
    highlightLineWidth: number;
    nameOffsetX: number;
    nameOffsetY: number;
    particleColor: string;
    scaleRate: number;
    selectionHighlightOffset: number;
    showForces: boolean;
    showNames: boolean;
    showScale: boolean;
    showVelocities: boolean;
    textColor: string;
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