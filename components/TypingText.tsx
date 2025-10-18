"use client";

import { useEffect, useRef, useState } from "react";

export default function TypingText({
  text,
  active,
}: {
  text: string;
  active: boolean;
}) {
  const [out, setOut] = useState("");
  const [speed, setSpeed] = useState(22); // base ms per character
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!active) {
      setOut("");
      return;
    }
    let i = 0;
    const tick = () => {
      setOut((prev) => prev + text[i]);
      i++;
      if (i < text.length) {
        timer.current = window.setTimeout(tick, Math.max(8, speed));
      }
    };
    tick();
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = null;
    };
  }, [active, text, speed]);

  // speed controller hook
  const onMouseMove = () => {
    setSpeed((s) => Math.max(8, s - 2)); // speed up a bit while moving
    window.setTimeout(() => setSpeed(22), 300); // relax
  };

  return (
    <p onMouseMove={onMouseMove} className="mt-2 text-sm text-gray-300 typing-caret">
      {out}
    </p>
  );
}