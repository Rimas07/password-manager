import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { Credential } from "../../src/types/types";
import { loadVault, saveVault } from "../utils/storage";
import { findReusedPasswords, getStrength } from "../utils/passwordUtils";
import PasswordCard from "../components/PasswordCard";
import EmptyState from "../components/EmptyState";
import OnboardingModal from "../components/OnboardingModal";



interface Props {
  cryptoKey: CryptoKey;
  onLock: () => void;
}


const CATEGORIES = [
  "Все",
  "Engineering",
  "Marketing",
  "Finance",
  "HR",
  "Design",
  "Other",
];

export default function Vault({ cryptoKey, onLock }: Props) {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Все");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [toast, setToast] = useState("");
  const [showOnboarding, setShowOnboarding] = useState(
    () => !localStorage.getItem("onboardingDone")
  );
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadVault(cryptoKey).then((data) => {
      if (Array.isArray(data)) setCredentials(data as Credential[]);
    });
  }, [cryptoKey]);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (document.activeElement as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const key = e.key.toLowerCase();
      if (key === "n" || key === "т") { e.preventDefault(); navigate("/add"); }
      if (key === "l" || key === "д") { e.preventDefault(); onLock(); }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [navigate, onLock]);

  const reusedPasswords = findReusedPasswords(credentials);

  const filtered = credentials.filter((c) => {
    const q = search.toLowerCase();
    const matchesSearch =
      c.name.toLowerCase().includes(q) ||
      c.username.toLowerCase().includes(q) ||
      c.url.toLowerCase().includes(q);
    const matchesCategory = category === "Все" || c.category === category;
    return matchesSearch && matchesCategory;
  });

  async function handleCopy(text: string, label: string) {
    await navigator.clipboard.writeText(text);
    setToast(`${label} скопирован`);
    setTimeout(() => setToast(""), 2000);
  }

  async function handleDelete(id: string) {
    const updated = credentials.filter((c) => c.id !== id);
    await saveVault(cryptoKey, updated);
    setCredentials(updated);
  }

  return (
    <div ref={containerRef} tabIndex={-1} className="min-h-screen bg-[#0a0a0f] relative outline-none" style={{ backgroundImage: "url('/aurora.jpg')", backgroundSize: "cover", backgroundPosition: "bottom center", backgroundAttachment: "fixed" }}>
      <div className="absolute inset-0 bg-black/82 pointer-events-none" />
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/85 backdrop-blur-md border-b border-white/5 px-4 py-4 relative">
        <div className="max-w-5xl mx-auto">

          {/* Row 1: logo + search (desktop) / logo + actions (mobile) */}
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="flex items-center gap-2.5 flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <span className="text-white font-semibold text-base">PassVault</span>
            </div>

            {/* Search — hidden on mobile, shown on sm+ */}
            <div className="flex-1 relative hidden sm:block">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск по имени, логину, URL..."
                className="w-full bg-white/5 border border-white/8 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-zinc-500 outline-none focus:border-indigo-500/50 focus:bg-white/8 transition-all"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 ml-auto">
              {/* Grid/List toggle — hidden on mobile */}
              <div className="hidden sm:flex bg-white/5 border border-white/8 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-indigo-500/20 text-indigo-400" : "text-zinc-500 hover:text-white"}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-indigo-500/20 text-indigo-400" : "text-zinc-500 hover:text-white"}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>

              <button onClick={() => navigate("/security")} className="p-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/8 transition-all" title="Безопасность">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </button>
              <button onClick={() => navigate("/settings")} className="p-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/8 transition-all" title="Настройки">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              <button onClick={onLock} className="p-2.5 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-red-500/8 transition-all" title="Заблокировать">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Search — mobile only (full width below logo row) */}
          <div className="relative mt-3 sm:hidden">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск..."
              className="w-full bg-white/5 border border-white/8 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-zinc-500 outline-none focus:border-indigo-500/50 transition-all"
            />
          </div>

          {/* Stats */}
          {credentials.length > 0 && (
            <div className="mt-3 flex items-center gap-4">
              <span className="text-zinc-500 text-xs">{credentials.length} записей</span>
              {credentials.filter((c) => getStrength(c.password) === "weak").length > 0 && (
                <span className="text-red-400 text-xs">· {credentials.filter((c) => getStrength(c.password) === "weak").length} слабых</span>
              )}
              {reusedPasswords.size > 0 && (
                <span className="text-orange-400 text-xs">· {reusedPasswords.size} повторяются</span>
              )}
            </div>
          )}

          {/* Categories */}
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`flex-shrink-0 text-xs px-3.5 py-1.5 rounded-lg transition-all ${
                  category === cat
                    ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                    : "text-zinc-500 hover:text-white border border-transparent hover:border-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-6 relative z-10">
        {credentials.length === 0 ? (
          <EmptyState />
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-zinc-600 text-sm">
            Ничего не найдено
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                : "flex flex-col gap-3"
            }
          >
            {filtered.map((c, index) => (
              <motion.div
                key={c.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06, type: "spring", stiffness: 300, damping: 24 }}
                whileHover={{ y: -4, scale: 1.015 }}
                whileTap={{ scale: 0.97 }}
              >
                <PasswordCard
                  credential={c}
                  isReused={reusedPasswords.has(c.password)}
                  onCopy={handleCopy}
                  onDelete={handleDelete}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => navigate("/add")}
        className="fixed bottom-6 right-6 z-20 w-12 h-12 bg-indigo-500 hover:bg-indigo-400 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95"
      >
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-[#13131a] border border-white/10 text-white text-sm px-4 py-2.5 rounded-xl shadow-xl whitespace-nowrap"
          >
            ✓ {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard hint */}
      <div className="fixed bottom-6 left-6 hidden sm:flex items-center gap-3 z-10">
        <span className="text-zinc-500 text-xs"><kbd className="bg-white/10 border border-white/20 rounded px-1.5 py-0.5 font-mono text-xs text-zinc-300">N</kbd> новая запись</span>
        <span className="text-zinc-500 text-xs"><kbd className="bg-white/10 border border-white/20 rounded px-1.5 py-0.5 font-mono text-xs text-zinc-300">L</kbd> заблокировать</span>
      </div>

      {/* Onboarding */}
      <AnimatePresence>
        {showOnboarding && (
          <OnboardingModal onClose={() => setShowOnboarding(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
