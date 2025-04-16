"use client"

import React, { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Switch, Alert, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Stack, useRouter } from "expo-router"
import { ArrowLeft, Lock, Key, Eye, EyeOff, Shield, Smartphone } from "lucide-react-native"
import { colors } from "@/constants/colors"
import { typography } from "@/constants/typography"
import { layout } from "@/constants/layout"
import { Card } from "@/components/Card"
import { Button } from "@/components/Button"
import { useAuthStore } from "@/store/auth-store"
import { useTranslation } from "@/hooks/use-translation"

export default function SecurityScreen() {
  const router = useRouter()
  const { user, isGuest } = useAuthStore()
  const { t } = useTranslation()

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

  // Redirect guest users
  React.useEffect(() => {
    if (isGuest) {
      Alert.alert(t("Account Required"), t("You need to create an account to access security settings."), [
        {
          text: t("Go Back"),
          onPress: () => router.back(),
        },
      ])
    }
  }, [isGuest])

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert(t("Error"), t("Please fill in all password fields"))
      return
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(t("Error"), t("New passwords do not match"))
      return
    }

    // In a real app, this would call an API to change the password
    Alert.alert(t("Success"), t("Password changed successfully"))

    // Reset form
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  const handleToggleTwoFactor = (value: boolean) => {
    // In a real app, this would enable/disable 2FA
    setTwoFactorEnabled(value)

    if (value) {
      Alert.alert(
        t("Two-Factor Authentication"),
        t("In a real app, this would guide you through setting up 2FA with an authenticator app."),
      )
    }
  }

  if (isGuest) {
    return null // Don't render anything for guest users
  }

  return (
    <SafeAreaView style={styles.container} edges={["right", "left"]}>
      <Stack.Screen
        options={{
          title: t("Security Settings"),
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Change Password */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("Change Password")}</Text>
          <Card style={styles.card}>
            <View style={styles.inputContainer}>
              <Lock size={20} color={colors.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder={t("Current Password")}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry={!showCurrentPassword}
                placeholderTextColor={colors.textSecondary}
              />
              <TouchableOpacity
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                {showCurrentPassword ? (
                  <EyeOff size={20} color={colors.textSecondary} />
                ) : (
                  <Eye size={20} color={colors.textSecondary} />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Key size={20} color={colors.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder={t("New Password")}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showNewPassword}
                placeholderTextColor={colors.textSecondary}
              />
              <TouchableOpacity
                onPress={() => setShowNewPassword(!showNewPassword)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                {showNewPassword ? (
                  <EyeOff size={20} color={colors.textSecondary} />
                ) : (
                  <Eye size={20} color={colors.textSecondary} />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Key size={20} color={colors.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder={t("Confirm New Password")}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                placeholderTextColor={colors.textSecondary}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} color={colors.textSecondary} />
                ) : (
                  <Eye size={20} color={colors.textSecondary} />
                )}
              </TouchableOpacity>
            </View>

            <Button
              title={t("Change Password")}
              onPress={handleChangePassword}
              disabled={!currentPassword || !newPassword || !confirmPassword}
              style={styles.button}
            />
          </Card>
        </View>

        {/* Two-Factor Authentication */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("Two-Factor Authentication")}</Text>
          <Card style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>{t("Enable 2FA")}</Text>
                <Text style={styles.settingDescription}>{t("Add an extra layer of security to your account")}</Text>
              </View>
              <Switch
                value={twoFactorEnabled}
                onValueChange={handleToggleTwoFactor}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.background}
              />
            </View>

            {twoFactorEnabled && (
              <View style={styles.twoFactorInfo}>
                <View style={styles.twoFactorIconContainer}>
                  <Smartphone size={24} color={colors.primary} />
                </View>
                <Text style={styles.twoFactorText}>
                  {t(
                    "Two-factor authentication is enabled. You'll need to enter a verification code from your authenticator app when signing in.",
                  )}
                </Text>
              </View>
            )}
          </Card>
        </View>

        {/* Account Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("Account Security")}</Text>
          <Card style={styles.card}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                Alert.alert(
                  t("Active Sessions"),
                  t("In a real app, this would show all devices where you are currently logged in."),
                )
              }}
            >
              <Smartphone size={20} color={colors.text} />
              <Text style={styles.menuItemText}>{t("Manage Active Sessions")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, styles.borderTop]}
              onPress={() => {
                Alert.alert(
                  t("Delete Account"),
                  t("Are you sure you want to delete your account? This action cannot be undone."),
                  [
                    { text: t("Cancel"), style: "cancel" },
                    {
                      text: t("Delete Account"),
                      style: "destructive",
                      onPress: () => {
                        // In a real app, this would delete the account
                        Alert.alert(t("Account Deleted"), t("Your account has been deleted."))
                        router.replace("/auth")
                      },
                    },
                  ],
                )
              }}
            >
              <Shield size={20} color={colors.danger} />
              <Text style={[styles.menuItemText, { color: colors.danger }]}>{t("Delete Account")}</Text>
            </TouchableOpacity>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: layout.spacing.md,
    paddingBottom: layout.spacing.xxl,
  },
  section: {
    marginBottom: layout.spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: layout.spacing.sm,
  },
  card: {
    padding: layout.spacing.md,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: layout.borderRadius.md,
    paddingHorizontal: layout.spacing.md,
    marginBottom: layout.spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: typography.sizes.md,
    color: colors.text,
    marginLeft: layout.spacing.sm,
  },
  button: {
    marginTop: layout.spacing.sm,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: layout.spacing.sm,
  },
  settingInfo: {
    flex: 1,
    marginRight: layout.spacing.md,
  },
  settingTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.text,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  twoFactorInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.highlight,
    borderRadius: layout.borderRadius.md,
    padding: layout.spacing.md,
    marginTop: layout.spacing.md,
  },
  twoFactorIconContainer: {
    marginRight: layout.spacing.md,
  },
  twoFactorText: {
    flex: 1,
    fontSize: typography.sizes.sm,
    color: colors.text,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: layout.spacing.md,
  },
  menuItemText: {
    marginLeft: layout.spacing.md,
    fontSize: typography.sizes.md,
    color: colors.text,
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: layout.spacing.md,
    marginTop: layout.spacing.sm,
  },
})
