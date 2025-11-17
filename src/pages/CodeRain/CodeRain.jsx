import { useRef, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import './CodeRain.css';
import { useCodeRain } from '../../hooks/codeRain/useCodeRain';

function CodeRain() {
  const canvasRef = useRef(null);
  const [isControlOpen, setIsControlOpen] = useState(true);
  const [config, setConfig] = useState({
    speed: 1,
    fontSize: 16,
    density: 0.95,
    colorMode: 'classic', // classic, rainbow, purple, red
  });

  useCodeRain(canvasRef, config);

  const handleConfigChange = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const toggleControl = () => {
    setIsControlOpen(!isControlOpen);
  };


  return (
    <div className="code-rain-page">
      <Navbar />
      
      {/* 悬浮控制球 */}
      {!isControlOpen && (
        <button className="control-toggle-btn" onClick={toggleControl}>
          <span className="toggle-icon">⚙</span>
        </button>
      )}
      
      {/* 控制面板 */}
      <div className={`rain-controls ${isControlOpen ? 'open' : 'closed'}`}>
        <button className="control-close-btn" onClick={toggleControl}>
          ×
        </button>
        <h3 className="controls-title">控制面板</h3>
        
        <div className="control-group">
          <label>下落速度: {config.speed.toFixed(1)}x</label>
          <input 
            type="range" 
            min="0.3" 
            max="3" 
            step="0.1"
            value={config.speed}
            onChange={(e) => handleConfigChange('speed', parseFloat(e.target.value))}
          />
        </div>

        <div className="control-group">
          <label>字体大小: {config.fontSize}px</label>
          <input 
            type="range" 
            min="10" 
            max="24" 
            value={config.fontSize}
            onChange={(e) => handleConfigChange('fontSize', parseInt(e.target.value))}
          />
        </div>

        <div className="control-group">
          <label>密度: {(config.density * 100).toFixed(0)}%</label>
          <input 
            type="range" 
            min="0.5" 
            max="1" 
            step="0.05"
            value={config.density}
            onChange={(e) => handleConfigChange('density', parseFloat(e.target.value))}
          />
        </div>

        <div className="control-group">
          <label>颜色模式</label>
          <select 
            value={config.colorMode}
            onChange={(e) => handleConfigChange('colorMode', e.target.value)}
            className="color-select"
          >
            <option value="classic">经典绿色</option>
            <option value="rainbow">彩虹</option>
            <option value="purple">紫色</option>
            <option value="red">红色</option>
          </select>
        </div>
      </div>

      {/* Canvas */}
      <canvas ref={canvasRef} className="code-rain-canvas"></canvas>
    </div>
  );
}

export default CodeRain;
