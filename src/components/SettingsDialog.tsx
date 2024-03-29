import {
	Dialog,
	DialogContent,
	DialogProps,
	DialogTitle,
} from '@mui/material';
import {
	LinearScale,
	Palette,
	Straight,
} from '@mui/icons-material';
import {BoolSetting, ColorSetting, NumberSetting} from './settings';
import useSettings from '../hooks/useSettings';

function SettingsDialog(props: DialogProps) {
	const {
		changeSetting,
		particleColor,
		showForces,
		showScale,
		showVelocities,
		velocityLineColor,
		velocityLineScale,
		velocityLineWidth,
	} = useSettings();

	return (
		<Dialog {...props}>
			<DialogTitle>Settings</DialogTitle>
			<DialogContent sx={{width: '50vw'}}>
				<BoolSetting name='showVelocities' value={showVelocities} icon={<Straight />} onChange={changeSetting} />
				<ColorSetting name='velocityLineColor' disabled={!showVelocities} value={velocityLineColor} icon={<Palette />} onChange={changeSetting} />
				<NumberSetting name='velocityLineScale' disabled={!showVelocities} value={velocityLineScale} icon={<LinearScale />} onChange={changeSetting} />
				<NumberSetting name='velocityLineWidth' disabled={!showVelocities} value={velocityLineWidth} icon={<LinearScale />} onChange={changeSetting} />
				<BoolSetting name='showForces' value={showForces} icon={<Straight />} onChange={changeSetting} />
				<BoolSetting name='showScale' value={showScale} icon={<Straight />} onChange={changeSetting} />
				<ColorSetting name='particleColor' value={particleColor} icon={<Palette />} onChange={changeSetting} />
			</DialogContent>
		</Dialog>
	);
}

export default SettingsDialog;
