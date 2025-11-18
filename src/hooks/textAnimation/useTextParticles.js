import { useEffect, useRef } from 'react';

export function useTextParticles(canvasRef, text, isActive) {
  const particlesRef = useRef([]);
  const animationFrameRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!canvasRef.current || !isActive || !text) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // 设置 canvas 尺寸
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth || 1000;
      canvas.height = canvas.offsetHeight || 400;
    };
    resizeCanvas();

    // 创建文字粒子
    const createTextParticles = () => {
      // 临时 canvas 用于获取文字像素
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      
      const fontSize = 100;
      tempCtx.font = `bold ${fontSize}px Arial, sans-serif`;
      const metrics = tempCtx.measureText(text);
      const textWidth = Math.ceil(metrics.width);
      const textHeight = fontSize * 1.2;

      tempCanvas.width = textWidth;
      tempCanvas.height = textHeight;
      
      // 重新设置字体（canvas 尺寸改变后需要重设）
      tempCtx.font = `bold ${fontSize}px Arial, sans-serif`;
      tempCtx.fillStyle = 'white';
      tempCtx.textBaseline = 'top';
      tempCtx.fillText(text, 0, 0);

      // 获取像素数据
      const imageData = tempCtx.getImageData(0, 0, textWidth, textHeight);
      const pixels = imageData.data;

      particlesRef.current = [];
      const gap = 4; // 采样间隔

      for (let y = 0; y < textHeight; y += gap) {
        for (let x = 0; x < textWidth; x += gap) {
          const index = (y * textWidth + x) * 4;
          const alpha = pixels[index + 3];

          if (alpha > 128) {
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const offsetX = textWidth / 2;
            const offsetY = textHeight / 2;

            particlesRef.current.push({
              x: x + centerX - offsetX + (Math.random() - 0.5) * 200,
              y: y + centerY - offsetY + (Math.random() - 0.5) * 200,
              targetX: x + centerX - offsetX,
              targetY: y + centerY - offsetY,
              vx: 0,
              vy: 0,
              size: 2.5,
              hue: Math.random() * 60 + 250, // 紫色范围
            });
          }
        }
      }
      
    };

    createTextParticles();

    // 鼠标移动
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    // 动画循环
    const animate = () => {
      // 清空画布
      ctx.fillStyle = 'rgba(26, 26, 46, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach(particle => {
        // 鼠标排斥
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          const force = (100 - distance) / 100;
          const angle = Math.atan2(dy, dx);
          particle.vx -= Math.cos(angle) * force * 0.5;
          particle.vy -= Math.sin(angle) * force * 0.5;
        }

        // 回到目标位置
        const tdx = particle.targetX - particle.x;
        const tdy = particle.targetY - particle.y;
        particle.vx += tdx * 0.01;
        particle.vy += tdy * 0.01;

        // 速度衰减
        particle.vx *= 0.95;
        particle.vy *= 0.95;

        // 更新位置
        particle.x += particle.vx;
        particle.y += particle.vy;

        // 绘制粒子
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${particle.hue}, 80%, 60%)`;
        ctx.fill();

        // 光晕
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 2
        );
        gradient.addColorStop(0, `hsla(${particle.hue}, 80%, 60%, 0.3)`);
        gradient.addColorStop(1, `hsla(${particle.hue}, 80%, 60%, 0)`);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    canvas.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', resizeCanvas);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      canvas.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [canvasRef, text, isActive]);
}
