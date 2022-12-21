import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.scss';
import RootComponent from './components/RootComponent';
import SettingsPage from './components/Settings/SettingsPage';
import SettingsProvider from './components/Settings/SettingsProvider';
import StyleProvider from './components/StyleProvider';

export default function App() {
	return (
		<SettingsProvider>
			<StyleProvider>
				<Router>
					<Routes>
						<Route path="/" element={<RootComponent />} />
						<Route path="/settings" element={<SettingsPage />} />
					</Routes>
				</Router>
			</StyleProvider>
		</SettingsProvider>
	);
}
