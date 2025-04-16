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
  HelpCircle,
  Mail,
  MessageCircle,
  FileText,
  ChevronRight,
  ExternalLink,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { layout } from '@/constants/layout';
import { Card } from '@/components/Card';
import { useTranslation } from '@/hooks/use-translation';
import { AdBanner } from '@/components/AdBanner';

export default function HelpScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error('An error occurred', err)
    );
  };

  const handleEmailSupport = () => {
    Linking.openURL(
      'mailto:support@safra-app.com?subject=Safra%20App%20Support'
    ).catch((err) => console.error('An error occurred', err));
  };

  const faqs = [
    {
      question: 'How do I create an emergency contact?',
      answer:
        'Go to the Emergency tab, tap on "Emergency Contacts", then tap the "+" button to add a new contact. Fill in the required information and save.',
    },
    {
      question: 'Can I use Safra without creating an account?',
      answer:
        'Yes! You can use Safra in guest mode with limited functionality. Your data will be stored locally on your device.',
    },
    {
      question: 'How do I backup my data?',
      answer:
        'To backup your data, you need to create an account and upgrade to Premium. Then go to Settings > Cloud Sync and tap "Backup Now".',
    },
    {
      question: 'Is my data secure?',
      answer:
        'Yes, we use industry-standard encryption to protect your data. Your personal information is never sold to third parties.',
    },
    {
      question: 'How does the SOS feature work?',
      answer:
        'The SOS feature sends an alert with your location to your designated emergency contacts. To use it, press and hold the SOS button for 3 seconds.',
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('Help & Support')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <HelpCircle size={60} color={colors.primary} />
          <Text style={styles.title}>{t('How can we help?')}</Text>
        </View>

        {/* Ad Banner at top */}
        <View style={styles.adContainer}>
          <AdBanner size="banner" />
        </View>

        <View style={styles.supportOptions}>
          <TouchableOpacity
            style={styles.supportOption}
            onPress={handleEmailSupport}
          >
            <View style={[styles.supportIcon, { backgroundColor: '#E3F2FD' }]}>
              <Mail size={24} color="#2196F3" />
            </View>
            <Text style={styles.supportTitle}>{t('Email Support')}</Text>
            <Text style={styles.supportDescription}>
              {t('Get help via email')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.supportOption}
            onPress={() => handleOpenLink('https://safra-app.com/chat')}
          >
            <View style={[styles.supportIcon, { backgroundColor: '#E8F5E9' }]}>
              <MessageCircle size={24} color="#4CAF50" />
            </View>
            <Text style={styles.supportTitle}>{t('Live Chat')}</Text>
            <Text style={styles.supportDescription}>
              {t('Chat with our team')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.supportOption}
            onPress={() => handleOpenLink('https://safra-app.com/docs')}
          >
            <View style={[styles.supportIcon, { backgroundColor: '#FFF3E0' }]}>
              <FileText size={24} color="#FF9800" />
            </View>
            <Text style={styles.supportTitle}>{t('Documentation')}</Text>
            <Text style={styles.supportDescription}>
              {t('Browse our guides')}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>
          {t('Frequently Asked Questions')}
        </Text>

        {faqs.map((faq, index) => (
          <Card key={index} style={styles.faqCard}>
            <Text style={styles.question}>{faq.question}</Text>
            <Text style={styles.answer}>{faq.answer}</Text>
          </Card>
        ))}

        {/* Ad Banner in the middle */}
        <View style={styles.adContainer}>
          <AdBanner size="mediumRectangle" />
        </View>

        <TouchableOpacity
          style={styles.allFaqsButton}
          onPress={() => handleOpenLink('https://safra-app.com/faq')}
        >
          <Text style={styles.allFaqsText}>{t('View all FAQs')}</Text>
          <ExternalLink size={16} color={colors.primary} />
        </TouchableOpacity>

        <Card style={styles.contactCard}>
          <Text style={styles.contactTitle}>{t('Still need help?')}</Text>
          <Text style={styles.contactDescription}>
            {t(
              'Our support team is always ready to assist you with any questions or issues you might have.'
            )}
          </Text>

          <TouchableOpacity
            style={styles.contactButton}
            onPress={handleEmailSupport}
          >
            <Text style={styles.contactButtonText}>{t('Contact Support')}</Text>
            <ChevronRight size={20} color={colors.background} />
          </TouchableOpacity>
        </Card>

        <View style={styles.linksContainer}>
          <TouchableOpacity
            style={styles.link}
            onPress={() => handleOpenLink('https://safra-app.com/terms')}
          >
            <Text style={styles.linkText}>{t('Terms of Service')}</Text>
          </TouchableOpacity>

          <View style={styles.linkDivider} />

          <TouchableOpacity
            style={styles.link}
            onPress={() => handleOpenLink('https://safra-app.com/privacy')}
          >
            <Text style={styles.linkText}>{t('Privacy Policy')}</Text>
          </TouchableOpacity>
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
  headerSection: {
    alignItems: 'center',
    marginVertical: layout.spacing.xl,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginTop: layout.spacing.md,
  },
  supportOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: layout.spacing.xl,
  },
  supportOption: {
    width: '30%',
    alignItems: 'center',
  },
  supportIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: layout.spacing.sm,
  },
  supportTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  supportDescription: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: layout.spacing.md,
  },
  faqCard: {
    marginBottom: layout.spacing.md,
    padding: layout.spacing.md,
  },
  question: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: layout.spacing.sm,
  },
  answer: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  allFaqsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: layout.spacing.xl,
  },
  allFaqsText: {
    fontSize: typography.sizes.md,
    color: colors.primary,
    fontWeight: typography.weights.medium,
    marginRight: layout.spacing.xs,
  },
  contactCard: {
    marginBottom: layout.spacing.xl,
    padding: layout.spacing.lg,
    alignItems: 'center',
  },
  contactTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: layout.spacing.sm,
  },
  contactDescription: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: layout.spacing.lg,
    lineHeight: 22,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: layout.spacing.sm,
    paddingHorizontal: layout.spacing.lg,
    borderRadius: layout.borderRadius.md,
  },
  contactButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.background,
    marginRight: layout.spacing.xs,
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: layout.spacing.xl,
  },
  link: {
    padding: layout.spacing.sm,
  },
  linkText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  linkDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textSecondary,
  },
  adContainer: {
    marginBottom: layout.spacing.lg,
    alignItems: 'center',
  },
});
