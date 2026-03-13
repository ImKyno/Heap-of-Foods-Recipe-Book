import { useEffect } from "react";
import { useTranslation } from "@/lib/i18n";

export function usePageTitle(title: string) {
  const { t, locale } = useTranslation();

  useEffect(() => {
    document.title = `${t("main.title")} - ${title}`;
  }, [locale, title]);
}