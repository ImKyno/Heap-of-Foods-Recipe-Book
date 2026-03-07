"use client";

import Settings from "./settings";
import { useTranslation, type Locale } from "@/lib/i18n";

export default function ClientSettings() {
  const { locale, setLocale } = useTranslation();

  return (
    <Settings
      initialLanguage={locale}
      onLanguageChange={(lang: Locale) => setLocale(lang)}
    />
  );
}