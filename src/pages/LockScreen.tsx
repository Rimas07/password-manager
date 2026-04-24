import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { deriveKey } from "../utils/crypto";
import NorthernLightsCanvas from "../components/NorthernLights";

import {
  getSalt,
  saveSalt,
  generateSalt,
  loadVault,
  saveVault,
} from "../utils/storage";

interface Props {
  onUnlock: (key: CryptoKey) => void;
}

type Lang = "en" | "ru" | "uz";

const translations: Record<Lang, Record<string, string>> = {
  en: {
    title: "PassVault",
    subtitleNew: "Create a master password",
    subtitleExisting: "Enter your master password",
    placeholder: "Master password",
    placeholderConfirm: "Confirm password",
    errorMismatch: "Passwords do not match",
    errorShort: "Minimum 6 characters",
    errorWrong: "Incorrect password",
    errorGeneric: "Something went wrong",
    loading: "Loading...",
    buttonCreate: "Create vault",
    buttonUnlock: "Unlock",
  },
  ru: {
    title: "PassVault",
    subtitleNew: "Создайте мастер-пароль",
    subtitleExisting: "Введите мастер-пароль",
    placeholder: "Мастер-пароль",
    placeholderConfirm: "Подтвердите пароль",
    errorMismatch: "Пароли не совпадают",
    errorShort: "Минимум 6 символов",
    errorWrong: "Неверный пароль",
    errorGeneric: "Что-то пошло не так",
    loading: "Загрузка...",
    buttonCreate: "Создать хранилище",
    buttonUnlock: "Разблокировать",
  },
  uz: {
    title: "PassVault",
    subtitleNew: "Master parol yarating",
    subtitleExisting: "Master parolni kiriting",
    placeholder: "Master parol",
    placeholderConfirm: "Parolni tasdiqlang",
    errorMismatch: "Parollar mos kelmadi",
    errorShort: "Kamida 6 ta belgi",
    errorWrong: "Noto'g'ri parol",
    errorGeneric: "Xatolik yuz berdi",
    loading: "Yuklanmoqda...",
    buttonCreate: "Xazinani yaratish",
    buttonUnlock: "Ochish",
  },
};

export default function LockScreen({ onUnlock }: Props) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<Lang>("ru");
  const navigate = useNavigate();

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
            {l.toUpperCase()}
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
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
            <svg
              className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
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
            {loading
              ? t.loading
              : isFirstTime
              ? t.buttonCreate
              : t.buttonUnlock}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
