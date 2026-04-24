import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Papa from "papaparse";
import { deriveKey } from "../utils/crypto";
import { getSalt, loadVault, saveVault } from "../utils/storage";
import type { Credential } from "../types/types";
import { useLang } from "../contexts/LangContext";
import { translations } from "../locales/translations";

interface Props {
  cryptoKey: CryptoKey;
}

export default function Settings({ cryptoKey }: Props) {
  const navigate = useNavigate();
  const { lang } = useLang();
  const t = translations[lang];

  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdError, setPwdError] = useState("");
  const [pwdSuccess, setPwdSuccess] = useState(false);
  const [changingPwd, setChangingPwd] = useState(false);
  const [importStatus, setImportStatus] = useState("");

  const [autoLock, setAutoLock] = useState<number>(() => {
    return Number(localStorage.getItem("autoLock") ?? 15);
  });

  const LOCK_OPTIONS = [
    { label: t.lock5min, value: 5 },
    { label: t.lock15min, value: 15 },
    { label: t.lock30min, value: 30 },
    { label: t.lockNever, value: 0 },
  ];

  async function handleChangePassword() {
    setPwdError("");
    setPwdSuccess(false);
    if (newPwd.length < 6) {
      setPwdError(t.errorShort);
      return;
    }
    if (newPwd !== confirmPwd) {
      setPwdError(t.errorMismatch);
      return;
    }
    setChangingPwd(true);
    try {
      const salt = getSalt()!;
      const oldKey = await deriveKey(currentPwd, salt);
      const data = await loadVault(oldKey);
      if (data === null) {
        setPwdError(t.wrongCurrentPassword);
        setChangingPwd(false);
        return;
      }
      await saveVault(cryptoKey, data);
      const newKey = await deriveKey(newPwd, salt);
      await saveVault(newKey, data);
      setPwdSuccess(true);
      setCurrentPwd("");
      setNewPwd("");
      setConfirmPwd("");
    } catch {
      setPwdError(t.changePasswordError);
    }
    setChangingPwd(false);
  }

  async function handleExport() {
    const data = await loadVault(cryptoKey);
    const blob = new Blob(
      [JSON.stringify({ exported: Date.now(), data }, null, 2)],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `teamvault-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const raw: Record<string, unknown>[] = parsed.data ?? parsed;
      if (!Array.isArray(raw)) throw new Error();
      const now = Date.now();
      const data: Credential[] = raw.map((r) => ({
        id: crypto.randomUUID(),
        name: String(r.name || r.username || r.email || r.title || r.Name || ""),
        url: String(r.url || r.URL || r.login_uri || ""),
        username: String(r.username || r.email || r.login_username || r.Username || ""),
        password: String(r.password || r.Password || r.login_password || ""),
        category: String(r.category || r.Category || "Other"),
        notes: String(r.notes || r.note || r.extra || ""),
        createdAt: Number(r.createdAt) || now,
        updatedAt: Number(r.updatedAt) || now,
      }));
      await saveVault(cryptoKey, data);
      setImportStatus(t.importSuccess.replace("{n}", String(data.length)));
    } catch {
      setImportStatus(t.importErrorFile);
    }
    e.target.value = "";
  }

  async function handleImportCSV(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      complete: async (result) => {
        try {
          const rows = result.data as Record<string, string>[];
          const existing = (await loadVault(cryptoKey) as Credential[]) ?? [];
          const now = Date.now();
          const imported: Credential[] = rows
            .filter((r) => r.password || r.Password)
            .map((r) => ({
              id: crypto.randomUUID(),
              name: r.name || r.Name || r.title || r.Title || "",
              url: r.url || r.URL || r.login_uri || "",
              username: r.username || r.Username || r.login_username || r.email || "",
              password: r.password || r.Password || r.login_password || "",
              category: "Other",
              notes: r.note || r.notes || r.extra || "",
              createdAt: now,
              updatedAt: now,
            }));
          await saveVault(cryptoKey, [...existing, ...imported]);
          setImportStatus(t.importSuccessCSV.replace("{n}", String(imported.length)));
        } catch {
          setImportStatus(t.importErrorCSVProcess);
        }
      },
      error: () => setImportStatus(t.importErrorCSVFormat),
    });
    e.target.value = "";
  }

  async function handleClearVault() {
    if (!confirm(t.clearVaultConfirm)) return;
    await saveVault(cryptoKey, []);
    navigate("/vault");
  }

  function handleAutoLock(value: number) {
    setAutoLock(value);
    localStorage.setItem("autoLock", String(value));
    window.dispatchEvent(new CustomEvent("autolock-change", { detail: value }));
  }

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
          <h1 className="text-white font-semibold">{t.settingsTitle}</h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4"
        >
          {/* Change password */}
          <div className="bg-[#13131a] border border-white/5 rounded-2xl p-5">
            <h2 className="text-white text-sm font-medium mb-4">{t.changeMasterPassword}</h2>
            <div className="flex flex-col gap-3">
              <input
                type="password"
                value={currentPwd}
                onChange={(e) => setCurrentPwd(e.target.value)}
                placeholder={t.currentPassword}
                className="w-full bg-[#0a0a0f] border border-white/5 rounded-xl px-4 py-2.5 text-white text-sm placeholder-zinc-600 outline-none focus:border-indigo-500/40 transition-all"
              />
              <input
                type="password"
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                placeholder={t.newPassword}
                className="w-full bg-[#0a0a0f] border border-white/5 rounded-xl px-4 py-2.5 text-white text-sm placeholder-zinc-600 outline-none focus:border-indigo-500/40 transition-all"
              />
              <input
                type="password"
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                placeholder={t.confirmNewPassword}
                className="w-full bg-[#0a0a0f] border border-white/5 rounded-xl px-4 py-2.5 text-white text-sm placeholder-zinc-600 outline-none focus:border-indigo-500/40 transition-all"
              />
              {pwdError && <p className="text-red-400 text-xs">{pwdError}</p>}
              {pwdSuccess && <p className="text-green-400 text-xs">{t.passwordChanged}</p>}
              <button
                onClick={handleChangePassword}
                disabled={changingPwd}
                className="w-full bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
              >
                {changingPwd ? t.saving : t.changePasswordBtn}
              </button>
            </div>
          </div>

          {/* Auto-lock */}
          <div className="bg-[#13131a] border border-white/5 rounded-2xl p-5">
            <h2 className="text-white text-sm font-medium mb-3">{t.autoLockLabel}</h2>
            <div className="grid grid-cols-2 gap-2">
              {LOCK_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleAutoLock(opt.value)}
                  className={`py-2.5 rounded-xl text-sm border transition-all ${
                    autoLock === opt.value
                      ? "bg-indigo-500/20 border-indigo-500/30 text-indigo-400"
                      : "border-white/5 text-zinc-500 hover:text-white hover:border-white/10"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Export & Import */}
          <div className="bg-[#13131a] border border-white/5 rounded-2xl p-5">
            <h2 className="text-white text-sm font-medium mb-1">{t.dataTitle}</h2>
            <p className="text-zinc-500 text-xs mb-4">{t.dataDesc}</p>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleExport}
                className="w-full border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white text-sm font-medium py-2.5 rounded-xl transition-all"
              >
                {t.downloadBackup}
              </button>
              <label className="w-full border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white text-sm font-medium py-2.5 rounded-xl transition-all cursor-pointer text-center">
                {t.importFromJSON}
                <input type="file" accept=".json" onChange={handleImport} className="hidden" />
              </label>
              <label className="w-full border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white text-sm font-medium py-2.5 rounded-xl transition-all cursor-pointer text-center">
                {t.importFromCSV}
                <input type="file" accept=".csv" onChange={handleImportCSV} className="hidden" />
              </label>
              {importStatus && (
                <p className={`text-xs px-1 ${importStatus.startsWith("✓") ? "text-green-400" : "text-red-400"}`}>
                  {importStatus}
                </p>
              )}
            </div>
          </div>

          {/* Danger zone */}
          <div className="bg-[#13131a] border border-red-500/10 rounded-2xl p-5">
            <h2 className="text-red-400 text-sm font-medium mb-1">{t.dangerZone}</h2>
            <p className="text-zinc-500 text-xs mb-4">{t.dangerZoneDesc}</p>
            <button
              onClick={handleClearVault}
              className="w-full border border-red-500/20 hover:bg-red-500/10 text-red-400 text-sm font-medium py-2.5 rounded-xl transition-all"
            >
              {t.clearVault}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
