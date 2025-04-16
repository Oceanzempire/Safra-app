import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Platform, NativeModules } from "react-native"

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

// Get initial language
const initialLanguage = getLanguageCode(getDeviceLanguage())

interface SettingsState {
  theme: "light" | "dark" | "system"
  language: string
  notificationsEnabled: boolean
  locationTracking: boolean
  autoBackup: boolean
  firstLaunch: boolean
  hasCompletedOnboarding: boolean
  isFirstLaunch: boolean
  pinLock: boolean
  biometricLock: boolean
  pin: string
  cloudSync: boolean
  cloudProvider?: "google" | "icloud" | "dropbox" | "onedrive"
  updateSettings: (settings: Partial<SettingsState>) => void
  completeOnboarding: () => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "system",
      language: initialLanguage,
      notificationsEnabled: true,
      locationTracking: false,
      autoBackup: false,
      firstLaunch: true,
      hasCompletedOnboarding: false,
      isFirstLaunch: true,
      pinLock: false,
      biometricLock: false,
      pin: "",
      cloudSync: false,
      cloudProvider: undefined,
      updateSettings: (settings) => set((state) => ({ ...state, ...settings })),
      completeOnboarding: () => set({ hasCompletedOnboarding: true, isFirstLaunch: false }),
    }),
    {
      name: "safra-settings",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)
