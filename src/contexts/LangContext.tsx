import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export type Lang = "en" | "ru" | "uz";

interface LangContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const LangContext = createContext<LangContextType>({ lang: "ru", setLang: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(
    () => (localStorage.getItem("lang") as Lang) || "ru"
  );

  function setLang(l: Lang) {
    localStorage.setItem("lang", l);
    setLangState(l);
  }

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
