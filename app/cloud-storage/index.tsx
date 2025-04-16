'use client';

import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Cloud,
  Check,
  ChevronRight,
  RefreshCw,
  Download,
  Upload,
  Settings,
  Info,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { layout } from '@/constants/layout';
import { useAuthStore } from '@/store/auth-store';
import { useSettingsStore } from '@/store/settings-store';
import { useColorScheme } from 'react-native';
import { useTranslation } from '@/hooks/use-translation';
import { Header } from '@/components/Header';
import { PremiumFeature } from '@/components/PremiumFeature';

export default function CloudStorageScreen() {
  const router = useRouter();
  const { theme, cloudSync, cloudProvider, updateSettings } =
    useSettingsStore();
  const { user, isGuest, checkPremiumStatus } = useAuthStore();
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  // Determine which theme to use
  const activeTheme = theme === 'system' ? colorScheme || 'light' : theme;

  const isDarkMode = activeTheme === 'dark';

  const [isLoading, setIsLoading] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  // Check premium status on component mount
  useEffect(() => {
    if (user && !isGuest) {
      // Assuming we've added a checkPremiumStatus function to the auth store
      const isPremiumActive = checkPremiumStatus();

      // If premium expired but cloud sync is enabled, disable it
      if (!isPremiumActive && cloudSync) {
        updateSettings({ cloudSync: false });
        Alert.alert(
          t('Premium Expired'),
          t(
            'Your premium subscription has expired. Cloud sync has been disabled.'
          )
        );
      }
    }
  }, []);

  const isPremium = !isGuest && user?.isPremium && checkPremiumStatus();

  const cloudProviders = [
    {
      id: 'google',
      name: 'Google Drive',
      icon: '🔵',
      isConnected: cloudProvider === 'google',
    },
    {
      id: 'icloud',
      name: 'iCloud',
      icon: '☁️',
      isConnected: cloudProvider === 'icloud',
    },
    {
      id: 'dropbox',
      name: 'Dropbox',
      icon: '📦',
      isConnected: cloudProvider === 'dropbox',
    },
    {
      id: 'onedrive',
      name: 'OneDrive',
      icon: '📁',
      isConnected: cloudProvider === 'onedrive',
    },
  ];

  const handleToggleCloudSync = (value: boolean) => {
    if (!isPremium) {
      router.push('/premium/checkout');
      return;
    }

    if (value && !cloudProvider) {
      Alert.alert(
        t('Select Provider'),
        t('Please select a cloud storage provider first')
      );
      return;
    }

    updateSettings({ cloudSync: value });
  };

  const handleConnectProvider = (providerId: string) => {
    if (!isPremium) {
      router.push('/premium/checkout');
      return;
    }

    // Simulate connecting to provider
    setIsLoading(true);

    setTimeout(() => {
      updateSettings({
        cloudProvider: providerId as
          | 'google'
          | 'icloud'
          | 'dropbox'
          | 'onedrive',
        cloudSync: true,
      });
      setIsLoading(false);
      setLastSyncTime(new Date().toLocaleString());

      Alert.alert(
        t('Connected'),
        t('Your account has been connected to') +
          ' ' +
          cloudProviders.find((p) => p.id === providerId)?.name
      );
    }, 1500);
  };

  const handleSync = () => {
    if (!isPremium || !cloudSync) return;

    setIsLoading(true);

    // Simulate sync
    setTimeout(() => {
      setIsLoading(false);
      setLastSyncTime(new Date().toLocaleString());

      Alert.alert(
        t('Sync Complete'),
        t('Your data has been synchronized successfully')
      );
    }, 2000);
  };

  if (isGuest) {
    return (
      <SafeAreaView
        style={[styles.container, isDarkMode && styles.containerDark]}
      >
        <Header title={t('Cloud Storage')} showBackButton={true} />

        <PremiumFeature
          title={t('Cloud Storage')}
          description={t(
            'Sync your data across all your devices with cloud storage. Available with Safra Premium.'
          )}
          icon={<Cloud size={48} color={colors.primary} />}
          buttonLabel={t('Upgrade to Premium')}
          onButtonPress={() => router.push('/premium/checkout')}
          isDarkMode={isDarkMode}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, isDarkMode && styles.containerDark]}
    >
      <Header title={t('Cloud Storage')} showBackButton={true} />

      {!isPremium ? (
        <PremiumFeature
          title={t('Cloud Storage')}
          description={t(
            'Sync your data across all your devices with cloud storage. Available with Safra Premium.'
          )}
          icon={<Cloud size={48} color={colors.primary} />}
          buttonLabel={t('Upgrade to Premium')}
          onButtonPress={() => router.push('/premium/checkout')}
          isDarkMode={isDarkMode}
        />
      ) : (
        <ScrollView style={styles.content}>
          {/* Cloud Sync Toggle */}
          <View style={[styles.section, isDarkMode && styles.sectionDark]}>
            <View style={styles.sectionHeader}>
              <Text
                style={[
                  styles.sectionTitle,
                  isDarkMode && styles.sectionTitleDark,
                ]}
              >
                {t('Cloud Sync')}
              </Text>
              <Switch
                value={cloudSync}
                onValueChange={handleToggleCloudSync}
                trackColor={{ false: '#767577', true: colors.primary }}
                thumbColor={cloudSync ? '#f4f3f4' : '#f4f3f4'}
              />
            </View>

            <Text
              style={[
                styles.sectionDescription,
                isDarkMode && styles.sectionDescriptionDark,
              ]}
            >
              {t('Automatically sync your data across all your devices')}
            </Text>

            {lastSyncTime && (
              <Text
                style={[
                  styles.lastSyncText,
                  isDarkMode && styles.lastSyncTextDark,
                ]}
              >
                {t('Last sync')}: {lastSyncTime}
              </Text>
            )}
          </View>

          {/* Cloud Providers */}
          <View style={[styles.section, isDarkMode && styles.sectionDark]}>
            <Text
              style={[
                styles.sectionTitle,
                isDarkMode && styles.sectionTitleDark,
              ]}
            >
              {t('Storage Providers')}
            </Text>

            {cloudProviders.map((provider) => (
              <TouchableOpacity
                key={provider.id}
                style={[
                  styles.providerItem,
                  provider.isConnected && styles.connectedProvider,
                  isDarkMode && styles.providerItemDark,
                  provider.isConnected &&
                    isDarkMode &&
                    styles.connectedProviderDark,
                ]}
                onPress={() => handleConnectProvider(provider.id)}
                disabled={isLoading}
              >
                <View style={styles.providerInfo}>
                  <Text style={styles.providerIcon}>{provider.icon}</Text>
                  <Text
                    style={[
                      styles.providerName,
                      isDarkMode && styles.providerNameDark,
                    ]}
                  >
                    {provider.name}
                  </Text>
                </View>

                {provider.isConnected ? (
                  <View style={styles.connectedBadge}>
                    <Check size={16} color={colors.background} />
                    <Text style={styles.connectedText}>{t('Connected')}</Text>
                  </View>
                ) : (
                  <ChevronRight
                    size={20}
                    color={
                      isDarkMode
                        ? colors.darkTextSecondary
                        : colors.textSecondary
                    }
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Sync Actions */}
          {cloudSync && cloudProvider && (
            <View style={[styles.section, isDarkMode && styles.sectionDark]}>
              <Text
                style={[
                  styles.sectionTitle,
                  isDarkMode && styles.sectionTitleDark,
                ]}
              >
                {t('Sync Actions')}
              </Text>

              <View style={styles.syncActions}>
                <TouchableOpacity
                  style={[
                    styles.syncAction,
                    isDarkMode && styles.syncActionDark,
                  ]}
                  onPress={handleSync}
                  disabled={isLoading}
                >
                  <RefreshCw size={24} color={colors.primary} />
                  <Text
                    style={[
                      styles.syncActionText,
                      isDarkMode && styles.syncActionTextDark,
                    ]}
                  >
                    {t('Sync Now')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.syncAction,
                    isDarkMode && styles.syncActionDark,
                  ]}
                  disabled={isLoading}
                >
                  <Upload size={24} color={colors.primary} />
                  <Text
                    style={[
                      styles.syncActionText,
                      isDarkMode && styles.syncActionTextDark,
                    ]}
                  >
                    {t('Upload Only')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.syncAction,
                    isDarkMode && styles.syncActionDark,
                  ]}
                  disabled={isLoading}
                >
                  <Download size={24} color={colors.primary} />
                  <Text
                    style={[
                      styles.syncActionText,
                      isDarkMode && styles.syncActionTextDark,
                    ]}
                  >
                    {t('Download Only')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.syncAction,
                    isDarkMode && styles.syncActionDark,
                  ]}
                  disabled={isLoading}
                >
                  <Settings size={24} color={colors.primary} />
                  <Text
                    style={[
                      styles.syncActionText,
                      isDarkMode && styles.syncActionTextDark,
                    ]}
                  >
                    {t('Sync Settings')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Storage Usage */}
          {cloudSync && cloudProvider && (
            <View style={[styles.section, isDarkMode && styles.sectionDark]}>
              <View style={styles.sectionHeader}>
                <Text
                  style={[
                    styles.sectionTitle,
                    isDarkMode && styles.sectionTitleDark,
                  ]}
                >
                  {t('Storage Usage')}
                </Text>
                <TouchableOpacity>
                  <Info
                    size={20}
                    color={
                      isDarkMode
                        ? colors.darkTextSecondary
                        : colors.textSecondary
                    }
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.storageBar}>
                <View style={styles.storageBarFill} />
              </View>

              <Text
                style={[
                  styles.storageText,
                  isDarkMode && styles.storageTextDark,
                ]}
              >
                {t('Using')} 0.2 GB {t('of')} 15 GB (1.3%)
              </Text>
            </View>
          )}

          {isLoading && (
            <View style={styles.loadingContainer}>
              <RefreshCw size={24} color={colors.primary} />
              <Text
                style={[
                  styles.loadingText,
                  isDarkMode && styles.loadingTextDark,
                ]}
              >
                {t('Syncing...')}
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  containerDark: {
    backgroundColor: colors.darkBackground,
  },
  content: {
    flex: 1,
    padding: layout.spacing.md,
  },
  section: {
    backgroundColor: colors.card,
    borderRadius: layout.borderRadius.md,
    padding: layout.spacing.md,
    marginBottom: layout.spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionDark: {
    backgroundColor: colors.darkCard,
    borderColor: colors.darkBorder,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: layout.spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  sectionTitleDark: {
    color: colors.darkText,
  },
  sectionDescription: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    marginBottom: layout.spacing.sm,
  },
  sectionDescriptionDark: {
    color: colors.darkTextSecondary,
  },
  lastSyncText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  lastSyncTextDark: {
    color: colors.darkTextSecondary,
  },
  providerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  providerItemDark: {
    borderBottomColor: colors.darkBorder,
  },
  connectedProvider: {
    backgroundColor: colors.highlight,
  },
  connectedProviderDark: {
    backgroundColor: colors.darkHighlight,
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerIcon: {
    fontSize: 24,
    marginRight: layout.spacing.sm,
  },
  providerName: {
    fontSize: typography.sizes.md,
    color: colors.text,
  },
  providerNameDark: {
    color: colors.darkText,
  },
  connectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: layout.spacing.sm,
    paddingVertical: layout.spacing.xs,
    borderRadius: layout.borderRadius.sm,
  },
  connectedText: {
    fontSize: typography.sizes.sm,
    color: colors.background,
    fontWeight: typography.weights.medium,
    marginLeft: 4,
  },
  syncActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  syncAction: {
    width: '48%',
    backgroundColor: colors.highlight,
    borderRadius: layout.borderRadius.md,
    padding: layout.spacing.md,
    alignItems: 'center',
    marginBottom: layout.spacing.md,
  },
  syncActionDark: {
    backgroundColor: colors.darkHighlight,
  },
  syncActionText: {
    fontSize: typography.sizes.md,
    color: colors.text,
    marginTop: layout.spacing.sm,
  },
  syncActionTextDark: {
    color: colors.darkText,
  },
  storageBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    marginVertical: layout.spacing.md,
    overflow: 'hidden',
  },
  storageBarFill: {
    width: '1.3%',
    height: '100%',
    backgroundColor: colors.primary,
  },
  storageText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  storageTextDark: {
    color: colors.darkTextSecondary,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: layout.spacing.md,
  },
  loadingText: {
    fontSize: typography.sizes.md,
    color: colors.text,
    marginLeft: layout.spacing.sm,
  },
  loadingTextDark: {
    color: colors.darkText,
  },
});
