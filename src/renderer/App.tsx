import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@primer/react';
import './App.scss';
import RootComponent from './components/RootComponent';
import { GlobalStyle, systemTheme } from './Theme';

export default function App() {
	return (
		<ThemeProvider theme={systemTheme} colorMode="auto">
			<GlobalStyle />
			<Router>
				<Routes>
					<Route path="/" element={<RootComponent />} />
				</Routes>
			</Router>
		</ThemeProvider>
	);
}
