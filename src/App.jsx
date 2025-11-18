import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import CardScanner from './pages/CardScanner/CardScanner';
import ParticleCanvas from './pages/ParticleCanvas/ParticleCanvas';
import CodeRain from './pages/CodeRain/CodeRain';
import TextAnimation from './pages/TextAnimation/TextAnimation';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/card-scanner" element={<CardScanner />} />
      <Route path="/particle-canvas" element={<ParticleCanvas />} />
      <Route path="/code-rain" element={<CodeRain />} />
      <Route path="/text-animation" element={<TextAnimation />} />
    </Routes>
  );
}

export default App;