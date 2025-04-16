import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import { colors } from "@/constants/colors"
import { typography } from "@/constants/typography"
import { layout } from "@/constants/layout"
import { Button } from "./Button"

interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ReactNode
  actionLabel?: string
  onAction?: () => void
  isDarkMode?: boolean
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  isDarkMode = false,
}) => {
  return (
    <View style={styles.container}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}

      <Text style={[styles.title, isDarkMode && styles.titleDark]}>{title}</Text>

      {description && <Text style={[styles.description, isDarkMode && styles.descriptionDark]}>{description}</Text>}

      {actionLabel && onAction && (
        <Button title={actionLabel} onPress={onAction} style={styles.actionButton} isDarkMode={isDarkMode} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: layout.spacing.xl,
  },
  iconContainer: {
    marginBottom: layout.spacing.lg,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    textAlign: "center",
    marginBottom: layout.spacing.sm,
  },
  titleDark: {
    color: colors.darkText,
  },
  description: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: layout.spacing.xl,
  },
  descriptionDark: {
    color: colors.darkTextSecondary,
  },
  actionButton: {
    minWidth: 150,
  },
})
