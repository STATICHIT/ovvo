import { useRef, useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import './ParticleCanvas.css';
import { useParticleCanvas } from '../../hooks/particleCanvas/useParticleCanvas';

function ParticleCanvas() {
  const canvasRef = useRef(null);
  const [config, setConfig] = useState({
    particleCount: 100,
    connectionDistance: 150,
    mouseRadius: 200,
    particleSpeed: 0.5,
    particleSize: 2,
  });

  const { stats } = useParticleCanvas(canvasRef, config);

  const handleConfigChange = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: parseFloat(value) }));
  };

  return (
    <div className="particle-canvas-page">
      <Navbar />
      
      {/* 背景装饰 */}
      <div className="particle-bg-gradient"></div>
      
      {/* 控制面板 */}
      <div className="particle-controls">
        <h3 className="controls-title">控制面板</h3>
        
        <div className="control-group">
          <label>粒子数量: {config.particleCount}</label>
          <input 
            type="range" 
            min="50" 
            max="300" 
            value={config.particleCount}
            onChange={(e) => handleConfigChange('particleCount', e.target.value)}
          />
        </div>

        <div className="control-group">
          <label>连线距离: {config.connectionDistance}px</label>
          <input 
            type="range" 
            min="50" 
            max="300" 
            value={config.connectionDistance}
            onChange={(e) => handleConfigChange('connectionDistance', e.target.value)}
          />
        </div>

        <div className="control-group">
          <label>鼠标影响: {config.mouseRadius}px</label>
          <input 
            type="range" 
            min="50" 
            max="400" 
            value={config.mouseRadius}
            onChange={(e) => handleConfigChange('mouseRadius', e.target.value)}
          />
        </div>

        <div className="control-group">
          <label>粒子速度: {config.particleSpeed.toFixed(1)}</label>
          <input 
            type="range" 
            min="0.1" 
            max="2" 
            step="0.1"
            value={config.particleSpeed}
            onChange={(e) => handleConfigChange('particleSpeed', e.target.value)}
          />
        </div>

        <div className="control-group">
          <label>粒子大小: {config.particleSize}px</label>
          <input 
            type="range" 
            min="1" 
            max="5" 
            value={config.particleSize}
            onChange={(e) => handleConfigChange('particleSize', e.target.value)}
          />
        </div>

        {stats && (
          <div className="stats">
            <div className="stat-item">FPS: {stats.fps}</div>
            <div className="stat-item">粒子: {stats.particleCount}</div>
          </div>
        )}
      </div>

      {/* 提示信息 */}
      <div className="particle-hints">
        <p>💡 移动鼠标查看粒子反应</p>
        <p>🖱️ 点击产生爆炸效果</p>
      </div>

      {/* Canvas */}
      <canvas ref={canvasRef} className="particle-canvas"></canvas>
    </div>
  );
}

export default ParticleCanvas;
