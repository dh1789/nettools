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
  localePath,
  t,
  tf,
} from "./i18n";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (translatable: Translatable) => string;
  tf: (translatable: Translatable, vars: Record<string, string | number>) => string;
  /** 내부 링크용 — 현재 로케일 프리픽스 + trailing slash 를 붙인 href */
  href: (path: string) => string;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: (tr) => t(tr, DEFAULT_LOCALE),
  tf: (tr, vars) => tf(tr, DEFAULT_LOCALE, vars),
  href: (path) => localePath(path, DEFAULT_LOCALE),
});

/**
 * 로케일은 라우트가 결정한다 — `(ko)` 루트 레이아웃은 "ko", `(en)` 은 "en" 을 넘긴다.
 * 브라우저 언어 자동 감지로 텍스트만 바꾸던 이전 방식은 정적 HTML(=검색엔진이 보는 것)과
 * 화면이 어긋나게 했으므로 제거했다. 언어 전환은 LanguageSwitcher 가 반대 로케일 URL 로 이동한다.
 */
export function LocaleProvider({
  initialLocale = DEFAULT_LOCALE,
  children,
}: {
  initialLocale?: Locale;
  children: ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem(STORAGE_KEY, newLocale);
    } catch {
      // private mode 등 — 저장 실패는 무시
    }
  };

  const value: LocaleContextValue = {
    locale,
    setLocale,
    t: (tr) => t(tr, locale),
    tf: (tr, vars) => tf(tr, locale, vars),
    href: (path) => localePath(path, locale),
  };

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
