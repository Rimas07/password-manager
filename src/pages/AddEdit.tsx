import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import type { Credential } from "../types/types";
import { loadVault, saveVault } from "../utils/storage";
import { getStrength, generatePassword } from "../utils/passwordUtils";
import StrengthIndicator from "../components/StrengthIndicator";

interface Props {
  cryptoKey: CryptoKey;
}

const CATEGORIES = [
  "Engineering",
  "Marketing",
  "Finance",
  "HR",
  "Design",
  "Other",
];

async function checkBreach(password: string): Promise<number> {
  const hash = await crypto.subtle.digest(
    "SHA-1",
    new TextEncoder().encode(password)
  );
  const hex = Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
  const prefix = hex.slice(0, 5);
  const suffix = hex.slice(5);
  const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
  const text = await res.text();
  const line = text.split("\n").find((l) => l.startsWith(suffix));
  return line ? parseInt(line.split(":")[1]) : 0;
}

export default function AddEdit({ cryptoKey }: Props) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: "",
    url: "",
    username: "",
    password: "",
    category: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [saving, setSaving] = useState(false);
  const [allCredentials, setAllCredentials] = useState<Credential[]>([]);

  const [genLength, setGenLength] = useState(16);
  const [genUpper, setGenUpper] = useState(true);
  const [genNumbers, setGenNumbers] = useState(true);
  const [genSymbols, setGenSymbols] = useState(true);
  const [showGenerator, setShowGenerator] = useState(false);

  const [breachCount, setBreachCount] = useState<number | null>(null);
  const [breachLoading, setBreachLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    loadVault(cryptoKey).then((data) => {
      if (!Array.isArray(data)) return;
      const creds = data as Credential[];
      setAllCredentials(creds);
      if (isEdit) {
        const found = creds.find((c) => c.id === id);
        if (found)
          setForm({
            name: found.name,
            url: found.url,
            username: found.username,
            password: found.password,
            category: found.category,
            notes: found.notes,
          });
      }
    });
  }, [cryptoKey, id, isEdit]);

  useEffect(() => {
    if (!form.password) {
      setBreachCount(null);
      return;
    }
    const timer = setTimeout(async () => {
      setBreachLoading(true);
      try {
        const count = await checkBreach(form.password);
        setBreachCount(count);
      } catch {
        setBreachCount(null);
      }
      setBreachLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [form.password]);

  function set(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "" }));
  }

  function validate() {
    const e: Partial<typeof form> = {};
    if (!form.name.trim()) e.name = "Укажите название";
    if (!form.username.trim()) e.username = "Укажите логин";
    if (!form.password.trim()) e.password = "Укажите пароль";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    const now = Date.now();
    const updated = isEdit
      ? allCredentials.map((c) =>
          c.id === id ? { ...c, ...form, updatedAt: now } : c
        )
      : [
          ...allCredentials,
          { id: crypto.randomUUID(), ...form, createdAt: now, updatedAt: now },
        ];
    await saveVault(cryptoKey, updated);
    navigate("/vault");
  }

  async function handleDelete() {
    if (!confirm("Удалить эту запись?")) return;
    const updated = allCredentials.filter((c) => c.id !== id);
    await saveVault(cryptoKey, updated);
    navigate("/vault");
  }

  function handleGenerate() {
    const pwd = generatePassword({
      length: genLength,
      uppercase: genUpper,
      numbers: genNumbers,
      symbols: genSymbols,
    });
    set("password", pwd);
  }

  const strength = getStrength(form.password);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/vault")}
            className="p-2 rounded-xl text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-white font-semibold">
            {isEdit ? "Редактировать" : "Новая запись"}
          </h1>
          {isEdit && (
            <button
              onClick={handleDelete}
              className="ml-auto p-2 rounded-xl text-red-500 hover:bg-red-500/10 transition-all"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4"
        >
          {/* Name */}
          <div>
            <label className="text-zinc-400 text-xs mb-1.5 block">
              Название сервиса *
            </label>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Google, GitHub, Figma..."
              className={`w-full bg-[#13131a] border rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-600 outline-none focus:border-indigo-500/50 transition-all ${
                errors.name ? "border-red-500/50" : "border-white/5"
              }`}
            />
            {errors.name && (
              <p className="text-red-400 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* URL */}
          <div>
            <label className="text-zinc-400 text-xs mb-1.5 block">URL</label>
            <input
              value={form.url}
              onChange={(e) => set("url", e.target.value)}
              placeholder="https://example.com"
              className="w-full bg-[#13131a] border border-white/5 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-600 outline-none focus:border-indigo-500/50 transition-all"
            />
          </div>

          {/* Username */}
          <div>
            <label className="text-zinc-400 text-xs mb-1.5 block">
              Логин / Email *
            </label>
            <input
              value={form.username}
              onChange={(e) => set("username", e.target.value)}
              placeholder="user@example.com"
              className={`w-full bg-[#13131a] border rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-600 outline-none focus:border-indigo-500/50 transition-all ${
                errors.username ? "border-red-500/50" : "border-white/5"
              }`}
            />
            {errors.username && (
              <p className="text-red-400 text-xs mt-1">{errors.username}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-zinc-400 text-xs">Пароль *</label>
              <button
                onClick={() => setShowGenerator((s) => !s)}
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                {showGenerator ? "Скрыть генератор" : "Генератор"}
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                placeholder="Пароль"
                className={`w-full bg-[#13131a] border rounded-xl px-4 py-3 pr-10 text-white text-sm placeholder-zinc-600 outline-none focus:border-indigo-500/50 transition-all font-mono ${
                  errors.password ? "border-red-500/50" : "border-white/5"
                }`}
              />
              <button
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {showPassword ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21"
                    />
                  ) : (
                    <>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </>
                  )}
                </svg>
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">{errors.password}</p>
            )}
            {form.password && <StrengthIndicator strength={strength} />}

            {/* HIBP */}
            {form.password && (
              <div className="mt-2">
                {breachLoading ? (
                  <p className="text-zinc-500 text-xs">Проверка утечек...</p>
                ) : breachCount === null ? null : breachCount === 0 ? (
                  <p className="text-green-400 text-xs">
                    ✓ Не найден в известных утечках
                  </p>
                ) : (
                  <p className="text-red-400 text-xs">
                    ⚠ Найден в {breachCount.toLocaleString()} утечках — смените
                    пароль
                  </p>
                )}
              </div>
            )}

            {/* Generator */}
            {showGenerator && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-3 bg-[#0d0d14] border border-white/5 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-zinc-400 text-xs">
                    Длина: {genLength}
                  </span>
                  <input
                    type="range"
                    min={8}
                    max={64}
                    value={genLength}
                    onChange={(e) => setGenLength(+e.target.value)}
                    className="w-32 accent-indigo-500"
                  />
                </div>
                <div className="flex gap-3 mb-3">
                  {[
                    { label: "A-Z", value: genUpper, set: setGenUpper },
                    { label: "0-9", value: genNumbers, set: setGenNumbers },
                    { label: "!@#", value: genSymbols, set: setGenSymbols },
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => opt.set((v) => !v)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                        opt.value
                          ? "bg-indigo-500/20 border-indigo-500/30 text-indigo-400"
                          : "border-white/10 text-zinc-600"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleGenerate}
                    className="flex-1 bg-indigo-500 hover:bg-indigo-400 text-white text-sm py-2 rounded-lg transition-colors font-medium"
                  >
                    Сгенерировать
                  </button>
                  <button
                    onClick={() =>
                      form.password &&
                      navigator.clipboard.writeText(form.password)
                    }
                    disabled={!form.password}
                    className="px-4 border border-white/10 hover:border-white/20 text-zinc-400 hover:text-white text-sm py-2 rounded-lg transition-all disabled:opacity-30"
                    title="Скопировать"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="text-zinc-400 text-xs mb-1.5 block">
              Категория
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() =>
                    set("category", form.category === cat ? "" : cat)
                  }
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                    form.category === cat
                      ? "bg-indigo-500/20 border-indigo-500/30 text-indigo-400"
                      : "border-white/10 text-zinc-600 hover:text-white hover:border-white/20"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-zinc-400 text-xs mb-1.5 block">
              Заметки
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Дополнительная информация..."
              rows={3}
              className="w-full bg-[#13131a] border border-white/5 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-600 outline-none focus:border-indigo-500/50 transition-all resize-none"
            />
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 text-white font-medium py-3 rounded-xl transition-colors mt-2"
          >
            {saving
              ? "Сохранение..."
              : isEdit
              ? "Сохранить изменения"
              : "Добавить запись"}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
