'use client';

import { Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { layout } from '@/constants/layout';

export default function TermsOfServiceScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <Stack.Screen
        options={{
          title: 'Terms of Service',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Terms of Service</Text>
        <Text style={styles.paragraph}>
          Welcome to Safra! These Terms of Service govern your use of our app.
          By accessing or using Safra, you agree to be bound by these terms.
        </Text>

        <Text style={styles.sectionTitle}>1. Account Terms</Text>
        <Text style={styles.paragraph}>
          You must be 13 years or older to use Safra. You are responsible for
          maintaining the security of your account and password.
        </Text>

        <Text style={styles.sectionTitle}>2. Acceptable Use</Text>
        <Text style={styles.paragraph}>
          You agree not to use Safra for any illegal or unauthorized purpose.
          You must not violate any laws in your jurisdiction.
        </Text>

        <Text style={styles.sectionTitle}>3. Privacy</Text>
        <Text style={styles.paragraph}>
          Your use of Safra is also subject to our Privacy Policy, which
          explains how we collect, use, and share information.
        </Text>

        <Text style={styles.sectionTitle}>4. Termination</Text>
        <Text style={styles.paragraph}>
          We may terminate or suspend your account and access to Safra
          immediately, without prior notice or liability, for any reason
          whatsoever, including without limitation if you breach these Terms.
        </Text>

        <Text style={styles.sectionTitle}>5. Changes to Terms</Text>
        <Text style={styles.paragraph}>
          We reserve the right to modify or replace these Terms at any time. If
          a revision is material, we will provide at least 30 days' notice prior
          to any new terms taking effect.
        </Text>

        <Text style={styles.sectionTitle}>6. Governing Law</Text>
        <Text style={styles.paragraph}>
          These Terms shall be governed and construed in accordance with the
          laws of [Your Country/State], without regard to its conflict of law
          provisions.
        </Text>

        <Text style={styles.sectionTitle}>7. Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have any questions about these Terms, please contact us at
          support@safra-app.com.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
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
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: layout.spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: layout.spacing.md,
  },
  paragraph: {
    fontSize: typography.sizes.md,
    color: colors.text,
    marginBottom: layout.spacing.md,
    lineHeight: 22,
  },
});
