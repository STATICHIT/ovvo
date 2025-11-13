import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './CardScanner.css';
import { useCardStream } from '../../hooks/cardScanner/useCardStream';
import { useParticleSystem } from '../../hooks/particles/useParticleSystem';
import { useParticleScanner } from '../../hooks/particles/useParticleScanner';

function CardScanner() {
  const [scanningActive, setScanningActive] = useState(false);
  const particleCanvasRef = useRef(null);
  const scannerCanvasRef = useRef(null);

  const {
    cardLineRef,
    containerRef,
    speed,
    isPaused,
    toggleAnimation,
    resetPosition,
    changeDirection,
  } = useCardStream(setScanningActive);

  useParticleSystem(particleCanvasRef);
  useParticleScanner(scannerCanvasRef, scanningActive);

  return (
    <div className="card-scanner-page">
      <Link to="/" className="back-home-btn">
        ← 返回主页
      </Link>
      <div className="controls">
        <button className="control-btn" onClick={toggleAnimation}>
          {isPaused ? '▶️ Play' : '⏸️ Pause'}
        </button>
        <button className="control-btn" onClick={resetPosition}>
          🔄 Reset
        </button>
        <button className="control-btn" onClick={changeDirection}>
          ↔️ Direction
        </button>
      </div>

      <div className="speed-indicator">
        Speed: <span id="speedValue">{speed}</span> px/s
      </div>

      <div className="container">
        <canvas id="particleCanvas" ref={particleCanvasRef}></canvas>
        <canvas id="scannerCanvas" ref={scannerCanvasRef}></canvas>
        <div className="scanner"></div>
        <div className="card-stream" ref={containerRef} id="cardStream">
          <div className="card-line" ref={cardLineRef} id="cardLine"></div>
        </div>
      </div>

      <div className="inspiration-credit">
        Inspired by{' '}
        <a href="https://evervault.com/" target="_blank" rel="noreferrer">
          @evervault.com
        </a>
      </div>
    </div>
  );
}

export default CardScanner;
