// components/Hero.tsx
import React from "react";

export default function Hero({
  name,
  subtitle,
}: {
  name: string;
  subtitle: string;
}) {
  return (
    <div className="mt-6 flex flex-col items-center text-center">
      {/* اسم با گرادیان و امضا */}
      <div className="relative">
        <h1 className="hero-name text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight tracking-tight">
          {name}
        </h1>

        {/* امضای زیر اسم - SVG با انیمیشن stroke */}
        <svg
          className="sig-line absolute -bottom-3 left-1/2 -translate-x-1/2"
          width="260"
          height="16"
          viewBox="0 0 260 16"
          aria-hidden>
          <path
            d="M4 12 C 60 12, 90 2, 130 10 S 200 18, 256 8"
            fill="none"
            stroke="url(#sig-grad)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="sig-grad" x1="0" x2="1">
              <stop offset="0%" stopColor="#93c5fd" />
              <stop offset="50%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#93c5fd" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* زیرعنوان ثابت */}
      <p className="mt-5 max-w-2xl text-gray-300 text-sm sm:text-base">
        {subtitle}
      </p>
    </div>
  );
}
