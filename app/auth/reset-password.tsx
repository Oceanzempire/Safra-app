"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Stack, useRouter } from "expo-router"
import { Mail, ArrowLeft } from "lucide-react-native"
import { colors } from "@/constants/colors"
import { typography } from "@/constants/typography"
import { layout } from "@/constants/layout"
import { Button } from "@/components/Button"
import { resetPassword } from "@/lib/supabase"

export default function ResetPasswordScreen() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleResetPassword = async () => {
    if (!email) return

    try {
      setIsLoading(true)
      await resetPassword(email)
      setIsSuccess(true)
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to send reset password email")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["right", "left", "top"]}>
      <Stack.Screen
        options={{
          title: "Reset Password",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingView}>
        <View style={styles.content}>
          {isSuccess ? (
            <View style={styles.successContainer}>
              <Text style={styles.successTitle}>Check your email</Text>
              <Text style={styles.successText}>
                We've sent a password reset link to {email}. Please check your inbox and follow the instructions.
              </Text>
              <Button title="Back to Sign In" onPress={() => router.replace("/auth")} style={styles.backButton} />
            </View>
          ) : (
            <>
              <Text style={styles.title}>Reset your password</Text>
              <Text style={styles.description}>
                Enter your email address and we'll send you a link to reset your password.
              </Text>

              <View style={styles.inputContainer}>
                <Mail size={20} color={colors.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <Button
                title="Send Reset Link"
                onPress={handleResetPassword}
                loading={isLoading}
                disabled={!email || isLoading}
                style={styles.resetButton}
              />

              <TouchableOpacity style={styles.backLink} onPress={() => router.back()}>
                <Text style={styles.backLinkText}>Back to Sign In</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: layout.spacing.lg,
    justifyContent: "center",
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: layout.spacing.md,
  },
  description: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    marginBottom: layout.spacing.xl,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: layout.borderRadius.md,
    paddingHorizontal: layout.spacing.md,
    marginBottom: layout.spacing.lg,
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
  resetButton: {
    marginBottom: layout.spacing.lg,
  },
  backLink: {
    alignSelf: "center",
  },
  backLinkText: {
    color: colors.primary,
    fontSize: typography.sizes.md,
  },
  successContainer: {
    alignItems: "center",
  },
  successTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.success,
    marginBottom: layout.spacing.md,
  },
  successText: {
    fontSize: typography.sizes.md,
    color: colors.text,
    textAlign: "center",
    marginBottom: layout.spacing.xl,
  },
  backButton: {
    width: "100%",
  },
})
