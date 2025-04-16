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
  UserPlus,
  Check,
  AlertTriangle,
  Shield,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { layout } from '@/constants/layout';
import { Button } from '@/components/Button';
import { useAuthStore } from '@/store/auth-store';
import { signUpWithEmail } from '@/lib/supabase';
import { useTranslation } from '@/hooks/use-translation';

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp, isLoading, error, resetError } = useAuthStore();
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password strength indicators
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  // Clear error when component mounts
  useEffect(() => {
    resetError();
  }, []);

  // Check password strength
  useEffect(() => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };

    setPasswordChecks(checks);

    // Calculate strength (0-4)
    const strength = Object.values(checks).filter(Boolean).length;
    setPasswordStrength(strength);
  }, [password]);

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
    } else if (password.length < 8) {
      setPasswordError(t('Password must be at least 8 characters'));
      return false;
    } else if (passwordStrength < 3) {
      setPasswordError(t('Password is too weak'));
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validateConfirmPassword = (confirmPassword: string) => {
    if (!confirmPassword) {
      setConfirmPasswordError(t('Please confirm your password'));
      return false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError(t('Passwords do not match'));
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  const handleSignUp = async () => {
    // Reset errors
    resetError();
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    // Validate inputs
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

    if (!isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      return;
    }

    try {
      setIsSubmitting(true);

      // Attempt to sign up with Supabase
      const { session, user } = await signUpWithEmail(email, password);

      if (user) {
        Alert.alert(
          t('Account Created'),
          t('Your account has been created successfully.'),
          [
            {
              text: t('Continue to Premium'),
              onPress: () => router.replace('/premium/checkout'),
            },
          ]
        );
      } else {
        throw new Error('Failed to create account');
      }
    } catch (error) {
      console.error('Sign up error:', error);
      Alert.alert(
        t('Sign Up Failed'),
        t('Failed to create account. Please try again.')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength === 0) return colors.textSecondary;
    if (passwordStrength < 2) return colors.danger;
    if (passwordStrength < 4) return colors.warning;
    return colors.success;
  };

  const getStrengthText = () => {
    if (passwordStrength === 0) return t('Enter password');
    if (passwordStrength < 2) return t('Weak');
    if (passwordStrength < 4) return t('Medium');
    return t('Strong');
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
            <Text style={styles.subtitle}>{t('Create your account')}</Text>
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
                {t('Your data is protected with end-to-end encryption')}
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
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                {showPassword ? (
                  <EyeOff size={20} color={colors.textSecondary} />
                ) : (
                  <Eye size={20} color={colors.textSecondary} />
                )}
              </TouchableOpacity>
            </View>

            {/* Password strength indicator */}
            {password.length > 0 && (
              <View style={styles.strengthContainer}>
                <View style={styles.strengthBars}>
                  {[1, 2, 3, 4].map((level) => (
                    <View
                      key={level}
                      style={[
                        styles.strengthBar,
                        {
                          backgroundColor:
                            passwordStrength >= level
                              ? getStrengthColor()
                              : colors.border,
                        },
                      ]}
                    />
                  ))}
                </View>
                <Text
                  style={[styles.strengthText, { color: getStrengthColor() }]}
                >
                  {getStrengthText()}
                </Text>
              </View>
            )}

            {/* Password requirements */}
            {password.length > 0 && (
              <View style={styles.requirementsContainer}>
                <Text style={styles.requirementsTitle}>
                  {t('Password requirements:')}
                </Text>
                <View style={styles.requirement}>
                  <Check
                    size={16}
                    color={
                      passwordChecks.length
                        ? colors.success
                        : colors.textSecondary
                    }
                  />
                  <Text
                    style={[
                      styles.requirementText,
                      passwordChecks.length && styles.requirementMet,
                    ]}
                  >
                    {t('At least 8 characters')}
                  </Text>
                </View>
                <View style={styles.requirement}>
                  <Check
                    size={16}
                    color={
                      passwordChecks.uppercase
                        ? colors.success
                        : colors.textSecondary
                    }
                  />
                  <Text
                    style={[
                      styles.requirementText,
                      passwordChecks.uppercase && styles.requirementMet,
                    ]}
                  >
                    {t('At least one uppercase letter')}
                  </Text>
                </View>
                <View style={styles.requirement}>
                  <Check
                    size={16}
                    color={
                      passwordChecks.lowercase
                        ? colors.success
                        : colors.textSecondary
                    }
                  />
                  <Text
                    style={[
                      styles.requirementText,
                      passwordChecks.lowercase && styles.requirementMet,
                    ]}
                  >
                    {t('At least one lowercase letter')}
                  </Text>
                </View>
                <View style={styles.requirement}>
                  <Check
                    size={16}
                    color={
                      passwordChecks.number
                        ? colors.success
                        : colors.textSecondary
                    }
                  />
                  <Text
                    style={[
                      styles.requirementText,
                      passwordChecks.number && styles.requirementMet,
                    ]}
                  >
                    {t('At least one number')}
                  </Text>
                </View>
                <View style={styles.requirement}>
                  <Check
                    size={16}
                    color={
                      passwordChecks.special
                        ? colors.success
                        : colors.textSecondary
                    }
                  />
                  <Text
                    style={[
                      styles.requirementText,
                      passwordChecks.special && styles.requirementMet,
                    ]}
                  >
                    {t('At least one special character')}
                  </Text>
                </View>
              </View>
            )}

            {passwordError ? (
              <Text style={styles.errorMessage}>{passwordError}</Text>
            ) : null}

            <View
              style={[
                styles.inputContainer,
                confirmPasswordError ? styles.inputError : null,
              ]}
            >
              <Lock
                size={20}
                color={
                  confirmPasswordError ? colors.danger : colors.textSecondary
                }
              />
              <TextInput
                style={styles.input}
                placeholder={t('Confirm Password')}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (confirmPasswordError) validateConfirmPassword(text);
                }}
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
            {confirmPasswordError ? (
              <Text style={styles.errorMessage}>{confirmPasswordError}</Text>
            ) : null}

            <Button
              title={t('Create Account')}
              onPress={handleSignUp}
              loading={isSubmitting}
              disabled={isSubmitting || !email || !password || !confirmPassword}
              icon={<UserPlus size={20} color={colors.background} />}
              style={styles.signUpButton}
            />

            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                {t('By creating an account, you agree to our')}
              </Text>
              <View style={styles.termsLinks}>
                <TouchableOpacity onPress={() => router.push('/terms')}>
                  <Text style={styles.termsLink}>{t('Terms of Service')}</Text>
                </TouchableOpacity>
                <Text style={styles.termsText}> {t('and')} </Text>
                <TouchableOpacity onPress={() => router.push('/privacy')}>
                  <Text style={styles.termsLink}>{t('Privacy Policy')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {t('Already have an account?')}
            </Text>
            <TouchableOpacity onPress={() => router.push('/auth/sign-in')}>
              <Text style={styles.footerLink}>{t('Sign In')}</Text>
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
  strengthContainer: {
    marginBottom: layout.spacing.md,
  },
  strengthBars: {
    flexDirection: 'row',
    marginBottom: layout.spacing.xs,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 2,
  },
  strengthText: {
    fontSize: typography.sizes.xs,
    textAlign: 'right',
  },
  requirementsContainer: {
    marginBottom: layout.spacing.md,
    backgroundColor: colors.highlight,
    padding: layout.spacing.md,
    borderRadius: layout.borderRadius.md,
  },
  requirementsTitle: {
    fontSize: typography.sizes.sm,
    color: colors.text,
    marginBottom: layout.spacing.sm,
  },
  requirement: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: layout.spacing.xs,
  },
  requirementText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginLeft: layout.spacing.xs,
  },
  requirementMet: {
    color: colors.success,
  },
  signUpButton: {
    marginBottom: layout.spacing.md,
  },
  termsContainer: {
    alignItems: 'center',
  },
  termsText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  termsLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  termsLink: {
    fontSize: typography.sizes.xs,
    color: colors.primary,
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
