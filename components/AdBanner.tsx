'use client';

import type React from 'react';
import { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { AdMobBanner } from 'expo-ads-admob';
import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { useTranslation } from '@/hooks/use-translation';
import { useAuthStore } from '@/store/auth-store';

type AdSize =
  | 'banner'
  | 'largeBanner'
  | 'mediumRectangle'
  | 'fullBanner'
  | 'leaderboard';

interface AdBannerProps {
  size?: AdSize;
  position?: 'top' | 'bottom' | 'inline';
}

// Map our size names to AdMob size constants
const adSizeMap = {
  banner: 'banner',
  largeBanner: 'largeBanner',
  mediumRectangle: 'mediumRectangle',
  fullBanner: 'fullBanner',
  leaderboard: 'leaderboard',
};

// Production ad unit ID
const BANNER_AD_UNIT_ID = 'ca-app-pub-3927776781701933/4113097259';

// Test ad unit IDs for development
const TEST_AD_UNIT_ID = Platform.select({
  ios: 'ca-app-pub-3940256099942544/2934735716',
  android: 'ca-app-pub-3940256099942544/6300978111',
  default: 'ca-app-pub-3940256099942544/6300978111',
});

declare const __DEV__: boolean;

export const AdBanner: React.FC<AdBannerProps> = ({
  size = 'banner',
  position = 'inline',
}) => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [adError, setAdError] = useState(false);

  // Check if user is premium to hide ads
  const isPremium = user?.isPremium || false;

  // Use test ads in development, real ads in production
  const adUnitID = __DEV__ ? TEST_AD_UNIT_ID : BANNER_AD_UNIT_ID;

  // Don't show ads to premium users
  if (isPremium) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        position === 'top' && styles.positionTop,
        position === 'bottom' && styles.positionBottom,
      ]}
    >
      {!adError && (
        <AdMobBanner
          bannerSize={adSizeMap[size]}
          adUnitID={adUnitID}
          servePersonalizedAds={true}
          onDidFailToReceiveAdWithError={(error) => {
            console.error('Ad error:', error);
            setAdError(true);
          }}
          style={styles.adBanner}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderRadius: layout.borderRadius.sm,
    overflow: 'hidden',
  },
  positionTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  positionBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  adBanner: {
    width: '100%',
  },
});
