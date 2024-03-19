import {createContext, Dispatch, SetStateAction} from 'react';
import {Particle, Universe} from '../models';

interface UniverseContext {
    selectedParticles: Particle[];
    setSelectedParticles: Dispatch<SetStateAction<Particle[]>>;
    setTimeScale: Dispatch<SetStateAction<number>>;
    setUniverse: Dispatch<SetStateAction<Universe>>;
    timeScale: number;
    universe: Universe;
    universeTime: number;
}

const UniverseContext = createContext<UniverseContext | null>(null);

export default UniverseContext;