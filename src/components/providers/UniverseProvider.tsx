import React, {useEffect, useState} from 'react';
import UniverseContext from '../../contexts/universe';
import {Particle, Universe} from '../../models';

interface UniverseProviderProps {
    children: React.ReactNode;
}

export default function UniverseProvider({children}: UniverseProviderProps) {
	const [selectedParticles, setSelectedParticles] = useState<Particle[]>([]);
	const [timeScale, setTimeScale] = useState<number>(0.0);
	const [universe, setUniverse] = useState<Universe>(Universe.generate());
	const [universeTime, setUniverseTime] = useState<number>(0.0);

	useEffect(() => {
		if (timeScale === 0.0) return;

		let timeoutId: number | null = null;
		let lastTick: number = Date.now();

		function tick() {
			const now = Date.now();
			const timeDelta = (now - lastTick) * timeScale;

			universe.update(timeDelta);
			setUniverseTime((prevTime) => prevTime + timeDelta);

			lastTick = now;
			timeoutId = setTimeout(tick, 0);
		}

		timeoutId = setTimeout(tick, 0);
		return () => clearTimeout(timeoutId!);
	}, [timeScale, universe]);

	return (
		<UniverseContext.Provider value={{
			selectedParticles,
			setSelectedParticles,
			setTimeScale,
			setUniverse,
			timeScale,
			universe,
			universeTime,
		}}>
			{children}
		</UniverseContext.Provider>
	);
}