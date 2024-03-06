import {
    Grid,
    Input,
    Slider,
    Typography,
} from '@mui/material';
import {Settings} from '../../contexts/settings';
import {camelToKebabCase, camelToTitleCase} from '../../utilities';

interface NumberSettingProps {
    disabled?: boolean;
    icon: JSX.Element;
    name: keyof Settings;
    max?: number;
    min?: number;
    onChange: (key: keyof Settings, newVal: number) => void;
    step?: number;
    value: number;
}

function NumberSetting({
    disabled,
    icon,
    name,
    max,
    min,
    onChange,
    step,
    value,
}: NumberSettingProps) {
  return (
    <>
        <Typography variant="body1" id={`${camelToKebabCase(name)}-slider`} gutterBottom>{camelToTitleCase(name)}</Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item>{icon}</Grid>
          <Grid item xs>
            <Slider
                aria-labelledby={`${camelToKebabCase(name)}-slider`}
                disabled={disabled}
                value={value}
                onChange={(_, newVal: number | number[]) => {if (typeof newVal == 'number') onChange(name, newVal)}}
                min={min}
                max={max}
                step={step}
            />
        </Grid><Grid item>
            <Input
                aria-labelledby={`${camelToKebabCase(name)}-slider`}
                disabled={disabled}
                value={value}
                onChange={(e) => {if (e.target.value !== '') onChange(name, Number(e.target.value))}}
                inputProps={{step: step, min: min, max: max, type: 'number'}}
            />
          </Grid>
        </Grid>
    </>
  );
}

export default NumberSetting;