import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { CheckCircle, Circle, Settings } from "lucide-react-native"
import type { Habit } from "@/types"
import { colors } from "@/constants/colors"
import { typography } from "@/constants/typography"
import { layout } from "@/constants/layout"

interface HabitItemProps {
  habit: Habit
  onToggleToday: (id: string) => void
  onPress: (habit: Habit) => void
}

export const HabitItem: React.FC<HabitItemProps> = ({ habit, onToggleToday, onPress }) => {
  const { id, title, completedDates } = habit

  const today = new Date().toISOString().split("T")[0]
  const isCompletedToday = completedDates.includes(today)

  // Calculate streak
  const streak = calculateStreak(completedDates)

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(habit)} activeOpacity={0.7}>
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => onToggleToday(id)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        {isCompletedToday ? (
          <CheckCircle size={24} color={colors.primary} />
        ) : (
          <Circle size={24} color={colors.primary} />
        )}
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        <View style={styles.streakContainer}>
          <Text style={styles.streakText}>{streak > 0 ? `${streak} day streak` : "Start your streak today!"}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => onPress(habit)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Settings size={20} color={colors.textSecondary} />
      </TouchableOpacity>
    </TouchableOpacity>
  )
}

// Helper function to calculate streak
const calculateStreak = (completedDates: string[]): number => {
  if (completedDates.length === 0) return 0

  // Sort dates in descending order
  const sortedDates = [...completedDates].sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  const today = new Date().toISOString().split("T")[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0]

  // Check if today or yesterday is completed to count current streak
  const hasRecentActivity = sortedDates[0] === today || sortedDates[0] === yesterday
  if (!hasRecentActivity) return 0

  let streak = 1
  let currentDate = new Date(sortedDates[0])

  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(currentDate)
    prevDate.setDate(prevDate.getDate() - 1)

    const expectedDate = prevDate.toISOString().split("T")[0]
    if (sortedDates[i] === expectedDate) {
      streak++
      currentDate = prevDate
    } else {
      break
    }
  }

  return streak
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: layout.borderRadius.md,
    padding: layout.spacing.md,
    marginBottom: layout.spacing.sm,
  },
  checkbox: {
    marginRight: layout.spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.text,
    marginBottom: layout.spacing.xs,
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  streakText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  settingsButton: {
    marginLeft: layout.spacing.sm,
  },
})
