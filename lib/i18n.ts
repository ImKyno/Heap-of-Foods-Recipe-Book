
import { useState, useEffect } from "react"
import en from "@/locales/en"
import pt from "@/locales/pt"

export type Locale = "en" | "pt"

const locales = { en, pt }

let currentLocale: Locale = (() => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("lang")
    if (saved === "en" || saved === "pt") return saved
  }
  return "en"
})()
let listeners: (() => void)[] = []

export function setLocale(locale: Locale) {
  currentLocale = locale
  listeners.forEach((fn) => fn())
}

export function t(path: string, params?: Record<string, string | number>): string {
  const keys = path.split(".")

  let result: any = locales[currentLocale]
  for (const key of keys) {
    result = result?.[key]
  }

  if (result === undefined || result === null) {
    let fallback: any = locales["en"]
    for (const key of keys) {
      fallback = fallback?.[key]
    }
    result = fallback ?? path
  }

  if (typeof result !== "string") return path

  if (params) {
    result = result.replace(/\{\{(\w+)\}\}/g, (_: string, key: string) =>
      params[key] !== undefined ? String(params[key]) : `{{${key}}}`
    )
  }

  return result
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