import type { Strength } from "../utils/passwordUtils";
import { useLang } from "../contexts/LangContext";
import { translations } from "../locales/translations";

export default function StrengthIndicator({ strength }: { strength: Strength }) {
  const { lang } = useLang();
  const t = translations[lang];

  const config = {
    weak: { label: t.strengthWeak, bars: 1, color: "bg-red-400" },
    fair: { label: t.strengthFair, bars: 2, color: "bg-yellow-400" },
    strong: { label: t.strengthStrong, bars: 3, color: "bg-green-400" },
  };

  const c = config[strength];

  return (
    <div className="flex items-center gap-2 mt-1.5">
      <div className="flex gap-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 w-8 rounded-full transition-all duration-300 ${i <= c.bars ? c.color : "bg-white/10"}`}
          />
        ))}
      </div>
      <span
        className={`text-xs ${
          strength === "weak" ? "text-red-400" : strength === "fair" ? "text-yellow-400" : "text-green-400"
        }`}
      >
        {c.label}
      </span>
    </div>
  );
}
