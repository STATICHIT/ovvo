import { useEffect, useState, useCallback } from 'react';

export function useTypewriter(elementRef, text, isActive) {
  const [isTyping, setIsTyping] = useState(false);
  const [shouldRestart, setShouldRestart] = useState(0);

  const restart = useCallback(() => {
    setShouldRestart(prev => prev + 1);
  }, []);

  useEffect(() => {
    if (!elementRef.current || !isActive) return;

    const element = elementRef.current;
    let currentIndex = 0;
    let timeoutId;

    setIsTyping(true);
    element.textContent = '';

    const type = () => {
      if (currentIndex < text.length) {
        element.textContent += text[currentIndex];
        currentIndex++;
        
        // 随机打字速度（50-150ms）
        const delay = Math.random() * 100 + 50;
        timeoutId = setTimeout(type, delay);
      } else {
        setIsTyping(false);
      }
    };

    // 延迟开始
    timeoutId = setTimeout(type, 500);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [elementRef, text, isActive, shouldRestart]);

  return { isTyping, restart };
}
