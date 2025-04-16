"use client"

import { useEffect } from "react"
import { View, Text, StyleSheet } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Stack, useRouter } from "expo-router"
import { colors } from "@/constants/colors"
import { typography } from "@/constants/typography"
import { layout } from "@/constants/layout"
import { useTranslation } from "react-i18next"

export default function AuthScreen() {
  const router = useRouter()
  const { t } = useTranslation()

  useEffect(() => {
    // Redirect to the sign-in page
    router.replace("/auth/sign-in")
  }, [])

  // Return a loading state while redirecting
  return (
    <SafeAreaView style={styles.container} edges={["right", "left", "top"]}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>{t("Redirecting...")}</Text>
      </View>
    </SafeAreaView>
  )

  // const { signIn, signUp, continueAsGuest, isLoading, error, resetError } = useAuthStore()

  // const [isLogin, setIsLogin] = useState(true)
  // const [email, setEmail] = useState("")
  // const [password, setPassword] = useState("")
  // const [showPassword, setShowPassword] = useState(false)

  // // Clear error when switching between login and signup
  // useEffect(() => {
  //   resetError()
  // }, [isLogin])

  // const handleAuth = async () => {
  //   if (isLogin) {
  //     await signIn(email, password)
  //     router.replace("/")
  //   } else {
  //     await signUp(email, password)
  //     router.replace("/")
  //   }
  // }

  // const handleGuestMode = () => {
  //   continueAsGuest()
  //   router.replace("/")
  // }

  // return (
  //   <SafeAreaView style={styles.container} edges={["right", "left", "top"]}>
  //     <Stack.Screen
  //       options={{
  //         headerShown: false,
  //       }}
  //     />

  //     <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingView}>
  //       <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
  //         <View style={styles.header}>
  //           <Text style={styles.title}>Safra</Text>
  //           <Text style={styles.subtitle}>{isLogin ? "Welcome back!" : "Create your account"}</Text>
  //         </View>

  //         <View style={styles.formContainer}>
  //           {error && (
  //             <View style={styles.errorContainer}>
  //               <Text style={styles.errorText}>{error}</Text>
  //             </View>
  //           )}

  //           <View style={styles.inputContainer}>
  //             <Mail size={20} color={colors.textSecondary} />
  //             <TextInput
  //               style={styles.input}
  //               placeholder="Email"
  //               value={email}
  //               onChangeText={setEmail}
  //               autoCapitalize="none"
  //               keyboardType="email-address"
  //               placeholderTextColor={colors.textSecondary}
  //             />
  //           </View>

  //           <View style={styles.inputContainer}>
  //             <Lock size={20} color={colors.textSecondary} />
  //             <TextInput
  //               style={styles.input}
  //               placeholder="Password"
  //               value={password}
  //               onChangeText={setPassword}
  //               secureTextEntry={!showPassword}
  //               placeholderTextColor={colors.textSecondary}
  //             />
  //             <TouchableOpacity
  //               onPress={() => setShowPassword(!showPassword)}
  //               hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
  //             >
  //               {showPassword ? (
  //                 <EyeOff size={20} color={colors.textSecondary} />
  //               ) : (
  //                 <Eye size={20} color={colors.textSecondary} />
  //               )}
  //             </TouchableOpacity>
  //           </View>

  //           {isLogin && (
  //             <TouchableOpacity style={styles.forgotPassword} onPress={() => router.push("/auth/reset-password")}>
  //               <Text style={styles.forgotPasswordText}>Forgot password?</Text>
  //             </TouchableOpacity>
  //           )}

  //           <Button
  //             title={isLogin ? "Sign In" : "Sign Up"}
  //             onPress={handleAuth}
  //             loading={isLoading}
  //             disabled={!email || !password || isLoading}
  //             icon={
  //               isLogin ? (
  //                 <LogIn size={20} color={colors.background} />
  //               ) : (
  //                 <UserPlus size={20} color={colors.background} />
  //               )
  //             }
  //             style={styles.authButton}
  //           />

  //           <View style={styles.divider}>
  //             <View style={styles.dividerLine} />
  //             <Text style={styles.dividerText}>OR</Text>
  //             <View style={styles.dividerLine} />
  //           </View>

  //           <Button title="Continue as Guest" variant="outline" onPress={handleGuestMode} style={styles.guestButton} />
  //         </View>

  //         <View style={styles.footer}>
  //           <Text style={styles.footerText}>{isLogin ? "Don't have an account?" : "Already have an account?"}</Text>
  //           <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
  //             <Text style={styles.footerLink}>{isLogin ? "Sign Up" : "Sign In"}</Text>
  //           </TouchableOpacity>
  //         </View>
  //       </ScrollView>
  //     </KeyboardAvoidingView>
  //   </SafeAreaView>
  // )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: layout.spacing.lg,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: layout.spacing.xl,
  },
  title: {
    fontSize: 36,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    marginBottom: layout.spacing.sm,
  },
  subtitle: {
    fontSize: typography.sizes.lg,
    color: colors.text,
    textAlign: "center",
  },
  formContainer: {
    marginBottom: layout.spacing.xl,
  },
  errorContainer: {
    backgroundColor: colors.dangerLight,
    padding: layout.spacing.md,
    borderRadius: layout.borderRadius.md,
    marginBottom: layout.spacing.md,
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.sizes.sm,
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
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: layout.spacing.lg,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: typography.sizes.sm,
  },
  authButton: {
    marginBottom: layout.spacing.md,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: layout.spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    color: colors.textSecondary,
    paddingHorizontal: layout.spacing.md,
    fontSize: typography.sizes.sm,
  },
  guestButton: {
    marginTop: layout.spacing.md,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.md,
  },
  footerLink: {
    color: colors.primary,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    marginLeft: layout.spacing.xs,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: typography.sizes.lg,
    color: colors.textSecondary,
  },
})
