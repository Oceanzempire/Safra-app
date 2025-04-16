import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native"
import { FileText, File } from "lucide-react-native"
import type { Document } from "@/types"
import { colors } from "@/constants/colors"
import { typography } from "@/constants/typography"
import { layout } from "@/constants/layout"
import { formatDate } from "@/utils/date"

interface DocumentItemProps {
  document: Document
  onPress: (document: Document) => void
}

export const DocumentItem: React.FC<DocumentItemProps> = ({ document, onPress }) => {
  const { title, description, type, category, createdAt, uri } = document

  const renderIcon = () => {
    switch (type) {
      case "image":
        return (
          <View style={styles.thumbnailContainer}>
            <Image source={{ uri }} style={styles.thumbnail} />
          </View>
        )
      case "pdf":
        return <FileText size={24} color={colors.danger} />
      default:
        return <File size={24} color={colors.primary} />
    }
  }

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "id":
        return "ID Document"
      case "medical":
        return "Medical Record"
      case "insurance":
        return "Insurance"
      default:
        return "Other"
    }
  }

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(document)} activeOpacity={0.7}>
      <View style={styles.iconContainer}>{renderIcon()}</View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        {description ? (
          <Text style={styles.description} numberOfLines={1}>
            {description}
          </Text>
        ) : null}

        <View style={styles.footer}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{getCategoryLabel(category)}</Text>
          </View>

          <Text style={styles.date}>{formatDate(createdAt)}</Text>
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
  },
  iconContainer: {
    marginRight: layout.spacing.md,
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
  },
  thumbnailContainer: {
    width: 40,
    height: 40,
    borderRadius: layout.borderRadius.sm,
    overflow: "hidden",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
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
  description: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginBottom: layout.spacing.xs,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: layout.spacing.xs,
  },
  categoryBadge: {
    backgroundColor: colors.highlight,
    borderRadius: layout.borderRadius.sm,
    paddingHorizontal: layout.spacing.xs,
    paddingVertical: 2,
  },
  categoryText: {
    fontSize: typography.sizes.xs,
    color: colors.primary,
    fontWeight: typography.weights.medium,
  },
  date: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
})
