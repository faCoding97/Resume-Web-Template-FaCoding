"use client";

import Image from "next/image";
import { useState, useMemo, useRef } from "react";

/**
 * Creative profile photo with:
 * - CSS-only twin tracers (start at top, meet at bottom, fade)
 * - Parallax tilt (CSS vars; no re-render spam)
 * - Shine sweep on hover
 * - Halo glow + status dot pulse
 * - Robust image fallback with initials
 */
export default function ProfilePhoto({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const [animKey, setAnimKey] = useState(0);
  const [broken, setBroken] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);

  const R = 49;
  const CIRC = useMemo(() => 2 * Math.PI * R, []);

  const trigger = () => setAnimKey((k) => k + 1);

  // Parallax tilt via CSS variables (no React state thrash)
  const onMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const el = boxRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - (r.left + r.width / 2)) / (r.width / 2); // -1..1
    const py = (e.clientY - (r.top + r.height / 2)) / (r.height / 2); // -1..1
    el.style.setProperty("--rx", `${(-py * 6).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(px * 6).toFixed(2)}deg`);
  };

  const onLeave = () => {
    const el = boxRef.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  // Initials fallback
  const initials = useMemo(() => {
    const parts = (alt || "").trim().split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "FA";
  }, [alt]);

  return (
    <div
      ref={boxRef}
      className="photo-tilt group relative mx-auto w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full overflow-hidden ring-2 ring-gray-500/40 shadow-md"
      onMouseEnter={trigger}
      onTouchStart={trigger}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      role="img"
      aria-label={alt}>
      {/* Halo glow behind */}
      <div className="halo absolute -inset-1 rounded-full pointer-events-none" />

      {/* Photo (with robust fallback) */}
      {!broken ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="(max-width: 768px) 192px, 224px"
          className="object-cover"
          unoptimized
          onError={() => {
            console.warn("[ProfilePhoto] image failed to load:", src);
            setBroken(true);
          }}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
          <span className="text-2xl sm:text-3xl font-bold text-blue-300">
            {initials}
          </span>
        </div>
      )}

      {/* Shine sweep (diagonal) */}
      <div className="photo-shine pointer-events-none absolute inset-0" />

      {/* SVG ring + tracers (start at 12 o'clock) */}
      <svg
        key={animKey}
        className="absolute inset-0 profile-ring"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#93c5fd" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* Base faint ring */}
        <circle
          cx="50"
          cy="50"
          r={R}
          fill="none"
          stroke="rgba(148,163,184,0.25)"
          strokeWidth="1.2"
          transform="rotate(-90 50 50)"
        />

        {/* Clockwise tracer */}
        <circle
          cx="50"
          cy="50"
          r={R}
          fill="none"
          stroke="url(#glow)"
          strokeWidth="2.2"
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          className="trace"
          style={{ strokeDasharray: CIRC, strokeDashoffset: CIRC }}
        />

        {/* Counter-clockwise tracer */}
        <circle
          cx="50"
          cy="50"
          r={R}
          fill="none"
          stroke="url(#glow)"
          strokeWidth="2.2"
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          className="trace"
          style={{ strokeDasharray: CIRC, strokeDashoffset: -CIRC }}
        />
      </svg>

      {/* Status dot (bottom-right) */}
      <span className="status-dot absolute bottom-1.5 right-1.5 h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_0_2px_rgba(31,41,55,1)]" />

      {/* Badge on hover */}
      <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 -bottom-3 group-hover:bottom-2 transition-all duration-300">
        <span className="rounded-full bg-gray-900/70 border border-gray-700/50 px-3 py-1 text-[10px] sm:text-xs text-gray-200">
          Developer
        </span>
      </div>
    </div>
  );
}
