import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import {SettingsProvider, UniverseProvider} from './components/providers';
import theme from './theme';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ThemeProvider theme={theme}>
			<SettingsProvider>
				<UniverseProvider>
					<CssBaseline />
					<App />
				</UniverseProvider>
			</SettingsProvider>
		</ThemeProvider>
	</React.StrictMode>,
)
