import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.scss';
import RootComponent from './components/RootComponent'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootComponent />} />
      </Routes>
    </Router>
  );
}