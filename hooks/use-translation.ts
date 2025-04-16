"use client"

import { useCallback, useEffect } from "react"
import { Platform, NativeModules } from "react-native"
import { useSettingsStore } from "@/store/settings-store"
import { en } from "@/locales/en"
import { fr } from "@/locales/fr"
import { es } from "@/locales/es"
import { de } from "@/locales/de"
import { zh } from "@/locales/zh"
import { ar } from "@/locales/ar"
import { ru } from "@/locales/ru"

// Get device language
const getDeviceLanguage = (): string => {
  // iOS
  if (Platform.OS === "ios") {
    return (
      NativeModules.SettingsManager?.settings?.AppleLocale ||
      NativeModules.SettingsManager?.settings?.AppleLanguages[0] ||
      "en"
    )
  }
  // Android
  else if (Platform.OS === "android") {
    return NativeModules.I18nManager?.localeIdentifier || "en"
  }
  // Web or default
  return navigator.language || "en"
}

// Get language code from device language
const getLanguageCode = (deviceLanguage: string): string => {
  const code = deviceLanguage.split(/[-_]/)[0] // Extract language code before region

  // Check if the language is supported
  if (["en", "fr", "es", "de", "zh", "ar", "ru"].includes(code)) {
    return code
  }

  return "en" // Default to English
}

export const useTranslation = () => {
  const { language, updateSettings } = useSettingsStore()

  // Initialize language based on device settings if not set
  useEffect(() => {
    if (!language) {
      const deviceLanguage = getDeviceLanguage()
      const languageCode = getLanguageCode(deviceLanguage)
      updateSettings({ language: languageCode })
    }
  }, [language, updateSettings])

  // Get translations based on selected language
  const getTranslations = () => {
    switch (language) {
      case "fr":
        return fr
      case "es":
        return es
      case "de":
        return de
      case "zh":
        return zh
      case "ar":
        return ar
      case "ru":
        return ru
      case "en":
      default:
        return en
    }
  }

  const translations = getTranslations()

  // Translation function
  const t = useCallback(
    (key: string, params?: Record<string, string>) => {
      let translation = translations[key] || key

      // Replace parameters if provided
      if (params) {
        Object.keys(params).forEach((param) => {
          translation = translation.replace(`{{${param}}}`, params[param])
        })
      }

      return translation
    },
    [language, translations],
  )

  // Function to change language
  const changeLanguage = useCallback(
    (newLanguage: string) => {
      updateSettings({ language: newLanguage })
    },
    [updateSettings],
  )

  // Get language name
  const getLanguageName = (code: string) => {
    switch (code) {
      case "en":
        return "English"
      case "fr":
        return "Français"
      case "es":
        return "Español"
      case "de":
        return "Deutsch"
      case "zh":
        return "中文"
      case "ar":
        return "العربية"
      case "ru":
        return "Русский"
      default:
        return code
    }
  }

  // Get all supported languages
  const supportedLanguages = [
    { code: "en", name: "English" },
    { code: "fr", name: "Français" },
    { code: "es", name: "Español" },
    { code: "de", name: "Deutsch" },
    { code: "zh", name: "中文" },
    { code: "ar", name: "العربية" },
    { code: "ru", name: "Русский" },
  ]

  return {
    t,
    language,
    changeLanguage,
    getLanguageName,
    supportedLanguages,
  }
}
