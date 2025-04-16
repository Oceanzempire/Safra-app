'use client';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Droplets, Bell } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { layout } from '@/constants/layout';
import { Card } from '@/components/Card';
import { useTranslation } from '@/hooks/use-translation';

export default function RemindersScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <Stack.Screen
        options={{
          title: t('Reminders'),
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
        <Card style={styles.reminderCard}>
          <View style={styles.reminderIconContainer}>
            <Droplets size={48} color={colors.info} />
          </View>
          <Text style={styles.reminderTitle}>{t('Drink Water')}</Text>
          <Text style={styles.reminderDescription}>{t('Stay hydrated')}</Text>
          <TouchableOpacity
            style={styles.reminderButton}
            onPress={() => router.push('/reminders/water')}
          >
            <Text style={styles.reminderButtonText}>{t('Set Reminder')}</Text>
          </TouchableOpacity>
        </Card>

        <Card style={styles.reminderCard}>
          <View style={styles.reminderIconContainer}>
            <Bell size={48} color={colors.warning} />
          </View>
          <Text style={styles.reminderTitle}>{t('Medication')}</Text>
          <Text style={styles.reminderDescription}>
            {t('Set reminders for your medications')}
          </Text>
          <TouchableOpacity
            style={styles.reminderButton}
            onPress={() => router.push('/reminders/medication')}
          >
            <Text style={styles.reminderButtonText}>{t('Set Up')}</Text>
          </TouchableOpacity>
        </Card>
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
  reminderCard: {
    alignItems: 'center',
    marginBottom: layout.spacing.lg,
  },
  reminderIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: layout.spacing.md,
  },
  reminderTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: layout.spacing.sm,
  },
  reminderDescription: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: layout.spacing.lg,
  },
  reminderButton: {
    backgroundColor: colors.primary,
    paddingVertical: layout.spacing.sm,
    paddingHorizontal: layout.spacing.lg,
    borderRadius: layout.borderRadius.md,
  },
  reminderButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.background,
  },
});
