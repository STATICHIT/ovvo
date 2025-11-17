import { useRef, useEffect } from 'react';

export function useCodeRain(canvasRef, config) {
  const columnsRef = useRef([]);
  const animationFrameRef = useRef(null);
  const rippleRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // 字符集
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?/~`';
    const katakana = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const allChars = characters + katakana + latin + nums;

    // 列数据结构
    class Column {
      constructor(x) {
        this.x = x;
        this.y = Math.random() * -canvas.height;
        this.speed = (Math.random() * 0.5 + 0.5) * config.speed;
        this.chars = [];
        this.length = Math.floor(Math.random() * 20) + 10;
        
        // 生成字符序列
        for (let i = 0; i < this.length; i++) {
          this.chars.push({
            char: allChars[Math.floor(Math.random() * allChars.length)],
            brightness: 1 - (i / this.length),
          });
        }
      }

      update() {
        this.y += this.speed * config.speed;
        
        // 重置到顶部
        if (this.y > canvas.height + this.length * config.fontSize) {
          this.y = Math.random() * -100;
          this.speed = (Math.random() * 0.5 + 0.5) * config.speed;
          this.length = Math.floor(Math.random() * 20) + 10;
          
          // 重新生成字符
          this.chars = [];
          for (let i = 0; i < this.length; i++) {
            this.chars.push({
              char: allChars[Math.floor(Math.random() * allChars.length)],
              brightness: 1 - (i / this.length),
            });
          }
        }

        // 随机改变字符
        if (Math.random() < 0.05) {
          const index = Math.floor(Math.random() * this.chars.length);
          this.chars[index].char = allChars[Math.floor(Math.random() * allChars.length)];
        }
      }

      draw() {
        ctx.font = `${config.fontSize}px 'Courier New', monospace`;
        
        this.chars.forEach((charData, i) => {
          const y = this.y + i * config.fontSize;
          
          if (y > 0 && y < canvas.height) {
            let color;
            const brightness = charData.brightness;
            
            // 颜色模式
            switch (config.colorMode) {
              case 'rainbow':
                const hue = (this.y + i * 30) % 360;
                color = `hsla(${hue}, 100%, ${50 * brightness}%, ${brightness})`;
                break;
              case 'purple':
                color = `rgba(139, 92, 246, ${brightness})`;
                break;
              case 'red':
                color = `rgba(255, 50, 50, ${brightness})`;
                break;
              default: // classic
                color = `rgba(0, 255, 0, ${brightness})`;
            }
            
            // 头部字符更亮
            if (i === 0) {
              ctx.fillStyle = config.colorMode === 'classic' ? '#ffffff' : color;
              ctx.shadowBlur = 10;
              ctx.shadowColor = color;
            } else {
              ctx.fillStyle = color;
              ctx.shadowBlur = 0;
            }
            
            ctx.fillText(charData.char, this.x, y);
          }
        });
      }
    }

    // 初始化列
    const initColumns = () => {
      const columnCount = Math.floor(canvas.width / config.fontSize);
      columnsRef.current = [];
      
      for (let i = 0; i < columnCount * config.density; i++) {
        const x = (i / config.density) * config.fontSize;
        columnsRef.current.push(new Column(x));
      }
    };

    // 设置 canvas 尺寸
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initColumns();
    };
    resizeCanvas();


    // 动画循环
    const animate = () => {
      // 半透明填充产生拖尾效果
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 更新和绘制所有列
      columnsRef.current.forEach(column => {
        column.update();
        column.draw();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // 初始化
    initColumns();
    animate();

    // 事件监听
    window.addEventListener('resize', resizeCanvas);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [canvasRef, config]);
}
