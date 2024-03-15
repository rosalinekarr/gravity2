import {useMemo} from 'react';
import {
	Grid,
	InputAdornment,
	TextField,
	Typography,
} from '@mui/material';
import {Circle} from '@mui/icons-material';
import {Settings} from '../../contexts/settings';
import {camelToKebabCase, camelToTitleCase} from '../../utilities';

interface ColorSettingProps {
    disabled?: boolean;
    icon: JSX.Element;
    name: keyof Settings;
    onChange: (key: keyof Settings, newVal: string) => void;
    value: string;
}

function ColorSetting({
	disabled,
	icon,
	name,
	onChange,
	value,
}: ColorSettingProps) {
	const ariaLabel = useMemo(() => `${camelToKebabCase(name)}-input`, [name]);

	return (
		<>
			<Typography variant="body1" id={ariaLabel} gutterBottom>{camelToTitleCase(name)}</Typography>
			<Grid container spacing={2} alignItems="center">
				<Grid item>{icon}</Grid>
				<Grid item xs>
					<TextField
						aria-labelledby={ariaLabel}
						disabled={disabled}
						value={value}
						onChange={(e) => onChange(name, e.target.value)}
						InputProps={{startAdornment: (
							<InputAdornment position="start">
								<Circle sx={{color: value}} />
							</InputAdornment>
						)}}
					/>
				</Grid>
			</Grid>
		</>
	);
}

export default ColorSetting;