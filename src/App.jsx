import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import CardScanner from './pages/CardScanner/CardScanner';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/card-scanner" element={<CardScanner />} />
    </Routes>
  );
}

export default App;