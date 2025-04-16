import type React from "react"
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from "react-native"
import { colors } from "@/constants/colors"
import { typography } from "@/constants/typography"
import { layout } from "@/constants/layout"

interface ButtonProps {
  title: string
  onPress: () => void
  variant?: "primary" | "secondary" | "outline" | "danger"
  size?: "small" | "medium" | "large"
  disabled?: boolean
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
  style?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  isDarkMode?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  icon,
  iconPosition = "left",
  style,
  textStyle,
  isDarkMode = false,
}) => {
  const getButtonStyle = () => {
    const buttonStyle: StyleProp<ViewStyle> = [styles.button, styles[`${size}Button`]]

    if (variant === "primary") {
      buttonStyle.push(styles.primaryButton)
    } else if (variant === "secondary") {
      buttonStyle.push(styles.secondaryButton)
    } else if (variant === "outline") {
      buttonStyle.push(styles.outlineButton)
      if (isDarkMode) {
        buttonStyle.push(styles.outlineButtonDark)
      }
    } else if (variant === "danger") {
      buttonStyle.push(styles.dangerButton)
    }

    if (disabled) {
      buttonStyle.push(styles.disabledButton)
      if (variant === "outline" && isDarkMode) {
        buttonStyle.push(styles.disabledOutlineButtonDark)
      }
    }

    return buttonStyle
  }

  const getTextStyle = () => {
    const textStyleArray: StyleProp<TextStyle> = [styles.buttonText, styles[`${size}Text`]]

    if (variant === "primary") {
      textStyleArray.push(styles.primaryText)
    } else if (variant === "secondary") {
      textStyleArray.push(styles.secondaryText)
    } else if (variant === "outline") {
      textStyleArray.push(styles.outlineText)
      if (isDarkMode) {
        textStyleArray.push(styles.outlineTextDark)
      }
    } else if (variant === "danger") {
      textStyleArray.push(styles.dangerText)
    }

    if (disabled) {
      textStyleArray.push(styles.disabledText)
      if (variant === "outline" && isDarkMode) {
        textStyleArray.push(styles.disabledOutlineTextDark)
      }
    }

    return textStyleArray
  }

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "outline" ? (isDarkMode ? colors.darkText : colors.primary) : colors.background}
        />
      ) : (
        <View style={styles.contentContainer}>
          {icon && iconPosition === "left" && <View style={styles.iconLeft}>{icon}</View>}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
          {icon && iconPosition === "right" && <View style={styles.iconRight}>{icon}</View>}
        </View>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: layout.borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  smallButton: {
    paddingVertical: layout.spacing.xs,
    paddingHorizontal: layout.spacing.sm,
  },
  mediumButton: {
    paddingVertical: layout.spacing.sm,
    paddingHorizontal: layout.spacing.md,
  },
  largeButton: {
    paddingVertical: layout.spacing.md,
    paddingHorizontal: layout.spacing.lg,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.primary,
  },
  outlineButtonDark: {
    borderColor: colors.primary,
  },
  dangerButton: {
    backgroundColor: colors.danger,
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledOutlineButtonDark: {
    borderColor: colors.darkTextSecondary,
  },
  buttonText: {
    fontWeight: typography.weights.medium,
    textAlign: "center",
  },
  smallText: {
    fontSize: typography.sizes.sm,
  },
  mediumText: {
    fontSize: typography.sizes.md,
  },
  largeText: {
    fontSize: typography.sizes.lg,
  },
  primaryText: {
    color: colors.background,
  },
  secondaryText: {
    color: colors.background,
  },
  outlineText: {
    color: colors.primary,
  },
  outlineTextDark: {
    color: colors.primary,
  },
  dangerText: {
    color: colors.background,
  },
  disabledText: {
    opacity: 0.7,
  },
  disabledOutlineTextDark: {
    color: colors.darkTextSecondary,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconLeft: {
    marginRight: layout.spacing.xs,
  },
  iconRight: {
    marginLeft: layout.spacing.xs,
  },
})
