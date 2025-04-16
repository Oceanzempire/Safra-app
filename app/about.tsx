'use client';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Shield,
  Heart,
  Mail,
  Globe,
  Github,
  Twitter,
  ExternalLink,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { layout } from '@/constants/layout';
import { Card } from '@/components/Card';
import { useTranslation } from '@/hooks/use-translation';
import { AdBanner } from '@/components/AdBanner';

export default function AboutScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error('An error occurred', err)
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('About Safra')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Shield size={60} color={colors.primary} />
          <Text style={styles.title}>Safra</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>

        {/* Ad Banner at top */}
        <View style={styles.adContainer}>
          <AdBanner size="banner" />
        </View>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>{t('Our Mission')}</Text>
          <Text style={styles.paragraph}>
            Safra was created with a simple mission: to help people stay
            organized and prepared for life's unexpected moments.
          </Text>
          <Text style={styles.paragraph}>
            We believe that everyone should have access to tools that make daily
            life easier and provide peace of mind during emergencies.
          </Text>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>{t('Features')}</Text>

          <View style={styles.featureItem}>
            <View style={styles.featureBullet} />
            <Text style={styles.featureText}>
              <Text style={styles.featureHighlight}>Task Management:</Text> Keep
              track of your daily tasks and to-dos in one place.
            </Text>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureBullet} />
            <Text style={styles.featureText}>
              <Text style={styles.featureHighlight}>Habit Tracking:</Text> Build
              positive habits with our easy-to-use tracker.
            </Text>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureBullet} />
            <Text style={styles.featureText}>
              <Text style={styles.featureHighlight}>Notes:</Text> Capture your
              thoughts and ideas whenever inspiration strikes.
            </Text>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureBullet} />
            <Text style={styles.featureText}>
              <Text style={styles.featureHighlight}>Emergency Guides:</Text>{' '}
              Access life-saving information even without internet connection.
            </Text>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureBullet} />
            <Text style={styles.featureText}>
              <Text style={styles.featureHighlight}>SOS Feature:</Text> Quickly
              alert your trusted contacts in case of emergency.
            </Text>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureBullet} />
            <Text style={styles.featureText}>
              <Text style={styles.featureHighlight}>Cloud Sync:</Text> Keep your
              data safe and accessible across all your devices (Premium).
            </Text>
          </View>
        </Card>

        {/* Ad Banner in the middle */}
        <View style={styles.adContainer}>
          <AdBanner size="largeBanner" />
        </View>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>{t('Privacy')}</Text>
          <Text style={styles.paragraph}>
            At Safra, we take your privacy seriously. We only collect the
            minimum amount of data necessary to provide our services.
          </Text>
          <Text style={styles.paragraph}>
            Your personal data is never sold to third parties, and we use
            industry-standard encryption to protect your information.
          </Text>

          <TouchableOpacity
            style={styles.link}
            onPress={() => handleOpenLink('https://safra-app.com/privacy')}
          >
            <Text style={styles.linkText}>{t('Read our Privacy Policy')}</Text>
            <ExternalLink size={16} color={colors.primary} />
          </TouchableOpacity>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>{t('Contact Us')}</Text>

          <TouchableOpacity
            style={styles.contactItem}
            onPress={() => handleOpenLink('mailto:support@safra-app.com')}
          >
            <Mail size={20} color={colors.primary} />
            <Text style={styles.contactText}>support@safra-app.com</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactItem}
            onPress={() => handleOpenLink('https://safra-app.com')}
          >
            <Globe size={20} color={colors.primary} />
            <Text style={styles.contactText}>safra-app.com</Text>
          </TouchableOpacity>

          <View style={styles.socialLinks}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleOpenLink('https://twitter.com/safraapp')}
            >
              <Twitter size={20} color={colors.text} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleOpenLink('https://github.com/safra-app')}
            >
              <Github size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
        </Card>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {t('Made with')} <Heart size={14} color={colors.danger} />{' '}
            {t('by Empire Tech Services')}
          </Text>
          <Text style={styles.copyright}>
            © 2025 Safra. {t('All rights reserved.')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: layout.spacing.md,
    paddingHorizontal: layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text,
  },
  backButton: {
    padding: layout.spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: layout.spacing.md,
    paddingBottom: layout.spacing.xxl,
  },
  title: {
    fontSize: 32,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginTop: layout.spacing.md,
  },
  version: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    marginTop: layout.spacing.xs,
  },
  card: {
    marginBottom: layout.spacing.lg,
    padding: layout.spacing.lg,
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
  featureItem: {
    flexDirection: 'row',
    marginBottom: layout.spacing.md,
  },
  featureBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 8,
    marginRight: layout.spacing.sm,
  },
  featureText: {
    flex: 1,
    fontSize: typography.sizes.md,
    color: colors.text,
    lineHeight: 22,
  },
  featureHighlight: {
    fontWeight: typography.weights.semibold,
    color: colors.primary,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: layout.spacing.sm,
  },
  linkText: {
    fontSize: typography.sizes.md,
    color: colors.primary,
    marginRight: layout.spacing.xs,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: layout.spacing.md,
  },
  contactText: {
    fontSize: typography.sizes.md,
    color: colors.text,
    marginLeft: layout.spacing.md,
  },
  socialLinks: {
    flexDirection: 'row',
    marginTop: layout.spacing.md,
  },
  socialButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.highlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: layout.spacing.md,
  },
  footer: {
    alignItems: 'center',
    marginVertical: layout.spacing.xl,
  },
  footerText: {
    fontSize: typography.sizes.md,
    color: colors.text,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: layout.spacing.xs,
  },
  copyright: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  adContainer: {
    marginBottom: layout.spacing.lg,
  },
});
