"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native"
import { colors } from "@/constants/colors"
import { typography } from "@/constants/typography"
import { layout } from "@/constants/layout"
import { useSettingsStore } from "@/store/settings-store"
import { useColorScheme } from "react-native"
import { useTranslation } from "@/hooks/use-translation"
import { Lock, Fingerprint } from "lucide-react-native"
import * as LocalAuthentication from "expo-local-authentication"

interface AppLockScreenProps {
  onUnlock: () => void
}

export const AppLockScreen: React.FC<AppLockScreenProps> = ({ onUnlock }) => {
  const { theme, pinLock, biometricLock, pin } = useSettingsStore()
  const colorScheme = useColorScheme()
  const { t } = useTranslation()

  const [pinInput, setPinInput] = useState("")
  const [hasBiometrics, setHasBiometrics] = useState(false)

  // Determine which theme to use
  const activeTheme = theme === "system" ? colorScheme || "light" : theme

  const isDarkMode = activeTheme === "dark"

  // Check if device supports biometrics
  useEffect(() => {
    const checkBiometrics = async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync()
      const enrolled = await LocalAuthentication.isEnrolledAsync()
      setHasBiometrics(compatible && enrolled)

      // If biometric lock is enabled and device supports it, authenticate immediately
      if (biometricLock && compatible && enrolled) {
        authenticateWithBiometrics()
      }
    }

    checkBiometrics()
  }, [biometricLock])

  const authenticateWithBiometrics = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: t("Authenticate to unlock"),
        fallbackLabel: t("Use PIN"),
        cancelLabel: t("Cancel"),
      })

      if (result.success) {
        onUnlock()
      }
    } catch (error) {
      console.error("Biometric authentication error:", error)
    }
  }

  const handlePinDigit = (digit: string) => {
    if (pinInput.length < 4) {
      const newPin = pinInput + digit
      setPinInput(newPin)

      // Check if PIN is complete
      if (newPin.length === 4) {
        if (newPin === pin) {
          onUnlock()
        } else {
          Alert.alert(t("Incorrect PIN"), t("Please try again"))
          setPinInput("")
        }
      }
    }
  }

  const handlePinDelete = () => {
    if (pinInput.length > 0) {
      setPinInput(pinInput.slice(0, -1))
    }
  }

  const renderPinDots = () => {
    const dots = []
    for (let i = 0; i < 4; i++) {
      dots.push(
        <View
          key={i}
          style={[
            styles.pinDot,
            i < pinInput.length && styles.pinDotFilled,
            isDarkMode && styles.pinDotDark,
            i < pinInput.length && isDarkMode && styles.pinDotFilledDark,
          ]}
        />,
      )
    }
    return dots
  }

  const renderPinPad = () => {
    const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "delete"]

    return (
      <View style={styles.pinPadContainer}>
        {digits.map((digit, index) => {
          if (digit === "") {
            return <View key={index} style={styles.pinPadButton} />
          }

          if (digit === "delete") {
            return (
              <TouchableOpacity
                key={index}
                style={[styles.pinPadButton, isDarkMode && styles.pinPadButtonDark]}
                onPress={handlePinDelete}
              >
                <Text style={[styles.pinPadButtonText, isDarkMode && styles.pinPadButtonTextDark]}>⌫</Text>
              </TouchableOpacity>
            )
          }

          return (
            <TouchableOpacity
              key={index}
              style={[styles.pinPadButton, isDarkMode && styles.pinPadButtonDark]}
              onPress={() => handlePinDigit(digit)}
            >
              <Text style={[styles.pinPadButtonText, isDarkMode && styles.pinPadButtonTextDark]}>{digit}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <View style={styles.content}>
        <View style={styles.lockIconContainer}>
          <Lock size={48} color={colors.primary} />
        </View>

        <Text style={[styles.title, isDarkMode && styles.titleDark]}>{t("App Locked")}</Text>

        <Text style={[styles.subtitle, isDarkMode && styles.subtitleDark]}>
          {pinLock ? t("Enter your PIN to unlock") : t("Authenticate to unlock")}
        </Text>

        {pinLock && (
          <>
            <View style={styles.pinDotsContainer}>{renderPinDots()}</View>

            {renderPinPad()}
          </>
        )}

        {biometricLock && hasBiometrics && (
          <TouchableOpacity
            style={[styles.biometricButton, isDarkMode && styles.biometricButtonDark]}
            onPress={authenticateWithBiometrics}
          >
            <Fingerprint size={32} color={colors.primary} />
            <Text style={[styles.biometricButtonText, isDarkMode && styles.biometricButtonTextDark]}>
              {t("Use Biometrics")}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  containerDark: {
    backgroundColor: colors.darkBackground,
  },
  content: {
    width: "100%",
    alignItems: "center",
    padding: layout.spacing.xl,
  },
  lockIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.highlight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: layout.spacing.lg,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: layout.spacing.sm,
  },
  titleDark: {
    color: colors.darkText,
  },
  subtitle: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    marginBottom: layout.spacing.xl,
    textAlign: "center",
  },
  subtitleDark: {
    color: colors.darkTextSecondary,
  },
  pinDotsContainer: {
    flexDirection: "row",
    marginBottom: layout.spacing.xl,
  },
  pinDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.textSecondary,
    marginHorizontal: layout.spacing.xs,
  },
  pinDotDark: {
    borderColor: colors.darkTextSecondary,
  },
  pinDotFilled: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pinDotFilledDark: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pinPadContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "80%",
    maxWidth: 300,
  },
  pinPadButton: {
    width: "33%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 40,
    margin: layout.spacing.xs,
  },
  pinPadButtonDark: {
    backgroundColor: colors.darkCard,
  },
  pinPadButtonText: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.medium,
    color: colors.text,
  },
  pinPadButtonTextDark: {
    color: colors.darkText,
  },
  biometricButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.highlight,
    borderRadius: layout.borderRadius.md,
    padding: layout.spacing.md,
    marginTop: layout.spacing.xl,
  },
  biometricButtonDark: {
    backgroundColor: colors.darkHighlight,
  },
  biometricButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.primary,
    marginLeft: layout.spacing.sm,
  },
  biometricButtonTextDark: {
    color: colors.primary,
  },
})
