import { useState, useRef } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import './TextAnimation.css';
import { useTypewriter } from '../../hooks/textAnimation/useTypewriter';
import { useTextParticles } from '../../hooks/textAnimation/useTextParticles';

function TextAnimation() {
  const [mode, setMode] = useState('typewriter'); // typewriter, particles, neon
  const [text, setText] = useState('OVVO Creative Lab');
  const [isControlOpen, setIsControlOpen] = useState(true);
  
  const typewriterRef = useRef(null);
  const particlesCanvasRef = useRef(null);
  const neonRef = useRef(null);

  // Hooks
  const { isTyping, restart: restartTypewriter } = useTypewriter(typewriterRef, text, mode === 'typewriter');
  useTextParticles(particlesCanvasRef, text, mode === 'particles');

  const toggleControl = () => {
    setIsControlOpen(!isControlOpen);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  return (
    <div className="text-animation-page">
      <Navbar />
      
      {/* 悬浮控制球 */}
      {!isControlOpen && (
        <button className="text-control-toggle-btn" onClick={toggleControl}>
          <span className="toggle-icon">T</span>
        </button>
      )}
      
      {/* 控制面板 */}
      <div className={`text-controls ${isControlOpen ? 'open' : 'closed'}`}>
        <button className="text-control-close-btn" onClick={toggleControl}>
          ×
        </button>
        <h3 className="text-controls-title">文字动画</h3>
        
        <div className="text-control-group">
          <label>输入文字</label>
          <input 
            type="text" 
            value={text}
            onChange={handleTextChange}
            className="text-input"
            placeholder="输入你的文字..."
            maxLength={50}
          />
        </div>

        <div className="text-control-group">
          <label>动画模式</label>
          <div className="mode-buttons">
            <button 
              className={`mode-btn ${mode === 'typewriter' ? 'active' : ''}`}
              onClick={() => setMode('typewriter')}
            >
              打字机
            </button>
            <button 
              className={`mode-btn ${mode === 'particles' ? 'active' : ''}`}
              onClick={() => setMode('particles')}
            >
              粒子化
            </button>
            <button 
              className={`mode-btn ${mode === 'neon' ? 'active' : ''}`}
              onClick={() => setMode('neon')}
            >
              霓虹灯
            </button>
          </div>
        </div>

        {mode === 'typewriter' && (
          <button className="restart-btn" onClick={restartTypewriter}>
            重新播放
          </button>
        )}
      </div>

      {/* 动画容器 */}
      <div className="text-animation-container">
        {/* 打字机效果 */}
        {mode === 'typewriter' && (
          <div className="typewriter-container">
            <h1 ref={typewriterRef} className="typewriter-text"></h1>
            <span className={`cursor ${isTyping ? 'typing' : ''}`}>|</span>
          </div>
        )}

        {/* 粒子化效果 */}
        {mode === 'particles' && (
          <canvas ref={particlesCanvasRef} className="particles-canvas"></canvas>
        )}

        {/* 霓虹灯效果 */}
        {mode === 'neon' && (
          <div className="neon-container">
            <h1 ref={neonRef} className="neon-text" data-text={text}>
              {text}
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}

export default TextAnimation;
