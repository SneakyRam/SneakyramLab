'use client';

import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ConnectingDotsCanvasProps {
  className?: string;
  dotColor?: string;
  lineColor?: string;
  dotRadius?: number;
  connectionRadius?: number;
  dotCount?: number;
}

const ConnectingDotsCanvas: React.FC<ConnectingDotsCanvasProps> = ({
  className,
  dotColor = 'rgba(34, 211, 238, 0.4)', // Cyan accent from theme
  lineColor = 'rgba(34, 211, 238, 0.2)', // Fainter cyan
  dotRadius = 1.5,
  connectionRadius = 120,
  dotCount = 100,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dots = useRef<any[]>([]);
  const mouse = useRef<{ x: number; y: number; radius: number }>({
    x: Infinity,
    y: Infinity,
    radius: 150,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
      
      // Re-initialize dots
      dots.current = [];
      const densityAdjustedDotCount = Math.floor((canvas.width * canvas.height) / 15000);
      for (let i = 0; i < densityAdjustedDotCount; i++) {
        dots.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: Math.random() * 1 - 0.5,
          vy: Math.random() * 1 - 0.5,
          radius: dotRadius * (Math.random() + 0.5),
        });
      }
    };

    class Dot {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      originalRadius: number;

      constructor(x: number, y: number, vx: number, vy: number, radius: number) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
        this.originalRadius = radius;
      }

      draw() {
        if(!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = dotColor;
        ctx.fill();
      }

      update() {
        // Bounce off walls
        if (this.x > canvas.width || this.x < 0) this.vx = -this.vx;
        if (this.y > canvas.height || this.y < 0) this.vy = -this.vy;

        this.x += this.vx;
        this.y += this.vy;

        // Mouse interaction
        const dx = mouse.current.x - this.x;
        const dy = mouse.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.current.radius) {
            this.radius = Math.min(this.originalRadius * (1 + (mouse.current.radius - distance) / mouse.current.radius * 2), this.originalRadius * 3);
        } else {
            this.radius = this.originalRadius;
        }

        this.draw();
      }
    }

    const init = () => {
      dots.current = [];
      const densityAdjustedDotCount = Math.floor((canvas.width * canvas.height) / 15000);
      for (let i = 0; i < densityAdjustedDotCount; i++) {
        dots.current.push(new Dot(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          Math.random() * 0.4 - 0.2, // Slower speeds
          Math.random() * 0.4 - 0.2,
          dotRadius * (Math.random() * 0.5 + 0.5) // Vary radius slightly
        ));
      }
    };

    const connect = () => {
        if(!ctx) return;
        for (let i = 0; i < dots.current.length; i++) {
            for (let j = i; j < dots.current.length; j++) {
                const dx = dots.current[i].x - dots.current[j].x;
                const dy = dots.current[i].y - dots.current[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionRadius) {
                    ctx.beginPath();
                    ctx.moveTo(dots.current[i].x, dots.current[i].y);
                    ctx.lineTo(dots.current[j].x, dots.current[j].y);
                    ctx.strokeStyle = lineColor;
                    ctx.lineWidth = 1 - distance / connectionRadius;
                    ctx.stroke();
                }
            }
        }
    };

    const animate = () => {
      if(!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.current.forEach(dot => dot.update());
      connect();
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (event: MouseEvent) => {
        mouse.current.x = event.clientX;
        mouse.current.y = event.clientY;
    };

    const handleMouseLeave = () => {
        mouse.current.x = Infinity;
        mouse.current.y = Infinity;
    };
    
    // Initial setup
    resizeCanvas();
    init();
    animate();

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [dotColor, lineColor, dotRadius, connectionRadius, dotCount]); // Rerun effect if props change

  return (
    <canvas
      ref={canvasRef}
      className={cn('absolute top-0 left-0 w-full h-full -z-10', className)}
    />
  );
};

export default ConnectingDotsCanvas;
