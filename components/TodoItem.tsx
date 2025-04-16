import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { CheckCircle, Circle, Trash2, Clock } from "lucide-react-native"
import type { Todo } from "@/types"
import { colors } from "@/constants/colors"
import { typography } from "@/constants/typography"
import { layout } from "@/constants/layout"
import { formatDate } from "@/utils/date"

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onPress: (todo: Todo) => void
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onPress }) => {
  const { id, title, description, status, dueDate, priority } = todo

  const priorityColors = {
    low: colors.success,
    medium: colors.secondary,
    high: colors.danger,
  }

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(todo)} activeOpacity={0.7}>
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => onToggle(id)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        {status === "completed" ? (
          <CheckCircle size={24} color={colors.primary} />
        ) : (
          <Circle size={24} color={colors.primary} />
        )}
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={[styles.title, status === "completed" && styles.completedTitle]} numberOfLines={1}>
          {title}
        </Text>

        {description ? (
          <Text style={styles.description} numberOfLines={1}>
            {description}
          </Text>
        ) : null}

        <View style={styles.metaContainer}>
          {dueDate && (
            <View style={styles.metaItem}>
              <Clock size={14} color={colors.textSecondary} />
              <Text style={styles.metaText}>{formatDate(dueDate)}</Text>
            </View>
          )}

          {priority && (
            <View style={[styles.priorityBadge, { backgroundColor: priorityColors[priority] }]}>
              <Text style={styles.priorityText}>{priority.charAt(0).toUpperCase() + priority.slice(1)}</Text>
            </View>
          )}
        </View>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(id)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Trash2 size={20} color={colors.danger} />
      </TouchableOpacity>
    </TouchableOpacity>
  )
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
    marginBottom: 2,
  },
  completedTitle: {
    textDecorationLine: "line-through",
    color: colors.textSecondary,
  },
  description: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginBottom: layout.spacing.xs,
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: layout.spacing.xs,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: layout.spacing.sm,
  },
  metaText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  priorityBadge: {
    paddingHorizontal: layout.spacing.xs,
    paddingVertical: 2,
    borderRadius: layout.borderRadius.sm,
  },
  priorityText: {
    fontSize: typography.sizes.xs,
    color: colors.background,
    fontWeight: typography.weights.medium,
  },
  deleteButton: {
    marginLeft: layout.spacing.sm,
  },
})
