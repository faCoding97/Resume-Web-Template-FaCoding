"use client";

import { useEffect, useRef } from "react";

/**
 * Neural background with nodes & links.
 * - Nodes repel from mouse
 * - DPI-aware for crisp lines
 * - Window-level mouse listeners (works even when canvas is behind)
 */
export default function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const particles = useRef<{ x: number; y: number; vx: number; vy: number }[]>(
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const fit = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // scale drawing space
    };

    fit();
    window.addEventListener("resize", fit);

    const count = Math.min(
      140,
      Math.floor((window.innerWidth * window.innerHeight) / 15000)
    );
    particles.current = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
    }));

    let raf = 0;
    const maxDist = 140;
    const repelRadius = 120;

    const loop = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      // bg gradient
      const g = ctx.createRadialGradient(
        w * 0.5,
        h * 0.4,
        0,
        w * 0.5,
        h * 0.4,
        Math.max(w, h)
      );
      g.addColorStop(0, "rgba(31,41,55,0.6)"); // gray-800
      g.addColorStop(1, "rgba(17,24,39,0.8)"); // gray-900
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // update
      for (let i = 0; i < particles.current.length; i++) {
        const p = particles.current[i];

        // repel
        const dx = p.x - mouse.current.x;
        const dy = p.y - mouse.current.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < repelRadius * repelRadius) {
          const d = Math.sqrt(d2) || 0.001;
          const f = (repelRadius - d) / repelRadius;
          p.vx += (dx / d) * f * 0.8;
          p.vy += (dy / d) * f * 0.8;
        }

        // move + friction
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.985;
        p.vy *= 0.985;

        // bounds
        if (p.x <= 0 || p.x >= w) p.vx *= -1;
        if (p.y <= 0 || p.y >= h) p.vy *= -1;
      }

      // links
      ctx.lineWidth = 0.6;
      for (let i = 0; i < particles.current.length; i++) {
        const p1 = particles.current[i];
        for (let j = i + 1; j < particles.current.length; j++) {
          const p2 = particles.current[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < maxDist * maxDist) {
            const alpha = 1 - Math.sqrt(dist2) / maxDist;
            ctx.strokeStyle = `rgba(147,197,253,${alpha * 0.25})`; // blue-300
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // nodes
      for (let i = 0; i < particles.current.length; i++) {
        const p = particles.current[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(209,213,219,0.6)"; // gray-300
        ctx.fill();
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);

    // window-level mouse listeners (so it works even if canvas is under content)
    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };
    const onLeave = () => {
      mouse.current.x = -9999;
      mouse.current.y = -9999;
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("resize", fit);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      id="bg-canvas"
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden
    />
  );
}
