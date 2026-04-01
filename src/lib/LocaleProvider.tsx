"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  type Locale,
  type Translatable,
  DEFAULT_LOCALE,
  STORAGE_KEY,
  detectBrowserLocale,
  t,
  tf,
} from "./i18n";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (translatable: Translatable) => string;
  tf: (translatable: Translatable, vars: Record<string, string | number>) => string;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: (tr) => t(tr, DEFAULT_LOCALE),
  tf: (tr, vars) => tf(tr, DEFAULT_LOCALE, vars),
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLocaleState(detectBrowserLocale()); // eslint-disable-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = locale;
    }
  }, [locale, mounted]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(STORAGE_KEY, newLocale);
    document.documentElement.lang = newLocale;
  };

  const value: LocaleContextValue = {
    locale,
    setLocale,
    t: (tr) => t(tr, locale),
    tf: (tr, vars) => tf(tr, locale, vars),
  };

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
