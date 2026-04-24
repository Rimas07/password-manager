import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Credential } from "../../src/types/types";
import { getStrength } from "../utils/passwordUtils";

interface Props {
  credential: Credential;
  isReused: boolean;
  onCopy: (text: string, label: string) => void;
}

const strengthConfig = {
  weak: { label: "Слабый", color: "text-red-400", dot: "bg-red-400" },
  fair: { label: "Средний", color: "text-yellow-400", dot: "bg-yellow-400" },
  strong: { label: "Сильный", color: "text-green-400", dot: "bg-green-400" },
};
function FaviconIcon({ url, name }: { url: string; name: string }) {
  const [failed, setFailed] = useState(false);

  const faviconUrl = (() => {
    if (!url || failed) return null;
    try {
      const domain = new URL(url.startsWith("http") ? url : `https://${url}`)
        .hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
      return null;
    }
  })();

  if (faviconUrl) {
    return (
      <div className="w-10 h-10 rounded-xl bg-[#0a0a0f] border border-white/5 flex items-center justify-center flex-shrink-0 overflow-hidden">
        <img
          src={faviconUrl}
          alt=""
          onError={() => setFailed(true)}
          className="w-6 h-6 object-contain"
        />
      </div>
    );
  }

  return (
    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-semibold text-sm flex-shrink-0">
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

export default function PasswordCard({ credential, isReused, onCopy }: Props) {
  const [revealed, setRevealed] = useState(false);
  const navigate = useNavigate();
  const sc = strengthConfig[getStrength(credential.password)];

  return (
    <div className="bg-[#13131a] border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-all group">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-semibold text-sm flex-shrink-0">
            {credential.name.charAt(0).toUpperCase()}
          </div> */}
          <FaviconIcon url={credential.url} name={credential.name} />

          <div>
            <h3 className="text-white font-medium text-sm">
              {credential.name}
            </h3>
            {credential.url && (
              <a
                href={
                  credential.url.startsWith("http")
                    ? credential.url
                    : `https://${credential.url}`
                }
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-zinc-600 hover:text-indigo-400 text-xs mt-0.5 truncate max-w-[140px] block transition-colors"
              >
                {credential.url}
              </a>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {credential.category && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {credential.category}
            </span>
          )}
          <button
            onClick={() => navigate(`/edit/${credential.id}`)}
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-white transition-all"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Username row */}
      <div className="flex items-center justify-between mb-2 group/u">
        <span className="text-zinc-400 text-xs truncate flex-1 mr-2">
          {credential.username}
        </span>
        <button
          onClick={() => onCopy(credential.username, "Логин")}
          className="opacity-0 group-hover/u:opacity-100 p-1 text-zinc-600 hover:text-white transition-all flex-shrink-0"
        >
          <svg
            className="w-3.5 h-3.5"
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

      {/* Password row */}
      <div className="flex items-center justify-between group/p">
        <span className="text-zinc-400 text-xs flex-1 mr-2 font-mono">
          {revealed ? credential.password : "••••••••••"}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover/p:opacity-100 transition-all">
          <button
            onClick={() => setRevealed((r) => !r)}
            className="p-1 text-zinc-600 hover:text-white transition-colors"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {revealed ? (
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
          <button
            onClick={() => onCopy(credential.password, "Пароль")}
            className="p-1 text-zinc-600 hover:text-white transition-colors"
          >
            <svg
              className="w-3.5 h-3.5"
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
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
          <span className={`text-xs ${sc.color}`}>{sc.label}</span>
        </div>
        {isReused && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
            ⚠ Повторяется
          </span>
        )}
      </div>
    </div>
  );
}
