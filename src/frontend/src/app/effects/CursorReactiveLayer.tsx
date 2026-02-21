import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

export function CursorReactiveLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPointerDevice, setIsPointerDevice] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // Detect if device has coarse pointer (touch)
    const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    setIsPointerDevice(!hasCoarsePointer);
  }, []);

  // Component is kept in codebase but fully disabled - no visible output
  // Don't render on touch devices or when reduced motion is preferred
  if (!isPointerDevice || prefersReducedMotion) return null;

  // Render invisible canvas (no animation loop, no drawing)
  return (
    <canvas
      ref={canvasRef}
      className="cursor-glow-canvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -1,
        opacity: 0,
        visibility: 'hidden',
      }}
    />
  );
}
