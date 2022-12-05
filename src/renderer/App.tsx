import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@primer/react';
import './App.scss';
import RootComponent from './components/RootComponent';
import { GlobalStyle, systemTheme } from './Theme';
import SettingsPage from './components/Settings/SettingsPage';

export default function App() {
	return (
		<ThemeProvider theme={systemTheme} colorMode="auto">
			<GlobalStyle />
			<Router>
				<Routes>
					<Route path="/" element={<RootComponent />} />
					<Route path="/settings" element={<SettingsPage />} />
				</Routes>
			</Router>
		</ThemeProvider>
	);
}
