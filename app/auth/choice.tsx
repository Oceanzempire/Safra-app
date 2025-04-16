'use client';

import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { LogIn, UserPlus, ArrowRight } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { layout } from '@/constants/layout';
import { Button } from '@/components/Button';
import { useTranslation } from '@/hooks/use-translation';

export default function AuthChoiceScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left', 'top']}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Safra</Text>
          <Text style={styles.tagline}>
            {t('Your personal safety companion')}
          </Text>
        </View>

        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1516796181074-bf453fbfa3e6?w=500&auto=format&fit=crop',
            }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <View
              style={[
                styles.featureIcon,
                { backgroundColor: colors.primaryLight },
              ]}
            >
              <Text style={styles.featureEmoji}>🔒</Text>
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>{t('Secure Vault')}</Text>
              <Text style={styles.featureDescription}>
                {t('Store sensitive information safely')}
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View
              style={[
                styles.featureIcon,
                { backgroundColor: colors.secondaryLight },
              ]}
            >
              <Text style={styles.featureEmoji}>🆘</Text>
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>{t('Emergency SOS')}</Text>
              <Text style={styles.featureDescription}>
                {t('Quick access to emergency contacts')}
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View
              style={[
                styles.featureIcon,
                { backgroundColor: colors.infoLight },
              ]}
            >
              <Text style={styles.featureEmoji}>🔄</Text>
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>{t('Cloud Sync')}</Text>
              <Text style={styles.featureDescription}>
                {t('Access your data across devices')}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          <Button
            title={t('Sign In')}
            onPress={() => router.push('/auth/sign-in')}
            icon={<LogIn size={20} color={colors.background} />}
            style={styles.button}
          />

          <Button
            title={t('Create Account')}
            variant="secondary"
            onPress={() => router.push('/auth/sign-up')}
            icon={<UserPlus size={20} color={colors.background} />}
            style={styles.button}
          />

          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => router.replace('/')}
          >
            <Text style={styles.skipButtonText}>{t('Continue as Guest')}</Text>
            <ArrowRight size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: layout.spacing.lg,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: layout.spacing.xl,
  },
  logoText: {
    fontSize: 42,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    marginBottom: layout.spacing.xs,
  },
  tagline: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  imageContainer: {
    marginVertical: layout.spacing.xl,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: layout.borderRadius.lg,
  },
  featuresContainer: {
    marginBottom: layout.spacing.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: layout.spacing.md,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: layout.spacing.md,
  },
  featureEmoji: {
    fontSize: 24,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  buttonsContainer: {
    marginBottom: layout.spacing.xl,
  },
  button: {
    marginBottom: layout.spacing.md,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: layout.spacing.sm,
  },
  skipButtonText: {
    fontSize: typography.sizes.md,
    color: colors.primary,
    marginRight: layout.spacing.xs,
  },
});
