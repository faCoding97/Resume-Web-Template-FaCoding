"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  text: string;
  active: boolean;
  speedMs?: number; // اختیاری: سرعت پایه
  startDelayMs?: number; // اختیاری: تاخیر شروع
};

export default function TypingText({
  text,
  active,
  speedMs = 22,
  startDelayMs = 16,
}: Props) {
  // ALWAYS use a safe string (prevents 'undefined' from ever appearing)
  const safeText = String(text ?? "");
  const [out, setOut] = useState("");
  const timerRef = useRef<number | null>(null);
  const iRef = useRef(0);
  const speedRef = useRef(speedMs);

  const clear = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    clear();
    iRef.current = 0;
    setOut("");

    if (!active || safeText.length === 0) return;

    const len = safeText.length;

    const tick = () => {
      const i = iRef.current;
      if (i >= len) {
        clear();
        return;
      }
      // slice روی safeText → هیچ‌وقت 'undefined' تولید نمی‌کنه
      setOut(safeText.slice(0, i + 1));
      iRef.current = i + 1;
      timerRef.current = window.setTimeout(tick, Math.max(8, speedRef.current));
    };

    timerRef.current = window.setTimeout(tick, startDelayMs);
    return clear;
  }, [active, safeText, startDelayMs]);

  // Boost speed on interaction (mouse/touch/pen)
  const boost = () => {
    speedRef.current = 10;
    window.setTimeout(() => {
      speedRef.current = speedMs;
    }, 250);
  };

  return (
    <p
      onPointerDown={boost}
      onPointerMove={boost}
      className="mt-2 text-sm text-gray-300 typing-caret whitespace-pre-wrap break-words select-text"
      aria-live="polite">
      {out}
    </p>
  );
}
