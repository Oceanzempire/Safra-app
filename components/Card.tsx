import type React from "react"
import { View, StyleSheet, type ViewStyle } from "react-native"
import { colors } from "@/constants/colors"
import { layout } from "@/constants/layout"

interface CardProps {
  children: React.ReactNode
  style?: ViewStyle
  variant?: "default" | "elevated" | "outlined"
}

export const Card: React.FC<CardProps> = ({ children, style, variant = "default" }) => {
  return <View style={[styles.card, styles[variant], style]}>{children}</View>
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: layout.borderRadius.lg,
    padding: layout.spacing.md,
  },
  default: {
    // Default styles are already in card
  },
  elevated: {
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  outlined: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.border,
  },
})
