import {useMemo} from 'react';
import {CircularProgress, Fab, Stack} from '@mui/material';
import {
	FastForward,
	FastRewind,
	Pause,
	PlayArrow,
} from '@mui/icons-material';
import {useTimeScale, useUniverse} from '../hooks';

export default function TimeControls() {
	const [timeScale, setTimeScale] = useTimeScale();
	const {universeTime} = useUniverse();

	const progress = useMemo(() => {
		const percentage = (universeTime / 600.0) % 100.0;
		if (percentage < 0) return percentage + 100;
		return percentage;
	}, [universeTime]);

	return (
		<Stack direction='row' spacing={1} alignItems='center' sx={{position: 'absolute', bottom: 16, right: 16}}>
			<Fab
				aria-label="rewind"
				color="primary"
				onClick={() => setTimeScale((prevScale) => (prevScale > 0.0 ? 0.0 : prevScale) - 1.0)}
				size='small'
			>
				<FastRewind />
			</Fab>
			<Fab
				color="primary"
				aria-label={(timeScale === 0.0) ? 'play' : 'pause'}
				onClick={() => setTimeScale((prevTimeScale) => prevTimeScale === 0.0 ? 1.0 : 0.0)}
			>
				{timeScale === 0.0 ? <PlayArrow /> : <Pause />}
				<CircularProgress
					color='secondary'
					size={60}
					sx={{position: 'absolute', circle: {transition: 'none'}}}
					variant="determinate"
					value={progress}
				/>
			</Fab>
			<Fab
				aria-label="speed up"
				color="primary"
				onClick={() => setTimeScale((prevScale) => (prevScale < 0.0 ? 1.0 : prevScale) + 1.0)}
				size='small'
			>
				<FastForward />
			</Fab>
		</Stack>
	);
}