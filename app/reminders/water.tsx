'use client';

import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Droplets } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { layout } from '@/constants/layout';
import { Card } from '@/components/Card';
import { useTranslation } from '@/hooks/use-translation';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSettingsStore } from '@/store/settings-store';

export default function WaterReminderScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [waterReminderEnabled, setWaterReminderEnabled] = useState(false);
  const [waterReminderTime, setWaterReminderTime] = useState(new Date());
  const [showWaterTimePicker, setShowWaterTimePicker] = useState(false);
  const { theme } = useSettingsStore();
  const colorScheme = useColorScheme();

  // Determine which theme to use
  const activeTheme = theme === 'system' ? colorScheme || 'light' : theme;

  const isDarkMode = activeTheme === 'dark';

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => console.log('Expo push token:', token))
      .catch((error) => console.error('Error getting push token:', error));
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = await Notifications.getExpoPushTokenAsync({
        projectId: 'your-project-id',
      });
    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  }

  const scheduleNotification = async (
    title: string,
    body: string,
    time: Date
  ) => {
    const trigger = new Date(time);
    trigger.setDate(new Date().getDate() + 1);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        color: colors.primary,
      },
      trigger,
    });
  };

  const handleWaterReminderToggle = async (value: boolean) => {
    setWaterReminderEnabled(value);
    if (value) {
      scheduleNotification(
        t('Hydration Reminder'),
        t('Time to drink water! Stay hydrated and keep your body refreshed.'),
        waterReminderTime
      );
    } else {
      await Notifications.cancelAllScheduledNotificationsAsync();
    }
  };

  const onWaterTimeChange = (event: any, selectedDate: Date | undefined) => {
    setShowWaterTimePicker(false);
    if (selectedDate) {
      setWaterReminderTime(selectedDate);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, isDarkMode && styles.containerDark]}
      edges={['right', 'left']}
    >
      <Stack.Screen
        options={{
          title: t('Drink Water'),
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
          <View style={styles.reminderSetting}>
            <Text style={styles.reminderSettingLabel}>
              {t('Enable Reminder')}
            </Text>
            <Switch
              trackColor={{ false: '#767577', true: colors.primary }}
              thumbColor={waterReminderEnabled ? '#f4f3f4' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={handleWaterReminderToggle}
              value={waterReminderEnabled}
            />
          </View>
          {waterReminderEnabled && (
            <View>
              <Text style={styles.reminderTimeLabel}>{t('Reminder Time')}</Text>
              <TouchableOpacity onPress={() => setShowWaterTimePicker(true)}>
                <Text style={styles.reminderTime}>
                  {waterReminderTime.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </TouchableOpacity>
              {showWaterTimePicker && (
                <DateTimePicker
                  testID="waterTimePicker"
                  value={waterReminderTime}
                  mode="time"
                  is24Hour={true}
                  display="default"
                  onChange={onWaterTimeChange}
                />
              )}
            </View>
          )}
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
  reminderSetting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: layout.spacing.md,
    marginBottom: layout.spacing.md,
  },
  reminderSettingLabel: {
    fontSize: typography.sizes.md,
    color: colors.text,
  },
  reminderTimeLabel: {
    fontSize: typography.sizes.md,
    color: colors.text,
    marginTop: layout.spacing.md,
    marginBottom: layout.spacing.sm,
  },
  reminderTime: {
    fontSize: typography.sizes.lg,
    color: colors.primary,
    textAlign: 'center',
    padding: layout.spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: layout.borderRadius.md,
  },
});
