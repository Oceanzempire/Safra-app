"use client"

import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity, Platform } from "react-native"
import { useRouter } from "expo-router"
import { ChevronLeft } from "lucide-react-native"
import { colors } from "@/constants/colors"
import { typography } from "@/constants/typography"
import { layout } from "@/constants/layout"
import { useSettingsStore } from "@/store/settings-store"
import { useColorScheme } from "react-native"

interface HeaderProps {
  title: string
  showBackButton?: boolean
  rightComponent?: React.ReactNode
  leftIcon?: React.ReactNode
  onLeftPress?: () => void
  rightIcon?: React.ReactNode
  onRightPress?: () => void
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  rightComponent,
  leftIcon,
  onLeftPress,
  rightIcon,
  onRightPress,
}) => {
  const router = useRouter()
  const { theme } = useSettingsStore()
  const colorScheme = useColorScheme()

  // Determine which theme to use
  const activeTheme = theme === "system" ? colorScheme || "light" : theme

  const isDarkMode = activeTheme === "dark"

  const handleBackPress = () => {
    if (onLeftPress) {
      onLeftPress()
    } else {
      router.back()
    }
  }

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark, Platform.OS === "ios" && styles.iosContainer]}>
      <View style={styles.leftContainer}>
        {showBackButton && (
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            {leftIcon || <ChevronLeft size={24} color={isDarkMode ? colors.darkText : colors.text} />}
          </TouchableOpacity>
        )}
      </View>

      <Text style={[styles.title, isDarkMode && styles.titleDark]}>{title}</Text>

      <View style={styles.rightContainer}>
        {rightIcon ? (
          <TouchableOpacity style={styles.rightButton} onPress={onRightPress}>
            {rightIcon}
          </TouchableOpacity>
        ) : (
          rightComponent
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: layout.spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  containerDark: {
    backgroundColor: colors.darkBackground,
    borderBottomColor: colors.darkBorder,
  },
  iosContainer: {
    height: 44,
  },
  leftContainer: {
    width: 40,
    alignItems: "flex-start",
  },
  backButton: {
    padding: layout.spacing.xs,
  },
  title: {
    flex: 1,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
    textAlign: "center",
  },
  titleDark: {
    color: colors.darkText,
  },
  rightContainer: {
    width: 40,
    alignItems: "flex-end",
  },
  rightButton: {
    padding: layout.spacing.xs,
  },
})
