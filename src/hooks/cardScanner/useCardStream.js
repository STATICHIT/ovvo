import { useRef, useEffect, useState, useCallback } from 'react';
import { generateCode, calculateCodeDimensions } from '../../utils/cardScanner/cardUtils';
import card01 from '../../assets/crads/01.png';
import card02 from '../../assets/crads/02.png';
import card03 from '../../assets/crads/03.png';
import card04 from '../../assets/crads/04.png';
import card05 from '../../assets/crads/05.png';

const cardImages = [
  card01,
  card02,
  card03,
  card04,
  card05,
];

export function useCardStream(onScanningChange) {
  const cardLineRef = useRef(null);
  const containerRef = useRef(null);
  const [speed, setSpeed] = useState(120);
  const [isAnimating, setIsAnimating] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const positionRef = useRef(0);
  const velocityRef = useRef(120);
  const directionRef = useRef(-1);
  const isDraggingRef = useRef(false);
  const lastTimeRef = useRef(0);
  const lastMouseXRef = useRef(0);
  const mouseVelocityRef = useRef(0);
  const frictionRef = useRef(0.95);
  const minVelocityRef = useRef(30);
  const containerWidthRef = useRef(0);
  const cardLineWidthRef = useRef(0);
  const animationFrameRef = useRef(null);
  const isAnimatingRef = useRef(true);
  const isPausedRef = useRef(false);

  const createCardWrapper = useCallback((index) => {
    const wrapper = document.createElement("div");
    wrapper.className = "card-wrapper";

    const normalCard = document.createElement("div");
    normalCard.className = "card card-normal";

    const cardImage = document.createElement("img");
    cardImage.className = "card-image";
    cardImage.src = cardImages[index % cardImages.length];
    cardImage.alt = "Credit Card";

    cardImage.onerror = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 250;
      const ctx = canvas.getContext("2d");
      const gradient = ctx.createLinearGradient(0, 0, 400, 250);
      gradient.addColorStop(0, "#667eea");
      gradient.addColorStop(1, "#764ba2");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 400, 250);
      cardImage.src = canvas.toDataURL();
    };

    normalCard.appendChild(cardImage);

    const asciiCard = document.createElement("div");
    asciiCard.className = "card card-ascii";

    const asciiContent = document.createElement("div");
    asciiContent.className = "ascii-content";
    const { width, height, fontSize, lineHeight } = calculateCodeDimensions(400, 250);
    asciiContent.style.fontSize = fontSize + "px";
    asciiContent.style.lineHeight = lineHeight + "px";
    asciiContent.textContent = generateCode(width, height);

    asciiCard.appendChild(asciiContent);
    wrapper.appendChild(normalCard);
    wrapper.appendChild(asciiCard);

    return wrapper;
  }, []);

  const calculateDimensions = useCallback(() => {
    if (!containerRef.current || !cardLineRef.current) return;
    containerWidthRef.current = containerRef.current.offsetWidth;
    const cardWidth = 400;
    const cardGap = 60;
    const cardCount = cardLineRef.current.children.length;
    cardLineWidthRef.current = (cardWidth + cardGap) * cardCount;
  }, []);

  const populateCardLine = useCallback(() => {
    if (!cardLineRef.current) return;
    cardLineRef.current.innerHTML = "";
    const cardsCount = 30;
    for (let i = 0; i < cardsCount; i++) {
      const cardWrapper = createCardWrapper(i);
      cardLineRef.current.appendChild(cardWrapper);
    }
    calculateDimensions();
  }, [createCardWrapper, calculateDimensions]);

  const updateCardClipping = useCallback(() => {
    const scannerX = window.innerWidth / 2;
    const scannerWidth = 8;
    const scannerLeft = scannerX - scannerWidth / 2;
    const scannerRight = scannerX + scannerWidth / 2;
    let anyScanningActive = false;

    if (!cardLineRef.current) return;

    document.querySelectorAll(".card-wrapper").forEach((wrapper) => {
      const rect = wrapper.getBoundingClientRect();
      const cardLeft = rect.left;
      const cardRight = rect.right;
      const cardWidth = rect.width;

      const normalCard = wrapper.querySelector(".card-normal");
      const asciiCard = wrapper.querySelector(".card-ascii");

      if (cardLeft < scannerRight && cardRight > scannerLeft) {
        anyScanningActive = true;
        const scannerIntersectLeft = Math.max(scannerLeft - cardLeft, 0);
        const scannerIntersectRight = Math.min(scannerRight - cardLeft, cardWidth);

        const normalClipRight = (scannerIntersectLeft / cardWidth) * 100;
        const asciiClipLeft = (scannerIntersectRight / cardWidth) * 100;

        normalCard.style.setProperty("--clip-right", `${normalClipRight}%`);
        asciiCard.style.setProperty("--clip-left", `${asciiClipLeft}%`);

        if (!wrapper.hasAttribute("data-scanned") && scannerIntersectLeft > 0) {
          wrapper.setAttribute("data-scanned", "true");
          const scanEffect = document.createElement("div");
          scanEffect.className = "scan-effect";
          wrapper.appendChild(scanEffect);
          setTimeout(() => {
            if (scanEffect.parentNode) {
              scanEffect.parentNode.removeChild(scanEffect);
            }
          }, 600);
        }
      } else {
        if (cardRight < scannerLeft) {
          normalCard.style.setProperty("--clip-right", "100%");
          asciiCard.style.setProperty("--clip-left", "100%");
        } else if (cardLeft > scannerRight) {
          normalCard.style.setProperty("--clip-right", "0%");
          asciiCard.style.setProperty("--clip-left", "0%");
        }
        wrapper.removeAttribute("data-scanned");
      }
    });

    if (onScanningChange) {
      onScanningChange(anyScanningActive);
    }
  }, [onScanningChange]);

  const updateCardPosition = useCallback(() => {
    const containerWidth = containerWidthRef.current;
    const cardLineWidth = cardLineWidthRef.current;

    if (positionRef.current < -cardLineWidth) {
      positionRef.current = containerWidth;
    } else if (positionRef.current > containerWidth) {
      positionRef.current = -cardLineWidth;
    }

    if (cardLineRef.current) {
      cardLineRef.current.style.transform = `translateX(${positionRef.current}px)`;
    }
    updateCardClipping();
  }, [updateCardClipping]);

  const animate = useCallback(() => {
    const currentTime = performance.now();
    const deltaTime = (currentTime - lastTimeRef.current) / 1000;
    lastTimeRef.current = currentTime;

    if (isAnimatingRef.current && !isDraggingRef.current && !isPausedRef.current) {
      if (velocityRef.current > minVelocityRef.current) {
        velocityRef.current *= frictionRef.current;
      } else {
        velocityRef.current = Math.max(minVelocityRef.current, velocityRef.current);
      }

      positionRef.current += velocityRef.current * directionRef.current * deltaTime;
      updateCardPosition();
      setSpeed(Math.round(velocityRef.current));
    }

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [updateCardPosition]);

  const startDrag = useCallback((e) => {
    e.preventDefault();
    isDraggingRef.current = true;
    isAnimatingRef.current = false;
    setIsAnimating(false);
    lastMouseXRef.current = e.clientX;
    mouseVelocityRef.current = 0;

    if (cardLineRef.current) {
      const transform = window.getComputedStyle(cardLineRef.current).transform;
      if (transform !== "none") {
        const matrix = new DOMMatrix(transform);
        positionRef.current = matrix.m41;
      }
      cardLineRef.current.style.animation = "none";
      cardLineRef.current.classList.add("dragging");
    }

    document.body.style.userSelect = "none";
    document.body.style.cursor = "grabbing";
  }, []);

  const onDrag = useCallback((e) => {
    if (!isDraggingRef.current) return;
    e.preventDefault();

    const deltaX = e.clientX - lastMouseXRef.current;
    positionRef.current += deltaX;
    mouseVelocityRef.current = deltaX * 60;
    lastMouseXRef.current = e.clientX;

    if (cardLineRef.current) {
      cardLineRef.current.style.transform = `translateX(${positionRef.current}px)`;
    }
    updateCardClipping();
  }, [updateCardClipping]);

  const endDrag = useCallback(() => {
    if (!isDraggingRef.current) return;

    isDraggingRef.current = false;
    if (cardLineRef.current) {
      cardLineRef.current.classList.remove("dragging");
    }

    if (Math.abs(mouseVelocityRef.current) > minVelocityRef.current) {
      velocityRef.current = Math.abs(mouseVelocityRef.current);
      directionRef.current = mouseVelocityRef.current > 0 ? 1 : -1;
    } else {
      velocityRef.current = 120;
    }

    isAnimatingRef.current = true;
    setIsAnimating(true);
    setSpeed(Math.round(velocityRef.current));

    document.body.style.userSelect = "";
    document.body.style.cursor = "";
  }, []);

  const onWheel = useCallback((e) => {
    e.preventDefault();
    const scrollSpeed = 20;
    const delta = e.deltaY > 0 ? scrollSpeed : -scrollSpeed;
    positionRef.current += delta;
    updateCardPosition();
    updateCardClipping();
  }, [updateCardPosition, updateCardClipping]);

  const toggleAnimation = useCallback(() => {
    isPausedRef.current = !isPausedRef.current;
    setIsPaused(isPausedRef.current);
  }, []);

  const resetPosition = useCallback(() => {
    positionRef.current = containerWidthRef.current;
    velocityRef.current = 120;
    directionRef.current = -1;
    isAnimatingRef.current = true;
    setIsAnimating(true);
    isDraggingRef.current = false;
    isPausedRef.current = false;
    setIsPaused(false);

    if (cardLineRef.current) {
      cardLineRef.current.style.animation = "none";
      cardLineRef.current.style.transform = `translateX(${positionRef.current}px)`;
      cardLineRef.current.classList.remove("dragging");
    }

    setSpeed(120);
  }, []);

  const changeDirection = useCallback(() => {
    directionRef.current *= -1;
  }, []);

  useEffect(() => {
    populateCardLine();
    calculateDimensions();
    lastTimeRef.current = performance.now();

    const cardLine = cardLineRef.current;
    if (!cardLine) return;

    cardLine.addEventListener("mousedown", startDrag);
    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", endDrag);

    cardLine.addEventListener("touchstart", (e) => startDrag(e.touches[0]), { passive: false });
    document.addEventListener("touchmove", (e) => onDrag(e.touches[0]), { passive: false });
    document.addEventListener("touchend", endDrag);

    cardLine.addEventListener("wheel", onWheel);
    cardLine.addEventListener("selectstart", (e) => e.preventDefault());
    cardLine.addEventListener("dragstart", (e) => e.preventDefault());

    const handleResize = () => {
      calculateDimensions();
      updateCardClipping();
    };
    window.addEventListener("resize", handleResize);

    animate();

    const updateClipping = () => {
      updateCardClipping();
      requestAnimationFrame(updateClipping);
    };
    updateClipping();

    const updateAsciiInterval = setInterval(() => {
      document.querySelectorAll(".ascii-content").forEach((content) => {
        if (Math.random() < 0.15) {
          const { width, height } = calculateCodeDimensions(400, 250);
          content.textContent = generateCode(width, height);
        }
      });
    }, 200);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      cardLine.removeEventListener("mousedown", startDrag);
      document.removeEventListener("mousemove", onDrag);
      document.removeEventListener("mouseup", endDrag);
      window.removeEventListener("resize", handleResize);
      clearInterval(updateAsciiInterval);
    };
  }, [populateCardLine, calculateDimensions, startDrag, onDrag, endDrag, onWheel, animate, updateCardClipping]);

  return {
    cardLineRef,
    containerRef,
    speed,
    isPaused,
    toggleAnimation,
    resetPosition,
    changeDirection,
  };
}
