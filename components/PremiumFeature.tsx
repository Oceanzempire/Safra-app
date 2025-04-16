import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import { colors } from "@/constants/colors"
import { typography } from "@/constants/typography"
import { layout } from "@/constants/layout"
import { Button } from "./Button"

interface PremiumFeatureProps {
  title: string
  description: string
  icon: React.ReactNode
  buttonLabel: string
  onButtonPress: () => void
  isDarkMode?: boolean
}

export const PremiumFeature: React.FC<PremiumFeatureProps> = ({
  title,
  description,
  icon,
  buttonLabel,
  onButtonPress,
  isDarkMode = false,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>{icon}</View>

        <Text style={[styles.title, isDarkMode && styles.titleDark]}>{title}</Text>

        <Text style={[styles.description, isDarkMode && styles.descriptionDark]}>{description}</Text>

        <Button title={buttonLabel} onPress={onButtonPress} style={styles.button} isDarkMode={isDarkMode} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: layout.spacing.lg,
  },
  content: {
    alignItems: "center",
    maxWidth: 400,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.highlight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: layout.spacing.lg,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    textAlign: "center",
    marginBottom: layout.spacing.md,
  },
  titleDark: {
    color: colors.darkText,
  },
  description: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: layout.spacing.xl,
    lineHeight: 24,
  },
  descriptionDark: {
    color: colors.darkTextSecondary,
  },
  button: {
    minWidth: 200,
  },
})
