import {Dispatch, SetStateAction, useContext} from 'react';
import UniverseContext from '../contexts/universe';

export default function useTimeScale(): [number, Dispatch<SetStateAction<number>>] {
	const universeContext = useContext(UniverseContext);
	if (!universeContext) throw new Error('Missing Universe Provider');
	const {setTimeScale, timeScale} = universeContext;
	return [timeScale, setTimeScale];
}