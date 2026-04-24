import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import type { Credential } from "../types/types";
import { loadVault } from "../utils/storage";
import { getStrength } from "../utils/passwordUtils";
import { useLang } from "../contexts/LangContext";
import { translations } from "../locales/translations";

interface Props {
  cryptoKey: CryptoKey;
}

const NINETY_DAYS = 90 * 24 * 60 * 60 * 1000;

export default function Security({ cryptoKey }: Props) {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const navigate = useNavigate();
  const { lang } = useLang();
  const t = translations[lang];

  useEffect(() => {
    loadVault(cryptoKey).then((data) => {
      if (Array.isArray(data)) setCredentials(data as Credential[]);
    });
  }, [cryptoKey]);

  const weak = credentials.filter((c) => getStrength(c.password) === "weak");
  const fair = credentials.filter((c) => getStrength(c.password) === "fair");
  const strong = credentials.filter((c) => getStrength(c.password) === "strong");

  const passwordCounts = new Map<string, Credential[]>();
  credentials.forEach((c) => {
    const group = passwordCounts.get(c.password) ?? [];
    passwordCounts.set(c.password, [...group, c]);
  });
  const reusedGroups = [...passwordCounts.values()].filter((g) => g.length > 1);

  const old = credentials.filter((c) => Date.now() - c.updatedAt > NINETY_DAYS);

  const score =
    credentials.length === 0
      ? 100
      : Math.round(
          (strong.length * 100 + fair.length * 50 + weak.length * 0) /
            credentials.length -
            reusedGroups.length * 10 -
            old.length * 5
        );
  const clampedScore = Math.max(0, Math.min(100, score));

  const scoreColor =
    clampedScore >= 80 ? "text-green-400" : clampedScore >= 50 ? "text-yellow-400" : "text-red-400";
  const scoreLabel =
    clampedScore >= 80 ? t.scoreGood : clampedScore >= 50 ? t.scoreWarning : t.scoreCritical;

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/vault")}
            className="p-2 rounded-xl text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-white font-semibold">{t.securityTitle}</h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4"
        >
          {/* Score */}
          <div className="bg-[#13131a] border border-white/5 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-zinc-500 text-xs mb-1">{t.overallRating}</p>
              <p className={`text-4xl font-bold ${scoreColor}`}>{clampedScore}</p>
              <p className={`text-sm mt-1 ${scoreColor}`}>{scoreLabel}</p>
            </div>
            <div className="w-20 h-20 relative flex items-center justify-center">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#ffffff08" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15.9" fill="none"
                  stroke={clampedScore >= 80 ? "#4ade80" : clampedScore >= 50 ? "#facc15" : "#f87171"}
                  strokeWidth="3"
                  strokeDasharray={`${clampedScore} 100`}
                  strokeLinecap="round"
                />
              </svg>
              <span className={`absolute text-sm font-bold ${scoreColor}`}>{clampedScore}%</span>
            </div>
          </div>

          {/* Strength breakdown */}
          <div className="bg-[#13131a] border border-white/5 rounded-2xl p-5">
            <h2 className="text-white text-sm font-medium mb-4">{t.passwordDistribution}</h2>
            <div className="flex gap-2 mb-3">
              {[
                { count: strong.length, color: "bg-green-400" },
                { count: fair.length, color: "bg-yellow-400" },
                { count: weak.length, color: "bg-red-400" },
              ].map(
                (item, i) =>
                  credentials.length > 0 && (
                    <div
                      key={i}
                      className={`${item.color} rounded-full h-2 transition-all`}
                      style={{ width: `${(item.count / credentials.length) * 100}%`, minWidth: item.count > 0 ? "4px" : "0" }}
                    />
                  )
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { count: strong.length, label: t.countStrong, color: "text-green-400" },
                { count: fair.length, label: t.countFair, color: "text-yellow-400" },
                { count: weak.length, label: t.countWeak, color: "text-red-400" },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <p className={`text-2xl font-bold ${item.color}`}>{item.count}</p>
                  <p className="text-zinc-600 text-xs">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Weak passwords */}
          {weak.length > 0 && (
            <div className="bg-[#13131a] border border-red-500/10 rounded-2xl p-5">
              <h2 className="text-red-400 text-sm font-medium mb-3">{t.weakPasswordsTitle}</h2>
              <div className="flex flex-col gap-2">
                {weak.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => navigate(`/edit/${c.id}`)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 transition-all text-left"
                  >
                    <span className="text-white text-sm">{c.name}</span>
                    <span className="text-zinc-600 text-xs">{t.fixBtn}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Reused passwords */}
          {reusedGroups.length > 0 && (
            <div className="bg-[#13131a] border border-orange-500/10 rounded-2xl p-5">
              <h2 className="text-orange-400 text-sm font-medium mb-3">{t.reusedPasswordsTitle}</h2>
              <div className="flex flex-col gap-3">
                {reusedGroups.map((group, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    {group.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => navigate(`/edit/${c.id}`)}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 transition-all text-left"
                      >
                        <span className="text-white text-sm">{c.name}</span>
                        <span className="text-zinc-600 text-xs">{t.fixBtn}</span>
                      </button>
                    ))}
                    {i < reusedGroups.length - 1 && <div className="border-t border-white/5 mt-1" />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Old passwords */}
          {old.length > 0 && (
            <div className="bg-[#13131a] border border-zinc-500/10 rounded-2xl p-5">
              <h2 className="text-zinc-400 text-sm font-medium mb-3">{t.oldPasswordsTitle}</h2>
              <div className="flex flex-col gap-2">
                {old.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => navigate(`/edit/${c.id}`)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 transition-all text-left"
                  >
                    <span className="text-white text-sm">{c.name}</span>
                    <span className="text-zinc-600 text-xs">
                      {t.daysCount.replace("{n}", String(Math.floor((Date.now() - c.updatedAt) / (24 * 60 * 60 * 1000))))}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* All good */}
          {weak.length === 0 && reusedGroups.length === 0 && old.length === 0 && credentials.length > 0 && (
            <div className="bg-[#13131a] border border-green-500/10 rounded-2xl p-5 text-center">
              <p className="text-green-400 text-2xl mb-2">✓</p>
              <p className="text-white text-sm font-medium">{t.allGood}</p>
              <p className="text-zinc-500 text-xs mt-1">{t.allGoodDesc}</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
