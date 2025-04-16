'use client';

import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import {
  useColorScheme,
  AppState,
  type AppStateStatus,
  Platform,
} from 'react-native';
import { useSettingsStore } from '@/store/settings-store';
import { useAuthStore } from '@/store/auth-store';
import { useRouter, SplashScreen } from 'expo-router';
import { AppLockScreen } from '@/components/AppLockScreen';
import { colors } from '@/constants/colors';
import { NotificationProvider } from '@/components/NotificationProvider';
import * as AdMob from 'expo-ads-admob';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// AdMob App ID
const ADMOB_APP_ID = Platform.select({
  ios: 'ca-app-pub-3927776781701933~2825858324',
  android: 'ca-app-pub-3927776781701933~2825858324',
  default: 'ca-app-pub-3927776781701933~2825858324',
});

export default function RootLayout() {
  const {
    theme,
    hasCompletedOnboarding,
    isFirstLaunch,
    pinLock,
    biometricLock,
  } = useSettingsStore();
  const { isGuest, user } = useAuthStore();
  const colorScheme = useColorScheme();
  const router = useRouter();

  const [isLocked, setIsLocked] = useState(false);
  const [appReady, setAppReady] = useState(false);

  // Determine which theme to use
  const activeTheme = theme === 'system' ? colorScheme || 'light' : theme;

  // Initialize AdMob
  useEffect(() => {
    const initAdMob = async () => {
      try {
        await AdMob.initialize({
          requestTrackingAuthorization: true,
          appId: ADMOB_APP_ID,
        });
        console.log('AdMob initialized successfully');
      } catch (error) {
        console.error('AdMob initialization failed:', error);
      }
    };

    initAdMob();
  }, []);

  // Handle app state changes for locking
  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        if (nextAppState === 'background' && (pinLock || biometricLock)) {
          setIsLocked(true);
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, [pinLock, biometricLock]);

  // Handle initial routing based on user state
  useEffect(() => {
    const setupApp = async () => {
      try {
        // If it's the first launch, show onboarding
        if (isFirstLaunch && !hasCompletedOnboarding) {
          router.replace('/onboarding');
        }
        // If user hasn't chosen guest or account, show choice screen
        else if (!isGuest && !user) {
          router.replace('/auth/choice');
        }
        // Otherwise, go to the main app
        else {
          router.replace('/');
        }
      } catch (e) {
        console.error('Failed to setup app:', e);
      } finally {
        // Hide the splash screen
        setAppReady(true);
        SplashScreen.hideAsync();
      }
    };

    setupApp();
  }, [isFirstLaunch, hasCompletedOnboarding, isGuest, user]);

  // If the app is locked, show the lock screen
  if (isLocked && appReady) {
    return <AppLockScreen onUnlock={() => setIsLocked(false)} />;
  }

  return (
    <NotificationProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor:
              activeTheme === 'dark'
                ? colors.darkBackground
                : colors.background,
          },
          headerTintColor:
            activeTheme === 'dark' ? colors.darkText : colors.text,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="onboarding/index"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="auth/choice" options={{ headerShown: false }} />
        <Stack.Screen name="auth/index" options={{ headerShown: false }} />
        <Stack.Screen
          name="auth/reset-password"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="settings/security"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="about" options={{ headerShown: false }} />
        <Stack.Screen name="help" options={{ headerShown: false }} />
        <Stack.Screen
          name="premium/checkout"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="cloud-storage/index"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="vault/index" options={{ headerShown: false }} />
      </Stack>
    </NotificationProvider>
  );
}
