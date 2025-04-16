import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { FileText, Clock, Lock } from "lucide-react-native"
import type { Note } from "@/types"
import { colors } from "@/constants/colors"
import { typography } from "@/constants/typography"
import { layout } from "@/constants/layout"
import { formatRelativeTime } from "@/utils/date"
import { useTranslation } from "@/hooks/use-translation"

interface NoteItemProps {
  note: Note
  onPress: (note: Note) => void
  isDarkMode?: boolean
}

export const NoteItem: React.FC<NoteItemProps> = ({ note, onPress, isDarkMode = false }) => {
  const { title, content, updatedAt, isEncrypted } = note
  const { t } = useTranslation()

  return (
    <TouchableOpacity
      style={[styles.container, isDarkMode && styles.containerDark]}
      onPress={() => onPress(note)}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <FileText size={24} color={colors.primary} />
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, isDarkMode && styles.titleDark]} numberOfLines={1}>
            {title}
          </Text>

          {isEncrypted && <Lock size={16} color={colors.primary} />}
        </View>

        <Text style={[styles.preview, isDarkMode && styles.previewDark]} numberOfLines={2}>
          {isEncrypted ? t("[Password Protected]") : content}
        </Text>

        <View style={styles.footer}>
          <Clock size={14} color={isDarkMode ? colors.darkTextSecondary : colors.textSecondary} />
          <Text style={[styles.timestamp, isDarkMode && styles.timestampDark]}>{formatRelativeTime(updatedAt)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: layout.borderRadius.md,
    padding: layout.spacing.md,
    marginBottom: layout.spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  containerDark: {
    backgroundColor: colors.darkCard,
    borderColor: colors.darkBorder,
  },
  iconContainer: {
    marginRight: layout.spacing.md,
    paddingTop: layout.spacing.xs,
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: layout.spacing.xs,
  },
  title: {
    flex: 1,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.text,
    marginRight: layout.spacing.xs,
  },
  titleDark: {
    color: colors.darkText,
  },
  preview: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginBottom: layout.spacing.sm,
  },
  previewDark: {
    color: colors.darkTextSecondary,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timestamp: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  timestampDark: {
    color: colors.darkTextSecondary,
  },
})
