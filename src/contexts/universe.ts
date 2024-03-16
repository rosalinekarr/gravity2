import {createContext, Dispatch, SetStateAction} from 'react';
import {Universe} from '../models';

type UniverseContext = [
    universe: Universe,
    setUniverse: Dispatch<SetStateAction<Universe>>,
];

const UniverseContext = createContext<UniverseContext | null>(null);

export default UniverseContext;