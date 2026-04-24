import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { deriveKey } from "../utils/crypto";
import NorthernLightsCanvas from "../components/NorthernLights";
import { getSalt, saveSalt, generateSalt, loadVault, saveVault } from "../utils/storage";
import { useLang } from "../contexts/LangContext";
import { translations } from "../locales/translations";
import type { Lang } from "../contexts/LangContext";

interface Props {
  onUnlock: (key: CryptoKey) => void;
}

const LANG_LABELS: Record<Lang, string> = { en: "EN", ru: "RU", uz: "UZB" };

export default function LockScreen({ onUnlock }: Props) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { lang, setLang } = useLang();
  const t = translations[lang];

  useEffect(() => {
    setIsFirstTime(getSalt() === null);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (isFirstTime && password !== confirm) {
      setError(t.errorMismatch);
      return;
    }
    if (password.length < 6) {
      setError(t.errorShort);
      return;
    }

    setLoading(true);
    try {
      let salt = getSalt();
      if (!salt) {
        salt = generateSalt();
        saveSalt(salt);
      }
      const key = await deriveKey(password, salt);

      if (isFirstTime) {
        await saveVault(key, []);
      } else {
        const result = await loadVault(key);
        if (result === null) {
          setError(t.errorWrong);
          setLoading(false);
          return;
        }
      }

      onUnlock(key);
      navigate("/vault");
    } catch {
      setError(t.errorGeneric);
    }
    setLoading(false);
  }

  return (
    <div className="relative flex items-center justify-center p-6 overflow-hidden" style={{ minHeight: "100dvh" }}>
      {/* Aurora background */}
      <NorthernLightsCanvas />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Language switcher */}
      <div className="absolute top-4 right-4 flex items-center gap-1 z-10">
        {(["en", "ru", "uz"] as const).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`text-xs px-2.5 py-1 rounded-lg transition-all backdrop-blur-sm ${
              lang === l
                ? "bg-white/15 text-white"
                : "text-white/35 hover:text-white/65"
            }`}
          >
            {LANG_LABELS[l]}
          </button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 mb-4">
            <img src="/PassVault.png" alt="PassVault" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-white text-xl sm:text-2xl font-semibold tracking-tight">
            {t.title}
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            {isFirstTime ? t.subtitleNew : t.subtitleExisting}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t.placeholder}
            autoFocus
            className="w-full bg-[#13131a] border border-white/5 rounded-xl px-4 py-3 text-white placeholder-zinc-600 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
          />
          {isFirstTime && (
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder={t.placeholderConfirm}
              className="w-full bg-[#13131a] border border-white/5 rounded-xl px-4 py-3 text-white placeholder-zinc-600 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
            />
          )}
          {error && <p className="text-red-400 text-sm px-1">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 text-white font-medium py-3 rounded-xl transition-colors mt-1"
          >
            {loading ? t.loading : isFirstTime ? t.buttonCreate : t.buttonUnlock}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
