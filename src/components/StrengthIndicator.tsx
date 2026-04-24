import type { Strength } from "../utils/passwordUtils";

const config = {
  weak: { label: "Слабый", bars: 1, color: "bg-red-400" },
  fair: { label: "Средний", bars: 2, color: "bg-yellow-400" },
  strong: { label: "Сильный", bars: 3, color: "bg-green-400" },
};

export default function StrengthIndicator({
  strength,
}: {
  strength: Strength;
}) {
  const c = config[strength];
  return (
    <div className="flex items-center gap-2 mt-1.5">
      <div className="flex gap-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 w-8 rounded-full transition-all duration-300 ${
              i <= c.bars ? c.color : "bg-white/10"
            }`}
          />
        ))}
      </div>
      <span
        className={`text-xs ${
          strength === "weak"
            ? "text-red-400"
            : strength === "fair"
            ? "text-yellow-400"
            : "text-green-400"
        }`}
      >
        {c.label}
      </span>
    </div>
  );
}
