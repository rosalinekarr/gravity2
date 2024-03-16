import {useEffect, useState} from 'react';
import {
	Box,
	Fab,
} from '@mui/material';
import {
	Pause,
	PlayArrow,
} from '@mui/icons-material';
import './App.css';
import Canvas from './components/Canvas';
import MainMenu from './components/MainMenu';
import {useSettings, useUniverse} from './hooks';
import {Particle} from './models';

function App() {
	const {timeScale} = useSettings();
	const [paused, setPaused] = useState(true);
	const [selectedParticles, setSelectedParticles] = useState<Particle[]>([]);
	const {universe} = useUniverse();

	useEffect(() => {
		if (paused) return;

		let timeoutId: number | null = null;
		let lastTick: number = Date.now();

		function tick() {
			const now = Date.now();
			const timeDelta = (now - lastTick);

			universe.update(timeDelta * timeScale);

			lastTick = now;
			timeoutId = setTimeout(tick, 0);
		}

		timeoutId = setTimeout(tick, 0);
		return () => clearTimeout(timeoutId!);
	}, [paused, timeScale, universe]);

	useEffect(() => {
		function handleKeydown(e: KeyboardEvent) {
			if (e.code === 'Space' && !e.repeat) setPaused((prevPaused) => !prevPaused);
		}

		document.addEventListener('keydown', handleKeydown);
		return () => {
			document.removeEventListener('keydown', handleKeydown);
		};
	}, []);

	return (
		<Box>
			<Canvas universe={universe} onSelect={(particles) => setSelectedParticles(particles)} selectedParticles={selectedParticles} />
			<MainMenu />
			{paused ? (
				<Fab
					sx={{position: 'absolute', bottom: 16, right: 16}}
					color="primary"
					aria-label="play"
					onClick={() => setPaused(false)}
				>
					<PlayArrow />
				</Fab>
			) : (
				<Fab
					sx={{position: 'absolute', bottom: 16, right: 16}}
					color="primary"
					aria-label="pause"
					onClick={() => setPaused(true)}
				>
					<Pause />
				</Fab>
			)}
		</Box>
	)
}

export default App;
