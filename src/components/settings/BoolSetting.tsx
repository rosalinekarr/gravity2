import {
    Grid,
    Switch,
    Typography,
} from '@mui/material';
import {Settings} from '../../contexts/settings';
import {camelToKebabCase, camelToTitleCase} from '../../utilities';

interface BoolSettingProps {
    icon: JSX.Element;
    name: keyof Settings;
    onChange: (key: keyof Settings, newVal: boolean) => void;
    value: boolean;
}

function BoolSetting({
    icon,
    name,
    onChange,
    value,
}: BoolSettingProps) {
  return (
    <>
        <Typography variant="body1" id={`${camelToKebabCase(name)}-toggle`} gutterBottom>{camelToTitleCase(name)}</Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item>{icon}</Grid>
          <Grid item xs>
            <Switch
              aria-labelledby={`${camelToKebabCase(name)}-toggle`}
              checked={value}
              onChange={(e) => onChange(name, e.target.checked)} />
          </Grid>
        </Grid>
    </>
  );
}

export default BoolSetting;