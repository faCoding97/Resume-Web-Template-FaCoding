"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";

type SkillsMap = Record<string, string[]>;

function displayName(raw: string): string {
  // نرمالایز نمایش (بدون تغییر ترتیب)
  const m = raw.trim().toLowerCase();
  const map: Record<string, string> = {
    javascript: "JavaScript",
    "c#": "C#",
    react: "React",
    next: "Next.js",
    "next.js": "Next.js",
    "vue js": "Vue.js",
    ".net core": ".NET Core",
    ".net framework": ".NET Framework",
    unity: "Unity",
    "asp .net mvc": "ASP.NET MVC",
    "asp .net api": "ASP.NET API",
    sql: "SQL",
    "my sql": "MySQL",
    mysql: "MySQL",
    mongodb: "MongoDB",
    nodejs: "Node.js",
    "node.js": "Node.js",
    python: "Python",
    "tailwind css": "Tailwind CSS",
    bootstrap: "Bootstrap",
  };
  return map[m] ?? raw;
}

export default function SkillsSection({
  skills,
  ordered = [],
}: {
  skills: SkillsMap;
  ordered?: string[];
}) {
  const categories = useMemo(() => Object.keys(skills), [skills]);
  const [active, setActive] = useState(categories[0] ?? "");

  const copyActive = async () => {
    try {
      const list = (skills[active] || []).join(", ");
      await navigator.clipboard.writeText(list);
    } catch {}
  };

  return (
    <div className="rounded-2xl border border-gray-600/50 bg-gray-700/30 p-5 sm:p-6">
      {/* Journey (ordered) */}
      {ordered.length > 0 && (
        <div className="mb-4">
          <div className="mb-2 text-xs text-gray-400">Journey (ordered)</div>
          <div className="journey no-scrollbar flex snap-x snap-mandatory items-center gap-2 overflow-x-auto pb-1">
            {ordered.map((raw, i) => (
              <div
                key={`${raw}-${i}`}
                className="journey-item snap-start inline-flex items-center gap-2 rounded-full border border-gray-600/60 bg-gray-700/50 px-2.5 py-1 text-[11px] text-gray-200"
                title={`${i + 1}. ${displayName(raw)}`}>
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-blue-500/25 text-[10px] text-blue-200 border border-blue-400/30">
                  {i + 1}
                </span>
                <span className="whitespace-nowrap">{displayName(raw)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition border ${
              active === cat
                ? "bg-blue-500/20 text-blue-200 border-blue-400/30"
                : "bg-gray-700/40 text-gray-200 border-gray-600/60 hover:bg-gray-700/60"
            }`}>
            {cat}
          </button>
        ))}
        <div className="ml-auto">
          <button
            onClick={copyActive}
            className="rounded-md bg-gray-600/40 px-3 py-1.5 text-xs font-medium text-gray-100 hover:bg-gray-600/60"
            title="Copy visible skills">
            Copy list
          </button>
        </div>
      </div>

      {/* Chips */}
      <motion.div
        key={active}
        className="mt-4 flex flex-wrap items-center gap-2"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}>
        {(skills[active] || []).map((s) => (
          <span
            key={s}
            className="skill-chip rounded-full border border-gray-600/60 bg-gray-700/50 px-2.5 py-1 text-[11px] text-gray-200">
            {s}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
