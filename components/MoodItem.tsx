import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Smile, Frown, Meh, Heart, AlertTriangle } from "lucide-react-native"
import { colors } from "@/constants/colors"
import { typography } from "@/constants/typography"
import { layout } from "@/constants/layout"

type MoodType = "happy" | "neutral" | "sad" | "anxious" | "excited"

interface MoodItemProps {
  mood: {
    id: string
    type: MoodType
    note?: string
    timestamp: number
  }
  onPress?: () => void
}

export const MoodItem: React.FC<MoodItemProps> = ({ mood, onPress }) => {
  const getMoodIcon = () => {
    switch (mood.type) {
      case "happy":
        return <Smile size={24} color={colors.success} />
      case "neutral":
        return <Meh size={24} color={colors.warning} />
      case "sad":
        return <Frown size={24} color={colors.danger} />
      case "anxious":
        return <AlertTriangle size={24} color={colors.secondary} />
      case "excited":
        return <Heart size={24} color={colors.primary} />
      default:
        return <Meh size={24} color={colors.warning} />
    }
  }

  const getMoodLabel = () => {
    switch (mood.type) {
      case "happy":
        return "Happy"
      case "neutral":
        return "Neutral"
      case "sad":
        return "Sad"
      case "anxious":
        return "Anxious"
      case "excited":
        return "Excited"
      default:
        return "Unknown"
    }
  }

  const getMoodColor = () => {
    switch (mood.type) {
      case "happy":
        return colors.success
      case "neutral":
        return colors.warning
      case "sad":
        return colors.danger
      case "anxious":
        return colors.secondary
      case "excited":
        return colors.primary
      default:
        return colors.textSecondary
    }
  }

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.iconContainer, { backgroundColor: `${getMoodColor()}20` }]}>{getMoodIcon()}</View>
      <View style={styles.content}>
        <Text style={styles.moodLabel}>{getMoodLabel()}</Text>
        {mood.note && (
          <Text style={styles.note} numberOfLines={1}>
            {mood.note}
          </Text>
        )}
        <Text style={styles.timestamp}>
          {new Date(mood.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: layout.spacing.md,
    backgroundColor: colors.card,
    borderRadius: layout.borderRadius.md,
    marginBottom: layout.spacing.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: layout.spacing.md,
  },
  content: {
    flex: 1,
  },
  moodLabel: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.text,
    marginBottom: 2,
  },
  note: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
})
