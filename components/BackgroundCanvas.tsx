"use client";

import { useEffect, useRef } from "react";

type Props = {
  /** ضریب تراکم ذرات (۱ = پیش‌فرض) */
  density?: number;
  /** سقف ذرات (برای کنترل FPS) */
  maxParticles?: number;
  /** حداکثر فاصله‌ی اتصال خطوط */
  linkDistance?: number;
  /** شعاع فرار از اشاره‌گر */
  repelRadius?: number;
  /** نویز/رانش خودکار برای حرکت دائمی */
  wander?: number;
  /** بیشینه سرعت (px/frame) */
  maxSpeed?: number;
  /** اصطکاک */
  friction?: number;
  /** وقتی کاربر بی‌حرکته، ماوس مجازی بچرخونیم؟ */
  autoPilot?: boolean;
};

export default function BackgroundCanvas({
  density = 1.0,
  maxParticles = 180,
  linkDistance = 140,
  repelRadius = 120,
  wander = 0.008, // ↑ این باعث می‌شه ذرات خودشون بجولبن
  maxSpeed = 1.25,
  friction = 0.985,
  autoPilot = true, // ↑ این وقتی کاربر دست نمی‌زنه، یه ماوس مجازی می‌چرخونه
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const particles = useRef<{ x: number; y: number; vx: number; vy: number }[]>(
    []
  );
  const pointerActiveAt = useRef(0); // آخرین تعامل کاربر
  const tRef = useRef(0); // زمان برای autopilot

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isSmall = window.matchMedia("(max-width: 768px)").matches;

    const fit = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    fit();
    window.addEventListener("resize", fit, { passive: true });

    // --- تعداد ذرات براساس مساحت، ضریب density و سقف ---
    const area = window.innerWidth * window.innerHeight;
    const baseDiv = isSmall ? 22000 : 14000; // کوچیک = سبک‌تر
    const baseCount = Math.floor((area / baseDiv) * density);
    const count = Math.max(40, Math.min(maxParticles, baseCount));

    // اگر می‌خوای بیشترشان کنی: maxParticles و/یا density را ببر بالا 👇
    // مثال: density=1.6, maxParticles=260

    particles.current = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
    }));

    let raf = 0;

    const loop = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      // پس‌زمینه‌ی گرادیانی
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

      // --- autopilot: اگر مدتی تعاملی نبود، ماوس مجازی دور مرکز بچرخون ---
      const now = performance.now();
      const idleMs = 1800;
      if (autoPilot && now - pointerActiveAt.current > idleMs) {
        tRef.current += 0.005; // سرعت چرخش
        const R = Math.min(w, h) * 0.25;
        mouse.current.x = w * 0.5 + Math.cos(tRef.current) * R;
        mouse.current.y = h * 0.4 + Math.sin(tRef.current * 0.9) * R;
      }

      // --- آپدیت ذرات ---
      for (let i = 0; i < particles.current.length; i++) {
        const p = particles.current[i];

        // رانش خودکار (حرکت همیشگی) - مثل براونین / نویز ساده
        p.vx += (Math.random() - 0.5) * wander;
        p.vy += (Math.random() - 0.5) * wander;

        // فرار از اشاره‌گر
        const dx = p.x - mouse.current.x;
        const dy = p.y - mouse.current.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < repelRadius * repelRadius) {
          const d = Math.sqrt(d2) || 0.001;
          const f = (repelRadius - d) / repelRadius;
          p.vx += (dx / d) * f * 0.8;
          p.vy += (dy / d) * f * 0.8;
        }

        // محدودسازی سرعت (که فرار/نویز دیوانه نشود)
        const sp2 = p.vx * p.vx + p.vy * p.vy;
        const maxSp2 = maxSpeed * maxSpeed;
        if (sp2 > maxSp2) {
          const s = maxSpeed / Math.sqrt(sp2);
          p.vx *= s;
          p.vy *= s;
        }

        // حرکت + اصطکاک
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= friction;
        p.vy *= friction;

        // برخورد با مرزها (برگشت)
        if (p.x <= 0 || p.x >= w) p.vx *= -1;
        if (p.y <= 0 || p.y >= h) p.vy *= -1;
      }

      // --- رسم اتصال‌ها ---
      ctx.lineWidth = 0.6;
      const maxD2 = linkDistance * linkDistance;
      for (let i = 0; i < particles.current.length; i++) {
        const p1 = particles.current[i];
        for (let j = i + 1; j < particles.current.length; j++) {
          const p2 = particles.current[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < maxD2) {
            const alpha = 1 - Math.sqrt(d2) / linkDistance;
            ctx.strokeStyle = `rgba(147,197,253,${alpha * 0.25})`; // blue-300
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // --- نودها ---
      ctx.fillStyle = "rgba(209,213,219,0.6)"; // gray-300
      for (let i = 0; i < particles.current.length; i++) {
        const p = particles.current[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!prefersReduced) raf = requestAnimationFrame(loop);
    };

    if (!prefersReduced) raf = requestAnimationFrame(loop);

    // --- Pointer + Touch (window-level) ---
    const onPointer = (e: PointerEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      pointerActiveAt.current = performance.now();
    };
    const onPointerEnd = () => {
      // برنمی‌گردونیم به -9999 چون autoPilot می‌خوایم
      pointerActiveAt.current = performance.now();
    };

    const supportsPointer = "onpointermove" in window;
    if (supportsPointer) {
      window.addEventListener("pointermove", onPointer, { passive: true });
      window.addEventListener("pointerdown", onPointer, { passive: true });
      window.addEventListener("pointerup", onPointerEnd, { passive: true });
      window.addEventListener("pointercancel", onPointerEnd, { passive: true });
    } else {
      const onTouch = (e: TouchEvent) => {
        const t = e.touches[0];
        if (!t) return;
        mouse.current.x = t.clientX;
        mouse.current.y = t.clientY;
        pointerActiveAt.current = performance.now();
      };
      window.addEventListener("touchstart", onTouch, { passive: true });
      window.addEventListener("touchmove", onTouch, { passive: true });
      window.addEventListener("touchend", onPointerEnd, { passive: true });
      window.addEventListener("touchcancel", onPointerEnd, { passive: true });
    }

    return () => {
      window.removeEventListener("resize", fit);
      if (supportsPointer) {
        window.removeEventListener("pointermove", onPointer as any);
        window.removeEventListener("pointerdown", onPointer as any);
        window.removeEventListener("pointerup", onPointerEnd as any);
        window.removeEventListener("pointercancel", onPointerEnd as any);
      } else {
        window.removeEventListener("touchstart", onPointer as any);
        window.removeEventListener("touchmove", onPointer as any);
        window.removeEventListener("touchend", onPointerEnd as any);
        window.removeEventListener("touchcancel", onPointerEnd as any);
      }
      cancelAnimationFrame(raf);
    };
  }, [
    autoPilot,
    density,
    friction,
    linkDistance,
    maxParticles,
    maxSpeed,
    repelRadius,
    wander,
  ]);

  return (
    <canvas
      id="bg-canvas"
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden
    />
  );
}
