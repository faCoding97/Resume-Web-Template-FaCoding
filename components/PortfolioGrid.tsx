"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import TypingText from "./TypingText";
import { motion } from "framer-motion";

export type PortfolioItem = {
  url: string;
  description: string;
};

/** hostname without protocol */
const hostnameOf = (url: string) => {
  try {
    const u = new URL(url);
    return u.hostname;
  } catch {
    return url.replace(/^https?:\/\//, "").replace(/\/+$/, "");
  }
};

function rttToLabel(rtt?: number): { label: string; color: string } {
  if (rtt == null) return { label: "Checking…", color: "text-gray-400" };
  if (rtt < 300)
    return { label: `${Math.round(rtt)}ms · Fast`, color: "text-emerald-400" };
  if (rtt < 1200)
    return { label: `${Math.round(rtt)}ms · OK`, color: "text-yellow-300" };
  return { label: `${Math.round(rtt)}ms · Slow`, color: "text-red-400" };
}

function SiteCard({
  item,
  idx,
  active,
  setActive,
}: {
  item: PortfolioItem;
  idx: number;
  active: number | null;
  setActive: (i: number | null) => void;
}) {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const [rtt, setRtt] = useState<number | undefined>(undefined);
  const [touching, setTouching] = useState(false);
  const pressTimer = useRef<number | null>(null);

  const [faviconSrc, setFaviconSrc] = useState<string>(() => {
    const host = hostnameOf(item.url);
    return `https://${host}/favicon.ico`;
  });

  // --- Tilt via CSS vars (pointer-friendly)
  const setTilt = (clientX: number, clientY: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (clientX - (r.left + r.width / 2)) / (r.width / 2);
    const py = (clientY - (r.top + r.height / 2)) / (r.height / 2);
    el.style.setProperty("--rx", `${(-py * 5).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(px * 8).toFixed(2)}deg`);
  };

  const clearPress = () => {
    if (pressTimer.current !== null) {
      window.clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  const onPointerEnter: React.PointerEventHandler<HTMLAnchorElement> = (e) => {
    // Desktop hover
    if (e.pointerType === "mouse") {
      setActive(idx);
      setTilt(e.clientX, e.clientY);
    }
  };

  const onPointerMove: React.PointerEventHandler<HTMLAnchorElement> = (e) => {
    setTilt(e.clientX, e.clientY);
  };

  const onPointerLeave: React.PointerEventHandler<HTMLAnchorElement> = () => {
    const el = ref.current;
    if (el) {
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    }
    setTouching(false);
    clearPress();
    setActive(null);
  };

  const onPointerDown: React.PointerEventHandler<HTMLAnchorElement> = (e) => {
    // Mobile/pen: long-press to activate typing (120ms)
    if (e.pointerType !== "mouse") {
      setTouching(true);
      pressTimer.current = window.setTimeout(() => {
        setActive(idx);
      }, 120);
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    } else {
      // Mouse click: behave like hover instantly
      setActive(idx);
    }
    setTilt(e.clientX, e.clientY);
  };

  const onPointerUp: React.PointerEventHandler<HTMLAnchorElement> = (e) => {
    clearPress();
    setTouching(false);
    const el = ref.current;
    if (el) {
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    }
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  // --- Live RTT (client-only)
  useEffect(() => {
    let done = false;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    (async () => {
      const t0 = performance.now();
      try {
        await fetch(item.url, {
          method: "HEAD",
          mode: "no-cors",
          signal: controller.signal,
          cache: "no-store",
        });
        if (!done) setRtt(performance.now() - t0);
      } catch {
        if (!done) setRtt(2000);
      } finally {
        clearTimeout(timeout);
      }
    })();

    return () => {
      done = true;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [item.url]);

  // Favicon fallback → Google S2
  const onFavError: React.ReactEventHandler<HTMLImageElement> = () => {
    const host = hostnameOf(item.url);
    setFaviconSrc(`https://www.google.com/s2/favicons?domain=${host}&sz=64`);
  };

  const host = useMemo(() => hostnameOf(item.url), [item.url]);
  const rttInfo = rttToLabel(rtt);
  const hovered = active === idx || touching; // ← موبایل هم فعال می‌شود

  return (
    <motion.a
      href={item.url}
      target="_blank"
      rel="noreferrer"
      ref={ref}
      className={`group relative z-0 card card-tilt card-aurora bg-gray-700/40 border border-gray-600/50 rounded-2xl p-4 hover:bg-gray-700/60 focus:outline-none focus:ring-2 focus:ring-blue-400/40 overflow-hidden ${
        touching ? "touching" : ""
      }`}
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      style={{ touchAction: "pan-y" }} // اجازه‌ی اسکرول عمودی
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}>
      {/* Top Row */}
      <div className="flex items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-2 min-w-0">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-gray-900/70 border border-gray-700/50">
            <img
              src={faviconSrc}
              onError={onFavError}
              alt={`${host} favicon`}
              className="h-4 w-4 rounded-sm"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </span>
          <div className="font-semibold text-blue-300 group-hover:text-blue-200 truncate">
            {host}
          </div>
        </div>

        <span className="visit-btn text-xs text-gray-300 group-hover:text-white inline-flex items-center gap-1">
          <span>Visit</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            className="translate-x-0 group-hover:translate-x-0.5 transition-transform">
            <path fill="currentColor" d="M13 5l7 7-7 7v-4H4v-6h9V5z" />
          </svg>
        </span>
      </div>

      {/* Typing description */}
      <div className="mt-2 min-h-24 relative z-10">
        <TypingText text={item.description} active={hovered} />
      </div>

      {/* Bottom row */}
      <div className="mt-3 flex items-center justify-between gap-3 relative z-10">
        <div className={`text-[11px] ${rttInfo.color} font-medium`}>
          {rttInfo.label}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="chip">Next.js</span>
          <span className="chip">Tailwind</span>
          <span className="chip hidden sm:inline">TypeScript</span>
        </div>
      </div>

      {/* Glow pulse (behind content; no event blocking) */}
      <div className="pointer-events-none absolute -inset-12 -z-10 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-[radial-gradient(40%_40%_at_50%_0%,rgba(147,197,253,0.6),transparent_60%)]" />
    </motion.a>
  );
}

export default function PortfolioGrid({ items }: { items: PortfolioItem[] }) {
  const [active, setActive] = useState<number | null>(null);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item, idx) => (
        <SiteCard
          key={item.url}
          item={item}
          idx={idx}
          active={active}
          setActive={setActive}
        />
      ))}
    </div>
  );
}
