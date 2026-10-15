"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type Locale = "en" | "rw";

const DICT = {
  en: {
    browse: "Browse", login: "Sign In", register: "Create Account",
    logout: "Sign Out", dashboard: "Dashboard", listProperty: "List Property",
    search: "Search", buy: "Buy", rent: "Rent", all: "All",
    where: "Where", type: "Type", budget: "Budget",
    allTypes: "All Types", anyPrice: "Any Price",
  },
  rw: {
    browse: "Reba", login: "Injira", register: "Fungura Konti",
    logout: "Sohoka", dashboard: "Imbonerahamwe", listProperty: "Tangaza",
    search: "Shakisha", buy: "Gura", rent: "Kode", all: "Byose",
    where: "Aho", type: "Ubwoko", budget: "Ingengo",
    allTypes: "Ubwoko bwose", anyPrice: "Igiciro cyose",
  },
} as const;

type Dict = (typeof DICT)["en"];
type Ctx = { locale: Locale; t: (k: keyof Dict) => string; setLocale: (l: Locale) => void };

const I18nCtx = createContext<Ctx | null>(null);
const COOKIE = "nzuri_locale";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const m = document.cookie.match(new RegExp(`${COOKIE}=(\\w+)`));
    if (m && (m[1] === "en" || m[1] === "rw")) setLocaleState(m[1]);
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    document.cookie = `${COOKIE}=${l}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
  }, []);

  const t = useCallback((k: keyof Dict) => DICT[locale][k], [locale]);

  return <I18nCtx.Provider value={{ locale, t, setLocale }}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nCtx);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
