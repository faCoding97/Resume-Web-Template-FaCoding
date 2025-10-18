"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";

export default function AboutSection({
  headline,
  summary,
}: {
  headline: string;
  summary: string;
}) {
  const [expanded, setExpanded] = useState(false);

  // Split on blank lines for paragraphs
  const paragraphs = useMemo(
    () => summary.split(/\n\s*\n/).map((p) => p.trim()),
    [summary]
  );

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl border border-gray-600/50 bg-gray-700/30 p-5 sm:p-6"
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}>
      {/* Accent bar */}
      <span className="pointer-events-none absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-blue-400 via-cyan-400 to-emerald-400 opacity-60" />

      {/* Headline */}
      <h3 className="text-lg sm:text-xl font-semibold text-gray-100">
        {headline}
      </h3>

      {/* Summary (collapsible) */}
      <div className="mt-3 space-y-3 text-sm text-gray-200">
        {(expanded ? paragraphs : paragraphs.slice(0, 2)).map((p, i) => (
          <p
            key={i}
            dangerouslySetInnerHTML={{
              __html: p.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
            }}
          />
        ))}
      </div>

      {/* Read more / less */}
      {paragraphs.length > 2 && (
        <button
          onClick={() => setExpanded((s) => !s)}
          className="mt-3 inline-flex items-center rounded-md bg-gray-600/40 px-3 py-1.5 text-xs font-medium text-gray-100 hover:bg-gray-600/60">
          {expanded ? "Show less" : "Read more"}
        </button>
      )}

      {/* Highlights row */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {["ERP Systems", "AI/ML", "Secure APIs", "Performance", "DevOps"].map(
          (tag) => (
            <span
              key={tag}
              className="rounded-full border border-gray-600/60 bg-gray-700/50 px-2.5 py-1 text-[11px] text-gray-200 shadow-sm hover:shadow-glow transition">
              {tag}
            </span>
          )
        )}
      </div>

      {/* Subtle glow */}
      <div className="pointer-events-none absolute -inset-16 bg-[radial-gradient(40%_40%_at_20%_10%,rgba(147,197,253,0.25),transparent_60%)]" />
    </motion.div>
  );
}
