import {useState} from 'react';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	Input,
	Slider,
	Typography,
} from '@mui/material';
import {
	Grain,
	Scale,
} from '@mui/icons-material';
import { UniverseGenerateOptions } from '../models';

interface NewUniverseDialogProps {
	onCreate: (opts: UniverseGenerateOptions) => void;
	onClose: () => void;
	open: boolean;
}

const DEFAULT_PARTICLE_COUNT = 100;
const DEFAULT_MASS_RANGE: [number, number] = [10000000.0, 10000000000.0];

export default function NewUniverseDialog({onClose, onCreate, open}: NewUniverseDialogProps) {
	const [massRange, setMassRange] = useState<[number, number]>(DEFAULT_MASS_RANGE);
	const [particleCount, setParticleCount] = useState(DEFAULT_PARTICLE_COUNT);

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>New Universe</DialogTitle>
			<DialogContent sx={{width: '50vw'}}>
				<Typography variant="body1" id="particle-count" gutterBottom>Particle Count</Typography>
				<Grid container spacing={2} alignItems="center">
					<Grid item><Grain /></Grid>
					<Grid item xs>
						<Slider aria-labelledby="particle-count-slider" value={particleCount} onChange={(_, newVal: number | number[]) => {if (typeof newVal == 'number') setParticleCount(newVal)}} min={1} max={1000} step={1} />
					</Grid>
					<Grid item>
						<Input value={particleCount} onChange={(e) => setParticleCount(e.target.value === '' ? 0 : Number(e.target.value))} inputProps={{step: 1, min: 1, max: 1000, type: 'number'}} />
					</Grid>
				</Grid>
				<Typography variant="body1" id="mass-range" gutterBottom>Mass Range</Typography>
				<Grid container spacing={2} alignItems="center">
					<Grid item><Scale /></Grid>
					<Grid item xs>
						<Slider aria-labelledby="mass-range-slider" value={massRange} onChange={(_, newVal: number | number[]) => {if (typeof newVal == 'object' && newVal.length == 2) setMassRange(newVal as [number, number])}} min={0} max={10000} step={1} />
					</Grid>
					<Grid item>
						<Input value={massRange[0]} onChange={(e) => setMassRange([e.target.value === '' ? 0 : Number(e.target.value), massRange[1]])} inputProps={{step: 1, min: 0, max: massRange[1], type: 'number'}} />
						<Typography variant="body1"> - </Typography>
						<Input value={massRange[1]} onChange={(e) => setMassRange([massRange[0], e.target.value === '' ? 0 : Number(e.target.value)])} inputProps={{step: 1, min: massRange[0], max: 10000, type: 'number'}} />
						<Typography variant="body1"> kg</Typography>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => onClose()}>Cancel</Button>
				<Button onClick={() => onCreate({
					maxMass: massRange[1],
					minMass: massRange[0],
					particleCount,
				})}>Create</Button>
			</DialogActions>
		</Dialog>
	);
}