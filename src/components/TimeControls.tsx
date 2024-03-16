import {Fab} from '@mui/material';
import {
	Pause,
	PlayArrow,
} from '@mui/icons-material';
import useTimeScale from '../hooks/useTimeScale';

export default function TimeControls() {
	const [timeScale, setTimeScale] = useTimeScale();

	if (timeScale === 0.0) return (
		<Fab
			sx={{position: 'absolute', bottom: 16, right: 16}}
			color="primary"
			aria-label="play"
			onClick={() => setTimeScale(1.0)}
		>
			<PlayArrow />
		</Fab>
	);
    
	return (
		<Fab
			sx={{position: 'absolute', bottom: 16, right: 16}}
			color="primary"
			aria-label="pause"
			onClick={() => setTimeScale(0.0)}
		>
			<Pause />
		</Fab>
	);
}