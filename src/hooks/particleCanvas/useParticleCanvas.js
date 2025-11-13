import { useRef, useEffect, useState } from 'react';

export function useParticleCanvas(canvasRef, config) {
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0, isDown: false });
  const animationFrameRef = useRef(null);
  const lastTimeRef = useRef(0);
  const fpsRef = useRef(60);
  const [stats, setStats] = useState({ fps: 60, particleCount: 0 });

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // 设置 canvas 尺寸
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();

    // 粒子类
    class Particle {
      constructor(x, y) {
        this.x = x || Math.random() * canvas.width;
        this.y = y || Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * config.particleSpeed;
        this.vy = (Math.random() - 0.5) * config.particleSpeed;
        this.radius = config.particleSize;
        this.originalRadius = config.particleSize;
        this.life = 1;
        this.maxLife = 1;
      }

      update() {
        // 边界检测
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        // 鼠标排斥效果
        const dx = mouseRef.current.x - this.x;
        const dy = mouseRef.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < config.mouseRadius) {
          const force = (config.mouseRadius - distance) / config.mouseRadius;
          const angle = Math.atan2(dy, dx);
          this.vx -= Math.cos(angle) * force * 0.5;
          this.vy -= Math.sin(angle) * force * 0.5;
        }

        // 速度衰减
        this.vx *= 0.99;
        this.vy *= 0.99;

        // 位置更新
        this.x += this.vx;
        this.y += this.vy;

        // 生命周期（用于爆炸效果）
        if (this.life < this.maxLife) {
          this.life += 0.02;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * this.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 92, 246, ${0.8 * this.life})`;
        ctx.fill();

        // 光晕效果
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * this.life * 2, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.radius * this.life * 2
        );
        gradient.addColorStop(0, `rgba(139, 92, 246, ${0.3 * this.life})`);
        gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }

    // 初始化粒子
    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < config.particleCount; i++) {
        particlesRef.current.push(new Particle());
      }
    };

    // 绘制连线
    const drawConnections = () => {
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const dx = particlesRef.current[i].x - particlesRef.current[j].x;
          const dy = particlesRef.current[i].y - particlesRef.current[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < config.connectionDistance) {
            const opacity = (1 - distance / config.connectionDistance) * 0.5;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particlesRef.current[i].x, particlesRef.current[i].y);
            ctx.lineTo(particlesRef.current[j].x, particlesRef.current[j].y);
            ctx.stroke();
          }
        }
      }
    };

    // 鼠标连线
    const drawMouseConnections = () => {
      for (let particle of particlesRef.current) {
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < config.mouseRadius) {
          const opacity = (1 - distance / config.mouseRadius) * 0.8;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(236, 72, 153, ${opacity})`;
          ctx.lineWidth = 2;
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
          ctx.stroke();
        }
      }
    };

    // 爆炸效果
    const createExplosion = (x, y) => {
      const explosionParticles = 20;
      for (let i = 0; i < explosionParticles; i++) {
        const angle = (Math.PI * 2 * i) / explosionParticles;
        const speed = 3 + Math.random() * 2;
        const particle = new Particle(x, y);
        particle.vx = Math.cos(angle) * speed;
        particle.vy = Math.sin(angle) * speed;
        particle.life = 0.3;
        particle.maxLife = 1;
        particlesRef.current.push(particle);
      }

      // 限制粒子总数
      if (particlesRef.current.length > config.particleCount + 100) {
        particlesRef.current.splice(0, explosionParticles);
      }
    };

    // 动画循环
    const animate = (currentTime) => {
      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      // 计算 FPS
      if (deltaTime > 0) {
        fpsRef.current = Math.round(1000 / deltaTime);
      }

      // 清空画布
      ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 更新和绘制粒子
      particlesRef.current.forEach((particle, index) => {
        particle.update();
        particle.draw();

        // 移除生命周期结束的粒子
        if (particle.life >= particle.maxLife && particlesRef.current.length > config.particleCount) {
          particlesRef.current.splice(index, 1);
        }
      });

      // 绘制连线
      drawConnections();
      drawMouseConnections();

      // 更新统计信息
      if (Math.random() < 0.1) {
        setStats({
          fps: fpsRef.current,
          particleCount: particlesRef.current.length
        });
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // 鼠标事件
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleMouseDown = () => {
      mouseRef.current.isDown = true;
    };

    const handleMouseUp = () => {
      mouseRef.current.isDown = false;
    };

    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      createExplosion(x, y);
    };

    // 触摸事件
    const handleTouchMove = (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      mouseRef.current.x = touch.clientX - rect.left;
      mouseRef.current.y = touch.clientY - rect.top;
    };

    const handleTouchStart = (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      createExplosion(x, y);
    };

    // 初始化
    initParticles();
    lastTimeRef.current = performance.now();
    animate(lastTimeRef.current);

    // 事件监听
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('resize', resizeCanvas);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [canvasRef, config]);

  return { stats };
}
