import { useEffect, useRef } from "react";
import "finisher-header";

export default function FinisherHeaderBg() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const instance = new window.FinisherHeader({
      count: 12,
      size: { min: 824, max: 1378, pulse: 0 },
      speed: { x: { min: 0.6, max: 3 }, y: { min: 0.6, max: 3 } },
      colors: {
        background: "#0F1729",
        particles: ["#7c5cff", "#a78bfa", "#22C55E", "#22d3ee"],
      },
      blending: "screen",
      opacity: { center: 0.6, edge: 0 },
      skew: 0,
      shapes: ["c"],
    });
    return () => {
      const canvas = ref.current?.querySelector("#finisher-canvas");
      canvas?.remove();
      window.removeEventListener("resize", instance.resize);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="finisher-header absolute inset-0"
      style={{ zIndex: 0 }}
    />
  );
}
