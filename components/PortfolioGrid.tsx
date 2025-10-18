"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import TypingText from "./TypingText";
import { motion } from "framer-motion";

export type PortfolioItem = {
  url: string;
  description: string;
};

/** Tiny util: hostname without protocol */
const hostnameOf = (url: string) => {
  try {
    const u = new URL(url);
    return u.hostname;
  } catch {
    return url.replace(/^https?:\/\//, "").replace(/\/+$/, "");
  }
};

/** Status coloring based on RTT */
function rttToLabel(rtt?: number): { label: string; color: string } {
  if (rtt == null) return { label: "Checking…", color: "text-gray-400" };
  if (rtt < 300)
    return { label: `${Math.round(rtt)}ms · Fast`, color: "text-emerald-400" };
  if (rtt < 1200)
    return { label: `${Math.round(rtt)}ms · OK`, color: "text-yellow-300" };
  return { label: `${Math.round(rtt)}ms · Slow`, color: "text-red-400" };
}

/**
 * SiteCard: 3D tilt, aurora border, favicon + fallback, live RTT ping (client-only),
 * hover typing, and animated Visit button.
 */
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
  const ref = useRef<HTMLDivElement | null>(null);
  const [rtt, setRtt] = useState<number | undefined>(undefined);
  const [faviconSrc, setFaviconSrc] = useState<string>(() => {
    const host = hostnameOf(item.url);
    // اول از خود سایت /favicon.ico، اگر نشد میریم سراغ سرویس گوگل
    return `https://${host}/favicon.ico`;
  });

  // Parallax tilt: بدون state، فقط CSS vars
  const onMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - (r.left + r.width / 2)) / (r.width / 2); // -1..1
    const py = (e.clientY - (r.top + r.height / 2)) / (r.height / 2); // -1..1
    el.style.setProperty("--rx", `${(-py * 5).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(px * 8).toFixed(2)}deg`);
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    setActive(null);
  };

  // Live RTT (client-only; initial SSR = undefined => no mismatch)
  useEffect(() => {
    let done = false;
    const host = hostnameOf(item.url);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    (async () => {
      const t0 = performance.now();
      try {
        // cross-origin HEAD می‌تونه opaque باشه؛ همون resolve شدن برامون کافیه
        await fetch(item.url, {
          method: "HEAD",
          mode: "no-cors",
          signal: controller.signal,
          cache: "no-store",
        });
        if (!done) setRtt(performance.now() - t0);
      } catch {
        if (!done) setRtt(2000); // اگر timeout/abort شد، کند حسابش کن
      } finally {
        clearTimeout(timeout);
      }
    })();

    return () => {
      done = true;
      clearTimeout(timeout);
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.url]);

  // Favicon fallback → Google S2
  const onFavError: React.ReactEventHandler<HTMLImageElement> = () => {
    const host = hostnameOf(item.url);
    setFaviconSrc(`https://www.google.com/s2/favicons?domain=${host}&sz=64`);
  };

  const host = useMemo(() => hostnameOf(item.url), [item.url]);
  const rttInfo = rttToLabel(rtt);
  const hovered = active === idx;

  return (
    <motion.a
      href={item.url}
      target="_blank"
      rel="noreferrer"
      className="group relative card card-tilt card-aurora bg-gray-700/40 border border-gray-600/50 rounded-2xl p-4 hover:bg-gray-700/60 focus:outline-none focus:ring-2 focus:ring-blue-400/40 overflow-hidden"
      onMouseEnter={() => setActive(idx)}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      ref={ref}
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}>
      {/* Top Row: favicon + host + Visit */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <img
            src={faviconSrc}
            onError={onFavError}
            alt={`${host} favicon`}
            className="h-5 w-5 rounded-sm opacity-90"
            loading="lazy"
          />
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
      <div className="mt-2 min-h-24">
        <TypingText text={item.description} active={hovered} />
      </div>

      {/* Bottom row: status + tags */}
      <div className="mt-3 flex items-center justify-between gap-3">
        <div className={`text-[11px] ${rttInfo.color} font-medium`}>
          {rttInfo.label}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="chip">Next.js</span>
          <span className="chip">Tailwind</span>
          <span className="chip hidden sm:inline">TypeScript</span>
        </div>
      </div>

      {/* Glow pulse on hover */}
      <div className="absolute -inset-12 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-[radial-gradient(40%_40%_at_50%_0%,rgba(147,197,253,0.6),transparent_60%)]" />
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
