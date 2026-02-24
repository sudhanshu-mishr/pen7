'use client';

import { useEffect, useRef } from 'react';
import { useThemeStore } from '@/store';

// Utility to generate random organic shapes
function drawPaintShape(ctx: CanvasRenderingContext2D, { x, y, size, color, rotation, alpha, blend }: { 
  x: number; 
  y: number; 
  size: number; 
  color: string; 
  rotation: number; 
  alpha: number; 
  blend: GlobalCompositeOperation 
}) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.globalCompositeOperation = blend;
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.beginPath();
  // Draw a blobby, paint-like shape
  for (let i = 0; i < 2 * Math.PI; i += Math.PI / 5) {
    const r = size * (0.8 + 0.2 * Math.sin(i * 3 + Math.random()));
    ctx.lineTo(Math.cos(i) * r, Math.sin(i) * r);
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = size * 0.2;
  ctx.fill();
  ctx.restore();
}

// Updated more visible light mode colors while keeping them soft and matte
const lightPalette = [
  '#FFE5D9', // Soft peach
  '#E8F5E9', // Mint green
  '#E3F2FD', // Light blue
  '#FFF3E0', // Warm beige
  '#F3E5F5', // Lavender
  '#E8EAF6', // Pale blue
  '#F1F8E9', // Sage green
  '#FFEBEE', // Soft pink
  '#E0F7FA', // Light cyan
  '#F5F5F5', // Off-white
];

const darkPalette = [
  '#1A1A2E', // Deep navy
  '#16213E', // Dark blue
  '#0F3460', // Rich blue
  '#533483', // Deep purple
  '#E94560', // Soft red
  '#1F1D36', // Dark purple
  '#3F3351', // Muted purple
];

// Updated blend modes for better visibility in light mode
const blendModes: GlobalCompositeOperation[] = [
  'overlay',
  'soft-light',
  'color-dodge',
  'screen',
  'lighter',
];

const ArtisticBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useThemeStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      draw();
    };

    // Draw paint-like shapes
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const palette = theme === 'dark' ? darkPalette : lightPalette;

      // Draw more shapes for better coverage
      for (let i = 0; i < 15; i++) {
        drawPaintShape(ctx, {
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: 250 + Math.random() * 250,
          color: palette[Math.floor(Math.random() * palette.length)],
          rotation: Math.random() * Math.PI * 2,
          alpha:
            theme === 'dark'
              ? 0.15 + Math.random() * 0.15
              : 0.15 + Math.random() * 0.1,
          blend: blendModes[Math.floor(Math.random() * blendModes.length)],
        });
      }

      // Generate a noise pattern programmatically if /noise.png is missing
      const noiseCanvas = document.createElement('canvas');
      noiseCanvas.width = 100;
      noiseCanvas.height = 100;
      const noiseCtx = noiseCanvas.getContext('2d');
      if (noiseCtx) {
        const idata = noiseCtx.createImageData(100, 100);
        const buffer32 = new Uint32Array(idata.data.buffer);
        for (let i = 0; i < buffer32.length; i++) {
          if (Math.random() < 0.5) buffer32[i] = 0xff000000;
        }
        noiseCtx.putImageData(idata, 0, 0);
        
        const pattern = ctx.createPattern(noiseCanvas, 'repeat');
        if (pattern) {
          ctx.save();
          ctx.globalAlpha = theme === 'dark' ? 0.05 : 0.1;
          ctx.globalCompositeOperation = 'overlay';
          ctx.fillStyle = pattern;
          ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
          ctx.restore();
        }
      }
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 w-full h-full -z-10 select-none"
      style={{
        display: 'block',
        mixBlendMode: theme === 'dark' ? 'overlay' : 'multiply',
      }}
      aria-hidden="true"
    />
  );
};

export default ArtisticBackground;
