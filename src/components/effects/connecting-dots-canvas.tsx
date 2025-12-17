'use client';

import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ConnectingDotsCanvasProps {
  className?: string;
  dotColor?: string;
  lineColor?: string;
  dotRadius?: number;
  connectionRadius?: number;
}

const ConnectingDotsCanvas: React.FC<ConnectingDotsCanvasProps> = ({
  className,
  dotColor = 'rgba(34, 211, 238, 0.3)', // Fainter Cyan
  lineColor = 'rgba(34, 211, 238, 0.15)', // Even Fainter Cyan
  dotRadius = 1.2,
  connectionRadius = 120,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dots = useRef<any[]>([]);
  const mouse = useRef<{ x: number; y: number; radius: number, active: boolean }>({
    x: Infinity,
    y: Infinity,
    radius: 150,
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

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
        if (this.x > canvas.width + 5 || this.x < -5) this.vx = -this.vx;
        if (this.y > canvas.height + 5 || this.y < -5) this.vy = -this.vy;

        this.x += this.vx;
        this.y += this.vy;

        // Mouse interaction
        const dx = mouse.current.x - this.x;
        const dy = mouse.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.current.radius) {
            // Make dots larger near mouse
            this.radius = Math.min(this.originalRadius * (1 + (mouse.current.radius - distance) / mouse.current.radius * 3), this.originalRadius * 4);

            // Push dots away from mouse
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const maxForce = 2;
            const force = (mouse.current.radius - distance) / mouse.current.radius * maxForce;
            this.vx -= forceDirectionX * force * 0.05;
            this.vy -= forceDirectionY * force * 0.05;

        } else if (this.radius > this.originalRadius) {
            // Smoothly return to original size
            this.radius -= 0.1;
        }

        this.draw();
      }
    }

    const init = () => {
      dots.current = [];
      const densityAdjustedDotCount = Math.floor((canvas.width * canvas.height) / 18000);
      for (let i = 0; i < densityAdjustedDotCount; i++) {
        dots.current.push(new Dot(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          Math.random() * 0.4 - 0.2,
          Math.random() * 0.4 - 0.2,
          dotRadius * (Math.random() * 0.5 + 0.5)
        ));
      }
    };

    const connect = () => {
        if(!ctx) return;
        let opacityValue = 1;
        for (let i = 0; i < dots.current.length; i++) {
            for (let j = i; j < dots.current.length; j++) {
                const dx = dots.current[i].x - dots.current[j].x;
                const dy = dots.current[i].y - dots.current[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionRadius) {
                    opacityValue = 1 - (distance / connectionRadius);
                    ctx.strokeStyle = lineColor.replace(/,\s*\d*\.?\d*\)/, `, ${opacityValue})`);
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(dots.current[i].x, dots.current[i].y);
                    ctx.lineTo(dots.current[j].x, dots.current[j].y);
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
        mouse.current.active = true;
    };

    const handleMouseLeave = () => {
        mouse.current.active = false;
        // Let the effect linger for a bit before snapping back
        setTimeout(() => {
            if (!mouse.current.active) {
                mouse.current.x = Infinity;
                mouse.current.y = Infinity;
            }
        }, 300);
    };
    
    const resizeCanvas = () => {
        if(!canvasRef.current || !canvasRef.current.parentElement) return;
        canvasRef.current.width = canvasRef.current.parentElement.clientWidth;
        canvasRef.current.height = canvasRef.current.parentElement.clientHeight;
        init();
    };

    // Initial setup
    resizeCanvas();
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
  }, [dotColor, lineColor, dotRadius, connectionRadius]); // Rerun effect if props change

  return (
    <canvas
      ref={canvasRef}
      className={cn('absolute top-0 left-0 w-full h-full -z-10', className)}
    />
  );
};

export default ConnectingDotsCanvas;
