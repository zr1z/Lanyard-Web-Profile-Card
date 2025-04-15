import { useRef, useCallback } from 'react';

interface TiltOptions {
  max?: number;
  scale?: number;
  speed?: number;
}

export const useTiltEffect = ({ max = 15, scale = 1.1, speed = 300 }: TiltOptions = {}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  const setTransform = useCallback(
    (x: number, y: number, isReset = false) => {
      if (!elementRef.current) return;

      const transform = isReset
        ? `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`
        : `perspective(1000px) rotateX(${y * -max}deg) rotateY(${x * max}deg) scale(${scale})`;

      elementRef.current.style.transform = transform;
      elementRef.current.style.transition = isReset
        ? `transform ${speed}ms ease-out`
        : `transform 0s`;
    },
    [max, scale, speed]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!elementRef.current) return;

      const { left, top, width, height } = elementRef.current.getBoundingClientRect();
      const x = ((e.clientX - left) / width - 0.5) * 2;
      const y = ((e.clientY - top) / height - 0.5) * 2;

      setTransform(x, y);
    },
    [setTransform]
  );

  const handleMouseLeave = useCallback(() => {
    setTransform(0, 0, true);
  }, [setTransform]);

  return {
    elementRef,
    handleMouseMove,
    handleMouseLeave,
  };
};