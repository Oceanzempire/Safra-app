"use client"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, Platform } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Stack, useRouter } from "expo-router"
import {
  Moon,
  Sun,
  Globe,
  Bell,
  Lock,
  CloudUpload,
  HelpCircle,
  Info,
  LogOut,
  Shield,
  CreditCard,
  User,
} from "lucide-react-native"
import { colors } from "@/constants/colors"
import { typography } from "@/constants/typography"
import { layout } from "@/constants/layout"
import { useSettingsStore } from "@/store/settings-store"
import { useAuthStore } from "@/store/auth-store"
import { useColorScheme } from "react-native"
import { Header } from "@/components/Header"
import { useTranslation } from "@/hooks/use-translation"

export default function SettingsScreen() {
  const { theme, language, notificationsEnabled, pinLock, biometricLock, cloudSync, updateSettings } =
    useSettingsStore()
  const { isGuest, user, signOut } = useAuthStore()
  const colorScheme = useColorScheme()
  const router = useRouter()
  const { t, changeLanguage } = useTranslation()

  // Determine which theme to use
  const activeTheme = theme === "system" ? colorScheme || "light" : theme

  const isDarkMode = activeTheme === "dark"

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    updateSettings({ theme: newTheme })
  }

  const handleLanguageChange = () => {
    Alert.alert(t("Select Language"), t("Choose your preferred language"), [
      {
        text: "English",
        onPress: () => {
          updateSettings({ language: "en" })
          changeLanguage("en")
          Alert.alert(t("Language Changed"), "The language has been set to English")
        },
      },
      {
        text: "Français",
        onPress: () => {
          updateSettings({ language: "fr" })
          changeLanguage("fr")
          Alert.alert("Langue modifiée", "La langue a été définie sur Français")
        },
      },
      {
        text: "Español",
        onPress: () => {
          updateSettings({ language: "es" })
          changeLanguage("es")
          Alert.alert("Idioma cambiado", "El idioma se ha establecido en Español")
        },
      },
      {
        text: "Deutsch",
        onPress: () => {
          updateSettings({ language: "de" })
          changeLanguage("de")
          Alert.alert("Sprache geändert", "Die Sprache wurde auf Deutsch eingestellt")
        },
      },
      {
        text: "中文",
        onPress: () => {
          updateSettings({ language: "zh" })
          changeLanguage("zh")
          Alert.alert("语言已更改", "语言已设置为中文")
        },
      },
      {
        text: "العربية",
        onPress: () => {
          updateSettings({ language: "ar" })
          changeLanguage("ar")
          Alert.alert("تم تغيير اللغة", "تم ضبط اللغة على العربية")
        },
      },
      {
        text: "Русский",
        onPress: () => {
          updateSettings({ language: "ru" })
          changeLanguage("ru")
          Alert.alert("Язык изменен", "Язык установлен на русский")
        },
      },
      { text: t("Cancel"), style: "cancel" },
    ])
  }

  const handleSignOut = () => {
    Alert.alert(t("Sign Out"), t("Are you sure you want to sign out?"), [
      { text: t("Cancel"), style: "cancel" },
      {
        text: t("Sign Out"),
        onPress: () => {
          signOut()
          router.replace("/auth/choice")
        },
      },
    ])
  }

  const handleToggleNotifications = (value: boolean) => {
    updateSettings({ notificationsEnabled: value })
  }

  const handleToggleCloudSync = (value: boolean) => {
    // If trying to enable cloud sync
    if (value) {
      // If user is not logged in (guest mode)
      if (isGuest) {
        Alert.alert(
          t("Sign in Required"),
          t("You need to sign in to use cloud sync. Would you like to sign in or create an account?"),
          [
            { text: t("Cancel"), style: "cancel" },
            {
              text: t("Sign In"),
              onPress: () => router.push("/auth/sign-in?returnTo=premium/checkout"),
            },
            {
              text: t("Sign Up"),
              onPress: () => router.push("/auth/sign-up?returnTo=premium/checkout"),
            },
          ],
        )
        return
      }

      // If user is logged in but not premium
      if (!user?.isPremium) {
        Alert.alert(t("Premium Feature"), t("Cloud sync is only available for users with a premium subscription."), [
          { text: t("Cancel"), style: "cancel" },
          {
            text: t("Upgrade"),
            onPress: () => router.push("/premium/checkout"),
          },
        ])
        return
      }
    }

    // If all conditions are met or turning off cloud sync
    updateSettings({ cloudSync: value })
  }

  const getLanguageName = (code: string) => {
    const languages: Record<string, string> = {
      en: "English",
      fr: "Français",
      es: "Español",
      de: "Deutsch",
      zh: "中文",
      ar: "العربية",
      ru: "Русский",
    }

    return languages[code] || "English"
  }

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]} edges={["right", "left"]}>
      <Header title={t("Settings")} />

      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}>{t("Account")}</Text>

          <View style={[styles.card, isDarkMode && styles.cardDark]}>
            <TouchableOpacity style={styles.settingItem} onPress={() => (isGuest ? router.push("/auth/index") : {})}>
              <View style={styles.settingLeft}>
                <User size={24} color={colors.primary} />
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingTitle, isDarkMode && styles.settingTitleDark]}>
                    {isGuest ? t("Guest Mode") : user?.name || user?.email}
                  </Text>
                  <Text style={[styles.settingDescription, isDarkMode && styles.settingDescriptionDark]}>
                    {isGuest ? t("Sign in to sync your data") : t("Manage your account")}
                  </Text>
                </View>
              </View>

              {isGuest && (
                <TouchableOpacity
                  style={[styles.upgradeButton, isDarkMode && styles.upgradeButtonDark]}
                  onPress={() => router.push("/auth/sign-in")}
                >
                  <Text style={styles.upgradeButtonText}>{t("Sign In")}</Text>
                </TouchableOpacity>
              )}

              {!isGuest && (
                <TouchableOpacity
                  style={[styles.signOutButton, isDarkMode && styles.signOutButtonDark]}
                  onPress={handleSignOut}
                >
                  <LogOut size={20} color={isDarkMode ? colors.darkText : colors.text} />
                </TouchableOpacity>
              )}
            </TouchableOpacity>

            {!isGuest && (
              <TouchableOpacity style={styles.settingItem} onPress={() => router.push("/premium/checkout")}>
                <View style={styles.settingLeft}>
                  <CreditCard size={24} color={colors.primary} />
                  <View style={styles.settingTextContainer}>
                    <Text style={[styles.settingTitle, isDarkMode && styles.settingTitleDark]}>
                      {t("Premium Subscription")}
                    </Text>
                    <Text style={[styles.settingDescription, isDarkMode && styles.settingDescriptionDark]}>
                      {t("Unlock all premium features")}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.upgradeButton, isDarkMode && styles.upgradeButtonDark]}
                  onPress={() => router.push("/premium/checkout")}
                >
                  <Text style={styles.upgradeButtonText}>{t("Upgrade")}</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}>{t("Appearance")}</Text>

          <View style={[styles.card, isDarkMode && styles.cardDark]}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                {isDarkMode ? <Moon size={24} color={colors.primary} /> : <Sun size={24} color={colors.primary} />}
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingTitle, isDarkMode && styles.settingTitleDark]}>{t("Theme")}</Text>
                  <Text style={[styles.settingDescription, isDarkMode && styles.settingDescriptionDark]}>
                    {theme === "light" ? t("Light") : theme === "dark" ? t("Dark") : t("System")}
                  </Text>
                </View>
              </View>

              <View style={styles.themeButtons}>
                <TouchableOpacity
                  style={[
                    styles.themeButton,
                    theme === "light" && styles.themeButtonActive,
                    isDarkMode && styles.themeButtonDark,
                    theme === "light" && isDarkMode && styles.themeButtonActiveDark,
                  ]}
                  onPress={() => handleThemeChange("light")}
                >
                  <Sun
                    size={20}
                    color={
                      theme === "light" ? colors.primary : isDarkMode ? colors.darkTextSecondary : colors.textSecondary
                    }
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.themeButton,
                    theme === "dark" && styles.themeButtonActive,
                    isDarkMode && styles.themeButtonDark,
                    theme === "dark" && isDarkMode && styles.themeButtonActiveDark,
                  ]}
                  onPress={() => handleThemeChange("dark")}
                >
                  <Moon
                    size={20}
                    color={
                      theme === "dark" ? colors.primary : isDarkMode ? colors.darkTextSecondary : colors.textSecondary
                    }
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.themeButton,
                    theme === "system" && styles.themeButtonActive,
                    isDarkMode && styles.themeButtonDark,
                    theme === "system" && isDarkMode && styles.themeButtonActiveDark,
                  ]}
                  onPress={() => handleThemeChange("system")}
                >
                  <Text
                    style={[
                      styles.systemText,
                      theme === "system" && styles.systemTextActive,
                      isDarkMode && styles.systemTextDark,
                      theme === "system" && isDarkMode && styles.systemTextActiveDark,
                    ]}
                  >
                    {t("Auto")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.settingItem} onPress={handleLanguageChange}>
              <View style={styles.settingLeft}>
                <Globe size={24} color={colors.primary} />
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingTitle, isDarkMode && styles.settingTitleDark]}>{t("Language")}</Text>
                  <Text style={[styles.settingDescription, isDarkMode && styles.settingDescriptionDark]}>
                    {getLanguageName(language)}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.changeButton, isDarkMode && styles.changeButtonDark]}
                onPress={handleLanguageChange}
              >
                <Text style={[styles.changeButtonText, isDarkMode && styles.changeButtonTextDark]}>{t("Change")}</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}>{t("Preferences")}</Text>

          <View style={[styles.card, isDarkMode && styles.cardDark]}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Bell size={24} color={colors.primary} />
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingTitle, isDarkMode && styles.settingTitleDark]}>{t("Notifications")}</Text>
                  <Text style={[styles.settingDescription, isDarkMode && styles.settingDescriptionDark]}>
                    {notificationsEnabled ? t("Enabled") : t("Disabled")}
                  </Text>
                </View>
              </View>

              <Switch
                value={notificationsEnabled}
                onValueChange={handleToggleNotifications}
                trackColor={{ false: "#767577", true: colors.primary }}
                thumbColor={Platform.OS === "ios" ? "#FFFFFF" : notificationsEnabled ? "#FFFFFF" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
              />
            </View>

            <TouchableOpacity style={styles.settingItem} onPress={() => router.push("/settings/security")}>
              <View style={styles.settingLeft}>
                <Lock size={24} color={colors.primary} />
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingTitle, isDarkMode && styles.settingTitleDark]}>{t("Security")}</Text>
                  <Text style={[styles.settingDescription, isDarkMode && styles.settingDescriptionDark]}>
                    {pinLock || biometricLock ? t("App lock enabled") : t("App lock disabled")}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.changeButton, isDarkMode && styles.changeButtonDark]}
                onPress={() => router.push("/settings/security")}
              >
                <Text style={[styles.changeButtonText, isDarkMode && styles.changeButtonTextDark]}>{t("Manage")}</Text>
              </TouchableOpacity>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem} onPress={() => router.push("/vault")}>
              <View style={styles.settingLeft}>
                <Shield size={24} color={colors.primary} />
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingTitle, isDarkMode && styles.settingTitleDark]}>{t("Secure Vault")}</Text>
                  <Text style={[styles.settingDescription, isDarkMode && styles.settingDescriptionDark]}>
                    {t("Store sensitive information")}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.changeButton, isDarkMode && styles.changeButtonDark]}
                onPress={() => router.push("/vault")}
              >
                <Text style={[styles.changeButtonText, isDarkMode && styles.changeButtonTextDark]}>{t("Open")}</Text>
              </TouchableOpacity>
            </TouchableOpacity>

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <CloudUpload size={24} color={colors.primary} />
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingTitle, isDarkMode && styles.settingTitleDark]}>{t("Cloud Sync")}</Text>
                  <Text style={[styles.settingDescription, isDarkMode && styles.settingDescriptionDark]}>
                    {cloudSync ? t("Enabled") : t("Disabled")}
                  </Text>
                </View>
              </View>

              <Switch
                value={cloudSync}
                onValueChange={handleToggleCloudSync}
                trackColor={{ false: "#767577", true: colors.primary }}
                thumbColor={Platform.OS === "ios" ? "#FFFFFF" : cloudSync ? "#FFFFFF" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
              />
            </View>

            {cloudSync && (
              <TouchableOpacity style={styles.settingItem} onPress={() => router.push("/cloud-storage")}>
                <View style={styles.settingLeft}>
                  <CloudUpload size={24} color={colors.primary} />
                  <View style={styles.settingTextContainer}>
                    <Text style={[styles.settingTitle, isDarkMode && styles.settingTitleDark]}>
                      {t("Cloud Storage")}
                    </Text>
                    <Text style={[styles.settingDescription, isDarkMode && styles.settingDescriptionDark]}>
                      {t("Manage cloud storage")}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.changeButton, isDarkMode && styles.changeButtonDark]}
                  onPress={() => router.push("/cloud-storage")}
                >
                  <Text style={[styles.changeButtonText, isDarkMode && styles.changeButtonTextDark]}>
                    {t("Manage")}
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}>{t("About")}</Text>

          <View style={[styles.card, isDarkMode && styles.cardDark]}>
            <TouchableOpacity style={styles.settingItem} onPress={() => router.push("/about")}>
              <View style={styles.settingLeft}>
                <Info size={24} color={colors.primary} />
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingTitle, isDarkMode && styles.settingTitleDark]}>{t("About Us")}</Text>
                  <Text style={[styles.settingDescription, isDarkMode && styles.settingDescriptionDark]}>
                    {t("Learn more about Safra")}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.changeButton, isDarkMode && styles.changeButtonDark]}
                onPress={() => router.push("/about")}
              >
                <Text style={[styles.changeButtonText, isDarkMode && styles.changeButtonTextDark]}>{t("View")}</Text>
              </TouchableOpacity>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem} onPress={() => router.push("/help")}>
              <View style={styles.settingLeft}>
                <HelpCircle size={24} color={colors.primary} />
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingTitle, isDarkMode && styles.settingTitleDark]}>
                    {t("Help & Support")}
                  </Text>
                  <Text style={[styles.settingDescription, isDarkMode && styles.settingDescriptionDark]}>
                    {t("Get help with Safra")}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.changeButton, isDarkMode && styles.changeButtonDark]}
                onPress={() => router.push("/help")}
              >
                <Text style={[styles.changeButtonText, isDarkMode && styles.changeButtonTextDark]}>{t("View")}</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, isDarkMode && styles.versionTextDark]}>{t("Version")} 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  containerDark: {
    backgroundColor: colors.darkBackground,
  },
  content: {
    flex: 1,
    padding: layout.spacing.md,
  },
  section: {
    marginBottom: layout.spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: layout.spacing.sm,
    paddingHorizontal: layout.spacing.sm,
  },
  sectionTitleDark: {
    color: colors.darkText,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: layout.borderRadius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardDark: {
    backgroundColor: colors.darkCard,
    borderColor: colors.darkBorder,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingTextContainer: {
    marginLeft: layout.spacing.md,
    flex: 1,
  },
  settingTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.text,
    marginBottom: 2,
  },
  settingTitleDark: {
    color: colors.darkText,
  },
  settingDescription: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  settingDescriptionDark: {
    color: colors.darkTextSecondary,
  },
  themeButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  themeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.highlight,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: layout.spacing.xs,
  },
  themeButtonDark: {
    backgroundColor: colors.darkHighlight,
  },
  themeButtonActive: {
    backgroundColor: colors.primary + "20",
    borderWidth: 1,
    borderColor: colors.primary,
  },
  themeButtonActiveDark: {
    backgroundColor: colors.primary + "20",
    borderWidth: 1,
    borderColor: colors.primary,
  },
  systemText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
  },
  systemTextDark: {
    color: colors.darkTextSecondary,
  },
  systemTextActive: {
    color: colors.primary,
  },
  systemTextActiveDark: {
    color: colors.primary,
  },
  changeButton: {
    paddingVertical: layout.spacing.xs,
    paddingHorizontal: layout.spacing.sm,
    borderRadius: layout.borderRadius.sm,
    backgroundColor: colors.highlight,
  },
  changeButtonDark: {
    backgroundColor: colors.darkHighlight,
  },
  changeButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.primary,
  },
  changeButtonTextDark: {
    color: colors.primary,
  },
  versionContainer: {
    alignItems: "center",
    marginVertical: layout.spacing.lg,
  },
  versionText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  versionTextDark: {
    color: colors.darkTextSecondary,
  },
  upgradeButton: {
    paddingVertical: layout.spacing.xs,
    paddingHorizontal: layout.spacing.sm,
    borderRadius: layout.borderRadius.sm,
    backgroundColor: colors.primary,
  },
  upgradeButtonDark: {
    backgroundColor: colors.primary,
  },
  upgradeButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.background,
  },
  signOutButton: {
    padding: layout.spacing.xs,
    borderRadius: layout.borderRadius.sm,
  },
  signOutButtonDark: {
    backgroundColor: "transparent",
  },
})
