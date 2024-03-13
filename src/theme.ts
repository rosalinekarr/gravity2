import { createTheme } from '@mui/material/styles';
import { grey, red } from '@mui/material/colors';

// A custom theme for this app
const theme = createTheme({
	palette: {
		primary: {
			light: grey[700],
			main: grey[800],
			dark: grey[900],
			contrastText: grey[100],
		},
		secondary: {
			light: grey[100],
			main: grey[200],
			dark: grey[300],
			contrastText: grey[900],
		},
		error: {
			main: red.A400,
		},
	},
});

export default theme;