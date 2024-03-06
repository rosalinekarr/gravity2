import {
    Dialog,
    DialogContent,
    DialogProps,
    DialogTitle,
} from '@mui/material';
import {
    BlurCircular,
    HourglassFull,
    LinearScale,
    Palette,
    Scale,
    Straight,
} from '@mui/icons-material';
import {BoolSetting, ColorSetting, NumberSetting} from './settings';
import useSettings from '../hooks/useSettings';

function SettingsDialog(props: DialogProps) {
    const {
        changeSetting,
        forceLineColor,
        forceLineScale,
        forceLineWidth,
        gravitationalConstant,
        particleColor,
        particleDensity,
        scale,
        showForces,
        showScale,
        showVelocities,
        timeScale,
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
            <ColorSetting name='forceLineColor' disabled={!showForces} value={forceLineColor} icon={<Palette />} onChange={changeSetting} />
            <NumberSetting name='forceLineScale' disabled={!showForces} value={forceLineScale} icon={<LinearScale />} onChange={changeSetting} />
            <NumberSetting name='forceLineWidth' disabled={!showForces} value={forceLineWidth} icon={<LinearScale />} onChange={changeSetting} />
            <BoolSetting name='showScale' value={showScale} icon={<Straight />} onChange={changeSetting} />
            <ColorSetting name='particleColor' value={particleColor} icon={<Palette />} onChange={changeSetting} />
            <NumberSetting name='particleDensity' value={particleDensity} icon={<BlurCircular />} onChange={changeSetting} />
            <NumberSetting name='scale' value={scale} icon={<LinearScale />} onChange={changeSetting} />
            <NumberSetting name='timeScale' value={timeScale} icon={<HourglassFull />} onChange={changeSetting} />
            <NumberSetting name='gravitationalConstant' value={gravitationalConstant} icon={<Scale />} onChange={changeSetting} />
          </DialogContent>
        </Dialog>
    );
}

export default SettingsDialog;
