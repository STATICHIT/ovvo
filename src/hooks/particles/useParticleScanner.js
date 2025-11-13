import { useRef, useEffect } from 'react';

export function useParticleScanner(canvasRef, scanningActive) {
  const ctxRef = useRef(null);
  const animationFrameRef = useRef(null);
  const wRef = useRef(window.innerWidth);
  const hRef = useRef(300);
  const particlesRef = useRef([]);
  const countRef = useRef(0);
  const maxParticlesRef = useRef(800);
  const intensityRef = useRef(0.8);
  const lightBarXRef = useRef(window.innerWidth / 2);
  const lightBarWidthRef = useRef(3);
  const fadeZoneRef = useRef(60);
  const scanTargetIntensityRef = useRef(1.8);
  const scanTargetParticlesRef = useRef(2500);
  const scanTargetFadeZoneRef = useRef(35);
  const baseIntensityRef = useRef(0.8);
  const baseMaxParticlesRef = useRef(800);
  const baseFadeZoneRef = useRef(60);
  const currentIntensityRef = useRef(0.8);
  const currentMaxParticlesRef = useRef(800);
  const currentFadeZoneRef = useRef(60);
  const transitionSpeedRef = useRef(0.05);
  const currentGlowIntensityRef = useRef(1);
  const gradientCanvasRef = useRef(null);

  const random = (min, max) => {
    if (arguments.length < 2) {
      max = min;
      min = 0;
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const randomFloat = (min, max) => {
    return Math.random() * (max - min) + min;
  };

  const createParticle = () => {
    const intensityRatio = intensityRef.current / baseIntensityRef.current;
    const speedMultiplier = 1 + (intensityRatio - 1) * 1.2;
    const sizeMultiplier = 1 + (intensityRatio - 1) * 0.7;

    return {
      x: lightBarXRef.current + randomFloat(-lightBarWidthRef.current / 2, lightBarWidthRef.current / 2),
      y: randomFloat(0, hRef.current),
      vx: randomFloat(0.2, 1.0) * speedMultiplier,
      vy: randomFloat(-0.15, 0.15) * speedMultiplier,
      radius: randomFloat(0.4, 1) * sizeMultiplier,
      alpha: randomFloat(0.6, 1),
      decay: randomFloat(0.005, 0.025) * (2 - intensityRatio * 0.5),
      originalAlpha: 0,
      life: 1.0,
      time: 0,
      startX: 0,
      twinkleSpeed: randomFloat(0.02, 0.08) * speedMultiplier,
      twinkleAmount: randomFloat(0.1, 0.25),
    };
  };

  const resetParticle = (particle) => {
    particle.x = lightBarXRef.current + randomFloat(-lightBarWidthRef.current / 2, lightBarWidthRef.current / 2);
    particle.y = randomFloat(0, hRef.current);
    particle.vx = randomFloat(0.2, 1.0);
    particle.vy = randomFloat(-0.15, 0.15);
    particle.alpha = randomFloat(0.6, 1);
    particle.originalAlpha = particle.alpha;
    particle.life = 1.0;
    particle.time = 0;
    particle.startX = particle.x;
  };

  const updateParticle = (particle) => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.time++;
    particle.alpha = particle.originalAlpha * particle.life + Math.sin(particle.time * particle.twinkleSpeed) * particle.twinkleAmount;
    particle.life -= particle.decay;
    if (particle.x > wRef.current + 10 || particle.life <= 0) {
      resetParticle(particle);
    }
  };

  const drawParticle = (particle) => {
    if (particle.life <= 0 || !ctxRef.current || !gradientCanvasRef.current) return;
    let fadeAlpha = 1;
    if (particle.y < fadeZoneRef.current) {
      fadeAlpha = particle.y / fadeZoneRef.current;
    } else if (particle.y > hRef.current - fadeZoneRef.current) {
      fadeAlpha = (hRef.current - particle.y) / fadeZoneRef.current;
    }
    fadeAlpha = Math.max(0, Math.min(1, fadeAlpha));
    ctxRef.current.globalAlpha = particle.alpha * fadeAlpha;
    ctxRef.current.drawImage(
      gradientCanvasRef.current,
      particle.x - particle.radius,
      particle.y - particle.radius,
      particle.radius * 2,
      particle.radius * 2
    );
  };

  const drawLightBar = () => {
    if (!ctxRef.current) return;

    const verticalGradient = ctxRef.current.createLinearGradient(0, 0, 0, hRef.current);
    verticalGradient.addColorStop(0, "rgba(255, 255, 255, 0)");
    verticalGradient.addColorStop(fadeZoneRef.current / hRef.current, "rgba(255, 255, 255, 1)");
    verticalGradient.addColorStop(1 - fadeZoneRef.current / hRef.current, "rgba(255, 255, 255, 1)");
    verticalGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctxRef.current.globalCompositeOperation = "lighter";

    const targetGlowIntensity = scanningActive ? 3.5 : 1;
    currentGlowIntensityRef.current += (targetGlowIntensity - currentGlowIntensityRef.current) * transitionSpeedRef.current;
    const glowIntensity = currentGlowIntensityRef.current;
    const lineWidth = lightBarWidthRef.current;
    const glow1Alpha = scanningActive ? 1.0 : 0.8;
    const glow2Alpha = scanningActive ? 0.8 : 0.6;
    const glow3Alpha = scanningActive ? 0.6 : 0.4;

    const coreGradient = ctxRef.current.createLinearGradient(
      lightBarXRef.current - lineWidth / 2,
      0,
      lightBarXRef.current + lineWidth / 2,
      0
    );
    coreGradient.addColorStop(0, "rgba(255, 255, 255, 0)");
    coreGradient.addColorStop(0.3, `rgba(255, 255, 255, ${0.9 * glowIntensity})`);
    coreGradient.addColorStop(0.5, `rgba(255, 255, 255, ${1 * glowIntensity})`);
    coreGradient.addColorStop(0.7, `rgba(255, 255, 255, ${0.9 * glowIntensity})`);
    coreGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctxRef.current.globalAlpha = 1;
    ctxRef.current.fillStyle = coreGradient;
    const radius = 15;
    ctxRef.current.beginPath();
    if (ctxRef.current.roundRect) {
      ctxRef.current.roundRect(lightBarXRef.current - lineWidth / 2, 0, lineWidth, hRef.current, radius);
    } else {
      ctxRef.current.fillRect(lightBarXRef.current - lineWidth / 2, 0, lineWidth, hRef.current);
    }
    ctxRef.current.fill();

    const glow1Gradient = ctxRef.current.createLinearGradient(
      lightBarXRef.current - lineWidth * 2,
      0,
      lightBarXRef.current + lineWidth * 2,
      0
    );
    glow1Gradient.addColorStop(0, "rgba(139, 92, 246, 0)");
    glow1Gradient.addColorStop(0.5, `rgba(196, 181, 253, ${0.8 * glowIntensity})`);
    glow1Gradient.addColorStop(1, "rgba(139, 92, 246, 0)");
    ctxRef.current.globalAlpha = glow1Alpha;
    ctxRef.current.fillStyle = glow1Gradient;
    const glow1Radius = 25;
    ctxRef.current.beginPath();
    if (ctxRef.current.roundRect) {
      ctxRef.current.roundRect(lightBarXRef.current - lineWidth * 2, 0, lineWidth * 4, hRef.current, glow1Radius);
    } else {
      ctxRef.current.fillRect(lightBarXRef.current - lineWidth * 2, 0, lineWidth * 4, hRef.current);
    }
    ctxRef.current.fill();

    const glow2Gradient = ctxRef.current.createLinearGradient(
      lightBarXRef.current - lineWidth * 4,
      0,
      lightBarXRef.current + lineWidth * 4,
      0
    );
    glow2Gradient.addColorStop(0, "rgba(139, 92, 246, 0)");
    glow2Gradient.addColorStop(0.5, `rgba(139, 92, 246, ${0.4 * glowIntensity})`);
    glow2Gradient.addColorStop(1, "rgba(139, 92, 246, 0)");
    ctxRef.current.globalAlpha = glow2Alpha;
    ctxRef.current.fillStyle = glow2Gradient;
    const glow2Radius = 35;
    ctxRef.current.beginPath();
    if (ctxRef.current.roundRect) {
      ctxRef.current.roundRect(lightBarXRef.current - lineWidth * 4, 0, lineWidth * 8, hRef.current, glow2Radius);
    } else {
      ctxRef.current.fillRect(lightBarXRef.current - lineWidth * 4, 0, lineWidth * 8, hRef.current);
    }
    ctxRef.current.fill();

    if (scanningActive) {
      const glow3Gradient = ctxRef.current.createLinearGradient(
        lightBarXRef.current - lineWidth * 8,
        0,
        lightBarXRef.current + lineWidth * 8,
        0
      );
      glow3Gradient.addColorStop(0, "rgba(139, 92, 246, 0)");
      glow3Gradient.addColorStop(0.5, "rgba(139, 92, 246, 0.2)");
      glow3Gradient.addColorStop(1, "rgba(139, 92, 246, 0)");
      ctxRef.current.globalAlpha = glow3Alpha;
      ctxRef.current.fillStyle = glow3Gradient;
      const glow3Radius = 45;
      ctxRef.current.beginPath();
      if (ctxRef.current.roundRect) {
        ctxRef.current.roundRect(lightBarXRef.current - lineWidth * 8, 0, lineWidth * 16, hRef.current, glow3Radius);
      } else {
        ctxRef.current.fillRect(lightBarXRef.current - lineWidth * 8, 0, lineWidth * 16, hRef.current);
      }
      ctxRef.current.fill();
    }

    ctxRef.current.globalCompositeOperation = "destination-in";
    ctxRef.current.globalAlpha = 1;
    ctxRef.current.fillStyle = verticalGradient;
    ctxRef.current.fillRect(0, 0, wRef.current, hRef.current);
  };

  const render = () => {
    if (!ctxRef.current) return;

    const targetIntensity = scanningActive ? scanTargetIntensityRef.current : baseIntensityRef.current;
    const targetMaxParticles = scanningActive ? scanTargetParticlesRef.current : baseMaxParticlesRef.current;
    const targetFadeZone = scanningActive ? scanTargetFadeZoneRef.current : baseFadeZoneRef.current;

    currentIntensityRef.current += (targetIntensity - currentIntensityRef.current) * transitionSpeedRef.current;
    currentMaxParticlesRef.current += (targetMaxParticles - currentMaxParticlesRef.current) * transitionSpeedRef.current;
    currentFadeZoneRef.current += (targetFadeZone - currentFadeZoneRef.current) * transitionSpeedRef.current;

    intensityRef.current = currentIntensityRef.current;
    maxParticlesRef.current = Math.floor(currentMaxParticlesRef.current);
    fadeZoneRef.current = currentFadeZoneRef.current;

    ctxRef.current.globalCompositeOperation = "source-over";
    ctxRef.current.clearRect(0, 0, wRef.current, hRef.current);

    drawLightBar();

    ctxRef.current.globalCompositeOperation = "lighter";
    for (let i = 1; i <= countRef.current; i++) {
      if (particlesRef.current[i]) {
        updateParticle(particlesRef.current[i]);
        drawParticle(particlesRef.current[i]);
      }
    }

    const currentIntensity = intensityRef.current;
    const currentMaxParticles = maxParticlesRef.current;

    if (Math.random() < currentIntensity && countRef.current < currentMaxParticles) {
      const particle = createParticle();
      particle.originalAlpha = particle.alpha;
      particle.startX = particle.x;
      countRef.current++;
      particlesRef.current[countRef.current] = particle;
    }

    const intensityRatio = intensityRef.current / baseIntensityRef.current;
    if (intensityRatio > 1.1 && Math.random() < (intensityRatio - 1.0) * 1.2) {
      const particle = createParticle();
      particle.originalAlpha = particle.alpha;
      particle.startX = particle.x;
      countRef.current++;
      particlesRef.current[countRef.current] = particle;
    }

    if (intensityRatio > 1.3 && Math.random() < (intensityRatio - 1.3) * 1.4) {
      const particle = createParticle();
      particle.originalAlpha = particle.alpha;
      particle.startX = particle.x;
      countRef.current++;
      particlesRef.current[countRef.current] = particle;
    }

    if (intensityRatio > 1.5 && Math.random() < (intensityRatio - 1.5) * 1.8) {
      const particle = createParticle();
      particle.originalAlpha = particle.alpha;
      particle.startX = particle.x;
      countRef.current++;
      particlesRef.current[countRef.current] = particle;
    }

    if (intensityRatio > 2.0 && Math.random() < (intensityRatio - 2.0) * 2.0) {
      const particle = createParticle();
      particle.originalAlpha = particle.alpha;
      particle.startX = particle.x;
      countRef.current++;
      particlesRef.current[countRef.current] = particle;
    }

    if (countRef.current > currentMaxParticles + 200) {
      const excessCount = Math.min(15, countRef.current - currentMaxParticles);
      for (let i = 0; i < excessCount; i++) {
        delete particlesRef.current[countRef.current - i];
      }
      countRef.current -= excessCount;
    }
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctxRef.current = ctx;

    wRef.current = window.innerWidth;
    hRef.current = 300;
    lightBarXRef.current = wRef.current / 2;

    canvas.width = wRef.current;
    canvas.height = hRef.current;
    canvas.style.width = wRef.current + "px";
    canvas.style.height = hRef.current + "px";
    ctx.clearRect(0, 0, wRef.current, hRef.current);

    const gradientCanvas = document.createElement("canvas");
    gradientCanvas.width = 16;
    gradientCanvas.height = 16;
    const gradientCtx = gradientCanvas.getContext("2d");
    const half = gradientCanvas.width / 2;
    const gradient = gradientCtx.createRadialGradient(half, half, 0, half, half, half);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.3, "rgba(196, 181, 253, 0.8)");
    gradient.addColorStop(0.7, "rgba(139, 92, 246, 0.4)");
    gradient.addColorStop(1, "transparent");
    gradientCtx.fillStyle = gradient;
    gradientCtx.beginPath();
    gradientCtx.arc(half, half, half, 0, Math.PI * 2);
    gradientCtx.fill();
    gradientCanvasRef.current = gradientCanvas;

    for (let i = 0; i < maxParticlesRef.current; i++) {
      const particle = createParticle();
      particle.originalAlpha = particle.alpha;
      particle.startX = particle.x;
      countRef.current++;
      particlesRef.current[countRef.current] = particle;
    }

    const animate = () => {
      render();
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      wRef.current = window.innerWidth;
      lightBarXRef.current = wRef.current / 2;
      canvas.width = wRef.current;
      canvas.height = hRef.current;
      canvas.style.width = wRef.current + "px";
      canvas.style.height = hRef.current + "px";
      ctx.clearRect(0, 0, wRef.current, hRef.current);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener("resize", handleResize);
      particlesRef.current = [];
      countRef.current = 0;
    };
  }, [canvasRef, scanningActive]);
}
