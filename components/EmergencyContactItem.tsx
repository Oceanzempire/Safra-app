import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Phone, MessageSquare, Edit2, AlertTriangle } from "lucide-react-native"
import type { EmergencyContact } from "@/types"
import { colors } from "@/constants/colors"
import { typography } from "@/constants/typography"
import { layout } from "@/constants/layout"

interface EmergencyContactItemProps {
  contact: EmergencyContact
  onCall: (phone: string) => void
  onMessage: (phone: string) => void
  onEdit: (contact: EmergencyContact) => void
}

export const EmergencyContactItem: React.FC<EmergencyContactItemProps> = ({ contact, onCall, onMessage, onEdit }) => {
  const { name, phone, relationship, isSOSContact } = contact

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{name}</Text>
          {isSOSContact && (
            <View style={styles.sosBadge}>
              <AlertTriangle size={12} color={colors.background} />
              <Text style={styles.sosText}>SOS</Text>
            </View>
          )}
        </View>

        {relationship && <Text style={styles.relationship}>{relationship}</Text>}

        <Text style={styles.phone}>{phone}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => onCall(phone)}>
          <Phone size={20} color={colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => onMessage(phone)}>
          <MessageSquare size={20} color={colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => onEdit(contact)}>
          <Edit2 size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
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
  content: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  name: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginRight: layout.spacing.xs,
  },
  sosBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.danger,
    borderRadius: layout.borderRadius.sm,
    paddingHorizontal: layout.spacing.xs,
    paddingVertical: 2,
  },
  sosText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.background,
    marginLeft: 2,
  },
  relationship: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  phone: {
    fontSize: typography.sizes.sm,
    color: colors.primary,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: layout.spacing.xs,
    marginLeft: layout.spacing.xs,
  },
})
