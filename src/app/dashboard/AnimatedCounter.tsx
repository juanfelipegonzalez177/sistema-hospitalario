"use client";
import { useEffect, useRef, useState } from "react";

export function AnimatedCounter({ value, className }: { value: number; className?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<number>(0);

  useEffect(() => {
    const start = ref.current;
    const end = value;
    const duration = 800;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + (end - start) * ease));
      if (progress < 1) requestAnimationFrame(animate);
      else ref.current = end;
    };
    requestAnimationFrame(animate);
  }, [value]);

  return <p className={className}>{display.toLocaleString("es-CO")}</p>;
}