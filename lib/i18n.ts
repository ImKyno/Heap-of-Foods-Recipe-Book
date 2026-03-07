import { useState, useEffect } from "react"
import en from "@/locales/en"
import pt from "@/locales/pt"

export type Locale = "en" | "pt"

const locales = { en, pt }

let currentLocale: Locale = "en"
let listeners: (() => void)[] = []

export function setLocale(locale: Locale) {
  currentLocale = locale
  listeners.forEach((fn) => fn())
}

export function t(path: string): string {
  const keys = path.split(".")
  let result: any = locales[currentLocale]
  for (const key of keys) {
    result = result?.[key]
  }
  return result ?? path
}

// HOOK
export function useTranslation() {
  const [locale, setLocaleState] = useState(currentLocale)

  useEffect(() => {
    const listener = () => setLocaleState(currentLocale)
    listeners.push(listener)
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  }, [])

  return { t, locale, setLocale }
}