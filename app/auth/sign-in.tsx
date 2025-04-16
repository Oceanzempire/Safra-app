'use client';

import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  AlertTriangle,
  Shield,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { layout } from '@/constants/layout';
import { Button } from '@/components/Button';
import { useAuthStore } from '@/store/auth-store';
import { signInWithEmail } from '@/lib/supabase';
import { useTranslation } from '@/hooks/use-translation';

export default function SignInScreen() {
  const router = useRouter();
  const { signIn, isLoading, error, resetError, setUser } = useAuthStore();
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear error when component mounts
  useEffect(() => {
    resetError();
  }, []);

  // Handle lock timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isLocked && lockTimer > 0) {
      interval = setInterval(() => {
        setLockTimer((prev) => prev - 1);
      }, 1000);
    } else if (lockTimer === 0 && isLocked) {
      setIsLocked(false);
    }

    return () => clearInterval(interval);
  }, [isLocked, lockTimer]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError(t('Email is required'));
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError(t('Please enter a valid email address'));
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError(t('Password is required'));
      return false;
    } else if (password.length < 6) {
      setPasswordError(t('Password must be at least 6 characters'));
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSignIn = async () => {
    // Reset errors
    resetError();
    setEmailError('');
    setPasswordError('');

    // Validate inputs
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    // Check if account is locked
    if (isLocked) {
      Alert.alert(
        t('Account Temporarily Locked'),
        t(
          'Too many failed attempts. Please try again in {{seconds}} seconds.',
          { seconds: lockTimer.toString() }
        )
      );
      return;
    }

    try {
      setIsSubmitting(true);

      // Attempt to sign in with Supabase
      const { session, user } = await signInWithEmail(email, password);

      if (session && user) {
        // Reset login attempts on successful login
        setLoginAttempts(0);

        // Set user in auth store
        setUser(user);

        // Navigate to premium checkout
        router.replace('/premium/checkout');
      } else {
        throw new Error('Invalid login credentials');
      }
    } catch (error) {
      console.error('Sign in error:', error);

      // Increment login attempts
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);

      // Lock account after 5 failed attempts
      if (newAttempts >= 5) {
        setIsLocked(true);
        setLockTimer(60); // Lock for 60 seconds
        Alert.alert(
          t('Account Temporarily Locked'),
          t('Too many failed attempts. Please try again in 60 seconds.')
        );
      } else {
        Alert.alert(
          t('Sign In Failed'),
          t(
            'Invalid email or password. Please try again. {{attempts}} of 5 attempts used.',
            {
              attempts: newAttempts.toString(),
            }
          )
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left', 'top']}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Safra</Text>
            <Text style={styles.subtitle}>{t('Welcome back!')}</Text>
          </View>

          <View style={styles.formContainer}>
            {error && (
              <View style={styles.errorContainer}>
                <AlertTriangle size={20} color={colors.danger} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <View style={styles.securityNotice}>
              <Shield size={20} color={colors.primary} />
              <Text style={styles.securityText}>
                {t('Secure login with end-to-end encryption')}
              </Text>
            </View>

            <View
              style={[
                styles.inputContainer,
                emailError ? styles.inputError : null,
              ]}
            >
              <Mail
                size={20}
                color={emailError ? colors.danger : colors.textSecondary}
              />
              <TextInput
                style={styles.input}
                placeholder={t('Email')}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (emailError) validateEmail(text);
                }}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholderTextColor={colors.textSecondary}
                editable={!isLocked}
              />
            </View>
            {emailError ? (
              <Text style={styles.errorMessage}>{emailError}</Text>
            ) : null}

            <View
              style={[
                styles.inputContainer,
                passwordError ? styles.inputError : null,
              ]}
            >
              <Lock
                size={20}
                color={passwordError ? colors.danger : colors.textSecondary}
              />
              <TextInput
                style={styles.input}
                placeholder={t('Password')}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (passwordError) validatePassword(text);
                }}
                secureTextEntry={!showPassword}
                placeholderTextColor={colors.textSecondary}
                editable={!isLocked}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                disabled={isLocked}
              >
                {showPassword ? (
                  <EyeOff size={20} color={colors.textSecondary} />
                ) : (
                  <Eye size={20} color={colors.textSecondary} />
                )}
              </TouchableOpacity>
            </View>
            {passwordError ? (
              <Text style={styles.errorMessage}>{passwordError}</Text>
            ) : null}

            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={() => router.push('/auth/reset-password')}
            >
              <Text style={styles.forgotPasswordText}>
                {t('Forgot password?')}
              </Text>
            </TouchableOpacity>

            <Button
              title={isLocked ? t('Account Locked') : t('Sign In')}
              onPress={handleSignIn}
              loading={isSubmitting}
              disabled={isLocked || isSubmitting || !email || !password}
              icon={
                isLocked ? (
                  <AlertTriangle size={20} color={colors.background} />
                ) : (
                  <LogIn size={20} color={colors.background} />
                )
              }
              style={styles.signInButton}
            />

            {isLocked && (
              <Text style={styles.lockedText}>
                {t('Try again in {{seconds}} seconds', {
                  seconds: lockTimer.toString(),
                })}
              </Text>
            )}

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>{t('OR')}</Text>
              <View style={styles.dividerLine} />
            </View>

            <Button
              title={t('Continue as Guest')}
              variant="outline"
              onPress={() => {
                router.replace('/');
              }}
              style={styles.guestButton}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>{t("Don't have an account?")}</Text>
            <TouchableOpacity onPress={() => router.push('/auth/sign-up')}>
              <Text style={styles.footerLink}>{t('Sign Up')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
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
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
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
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: layout.spacing.xl,
  },
  errorContainer: {
    backgroundColor: colors.dangerLight,
    padding: layout.spacing.md,
    borderRadius: layout.borderRadius.md,
    marginBottom: layout.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.sizes.sm,
    marginLeft: layout.spacing.sm,
    flex: 1,
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    padding: layout.spacing.md,
    borderRadius: layout.borderRadius.md,
    marginBottom: layout.spacing.md,
  },
  securityText: {
    color: colors.primary,
    fontSize: typography.sizes.sm,
    marginLeft: layout.spacing.sm,
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: layout.borderRadius.md,
    paddingHorizontal: layout.spacing.md,
    marginBottom: layout.spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputError: {
    borderColor: colors.danger,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: typography.sizes.md,
    color: colors.text,
    marginLeft: layout.spacing.sm,
  },
  errorMessage: {
    color: colors.danger,
    fontSize: typography.sizes.xs,
    marginBottom: layout.spacing.md,
    marginLeft: layout.spacing.sm,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: layout.spacing.lg,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: typography.sizes.sm,
  },
  signInButton: {
    marginBottom: layout.spacing.md,
  },
  lockedText: {
    color: colors.danger,
    fontSize: typography.sizes.sm,
    textAlign: 'center',
    marginBottom: layout.spacing.md,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
});
