import {useEffect, useState} from 'react';
import {
	Box,
	Drawer,
	Fab,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
} from '@mui/material';
import {
	Create,
	Download,
	Menu,
	Pause,
	PlayArrow,
	Settings,
	Upload,
} from '@mui/icons-material';
import './App.css';
import Canvas from './components/Canvas';
import SettingsDialog from './components/SettingsDialog';
import {useSettings} from './hooks';
import {Particle, Universe} from './models';
import NewUniverseDialog from './components/NewUniverseDialog';

interface HandleCreateUniverseArgs {
	massRange: [number, number];
	particleCount: number;
}

function App() {
	const {timeScale} = useSettings();
	const [createModalOpen, setCreateModalOpen] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);
	const [paused, setPaused] = useState(true);
	const [selectedParticles, setSelectedParticles] = useState<Particle[]>([]);
	const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
	const [universe, setUniverse] = useState(Universe.generate());

	function handleCreate({massRange, particleCount}: HandleCreateUniverseArgs) {
		setUniverse(Universe.generate({
			maxMass: massRange[1],
			minMass: massRange[0],
			particleCount,
			noOverlappingParticles: true,
		}));
		setCreateModalOpen(false);
	}

	function handleSaveUniverse() {
		const tempLink = document.createElement('a');
		const data = new Blob([JSON.stringify(universe.serialize())], {type: 'text/json'});
		tempLink.href = URL.createObjectURL(data);
		tempLink.download = `universe-${Date.now()}.json`;
		tempLink.click();
		URL.revokeObjectURL(tempLink.href);
	}

	function handleLoadUniverse() {
		const tempInput = document.createElement('input');
		tempInput.type = 'file';
		tempInput.accept = '.json';
		tempInput.addEventListener('change', (e: Event) => {
			const files = (e.target as HTMLInputElement)?.files || [];
			if (files.length != 1) return;
			const reader = new FileReader();
			reader.addEventListener('load', () => {
				setUniverse(
					Universe.deserialize(
						JSON.parse(
              reader.result as string
						)
					)
				);
			});
			reader.readAsText(files[0]);
		});
		tempInput.click();
	}

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

	return (
		<Box>
			<Drawer open={menuOpen} onClose={() => setMenuOpen(false)}>
				<List>
					<ListItem>
						<ListItemButton onClick={() => setCreateModalOpen(true)}>
							<ListItemIcon><Create /></ListItemIcon>
							<ListItemText>New Universe</ListItemText>
						</ListItemButton>
					</ListItem>
				</List>
				<List>
					<ListItem>
						<ListItemButton onClick={handleSaveUniverse}>
							<ListItemIcon><Download /></ListItemIcon>
							<ListItemText>Save Universe</ListItemText>
						</ListItemButton>
					</ListItem>
				</List>
				<List>
					<ListItem>
						<ListItemButton onClick={handleLoadUniverse}>
							<ListItemIcon><Upload /></ListItemIcon>
							<ListItemText>Load Universe</ListItemText>
						</ListItemButton>
					</ListItem>
				</List>
				<List>
					<ListItem>
						<ListItemButton onClick={() => setSettingsDialogOpen(true)}>
							<ListItemIcon><Settings /></ListItemIcon>
							<ListItemText>Settings</ListItemText>
						</ListItemButton>
					</ListItem>
				</List>
			</Drawer>
			<NewUniverseDialog open={createModalOpen} onClose={() => setCreateModalOpen(false)} onCreate={handleCreate} />
			<SettingsDialog open={settingsDialogOpen} onClose={() => setSettingsDialogOpen(false)} />
			<Canvas universe={universe} onSelect={(particles) => setSelectedParticles(particles)} selectedParticles={selectedParticles} />
			<Fab
				sx={{position: 'absolute', top: 16, left: 16}}
				color="primary"
				aria-label="open menu"
				onClick={() => setMenuOpen(true)}
			>
				<Menu />
			</Fab>
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
