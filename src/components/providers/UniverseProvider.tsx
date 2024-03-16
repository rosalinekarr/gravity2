import React, {useState} from 'react';
import UniverseContext from '../../contexts/universe';
import {Universe} from '../../models';

interface UniverseProviderProps {
    children: React.ReactNode;
}

export default function UniverseProvider({children}: UniverseProviderProps) {
	const [universe, setUniverse] = useState<Universe>(Universe.generate());

	return (
		<UniverseContext.Provider value={[universe, setUniverse]}>
			{children}
		</UniverseContext.Provider>
	);
}