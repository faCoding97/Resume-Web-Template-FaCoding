"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  text: string;
  active: boolean; // فقط تریگر شروع
  speedMs?: number; // سرعت پایه
  startDelayMs?: number; // تاخیر شروع
};

export default function TypingText({
  text,
  active,
  speedMs = 22,
  startDelayMs = 20,
}: Props) {
  // متن امن
  const [out, setOut] = useState("");
  const safeTextRef = useRef<string>("");
  const timerRef = useRef<number | null>(null);
  const iRef = useRef(0);
  const speedRef = useRef(speedMs);

  // وضعیت تایپ
  const startedRef = useRef(false);
  const doneRef = useRef(false);

  const clearTimer = () => {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  // سرعت اگر prop عوض شد
  useEffect(() => {
    speedRef.current = speedMs;
  }, [speedMs]);

  // وقتی متن عوض شد: ریست کامل
  useEffect(() => {
    const safe = String(text ?? "");
    safeTextRef.current = safe;
    clearTimer();
    startedRef.current = false;
    doneRef.current = false;
    iRef.current = 0;
    setOut("");
  }, [text]);

  // لوپ تایپ (کاملاً مستقل از active)
  useEffect(() => {
    const tick = () => {
      if (doneRef.current) return;

      const s = safeTextRef.current;
      const len = s.length;
      let i = iRef.current;

      if (i >= len) {
        doneRef.current = true;
        clearTimer();
        return;
      }

      setOut(s.slice(0, i + 1));
      iRef.current = i + 1;
      timerRef.current = window.setTimeout(tick, Math.max(8, speedRef.current));
    };

    // اگر هنوز شروع نشده و فعال شد → فقط یکبار استارت بزن
    if (
      active &&
      !startedRef.current &&
      !doneRef.current &&
      safeTextRef.current.length > 0
    ) {
      startedRef.current = true;
      // اگر تایمر نداریم، راه بیفتیم
      if (timerRef.current == null) {
        timerRef.current = window.setTimeout(tick, startDelayMs);
      }
    }

    // مهم: این افکت **cleanup** نمی‌دهد که تایمر را روی تغییر active نابود کند
    return () => {};
  }, [active, startDelayMs]); // ← وابسته به active برای تریگر، ولی تایمر را پاک نمی‌کنیم

  // Boost سرعت روی تعامل
  const boost = () => {
    speedRef.current = 10;
    window.setTimeout(() => {
      speedRef.current = speedMs;
    }, 250);
  };

  // پاکسازی نهایی هنگام unmount
  useEffect(() => clearTimer, []);

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
