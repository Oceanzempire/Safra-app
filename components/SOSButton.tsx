'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { Phone } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { layout } from '@/constants/layout';
import { useTranslation } from '@/hooks/use-translation';
import * as Haptics from 'expo-haptics';

interface SOSButtonProps {
  onActivate: () => void;
  isDarkMode?: boolean;
}

export const SOSButton: React.FC<SOSButtonProps> = ({
  onActivate,
  isDarkMode = false,
}) => {
  const { t } = useTranslation();
  const [isPressed, setIsPressed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const progressAnimation = new Animated.Value(0);
  const pulseAnimation = new Animated.Value(1);

  // Setup pulse animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    ).start();
  }, []);

  // Handle progress animation
  useEffect(() => {
    progressAnimation.addListener(({ value }) => {
      setProgress(value);
    });

    return () => {
      progressAnimation.removeAllListeners();
    };
  }, []);

  const handlePressIn = () => {
    setIsPressed(true);

    // Start progress animation
    Animated.timing(progressAnimation, {
      toValue: 1,
      duration: 3000, // 3 seconds to activate
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished && isPressed) {
        onActivate();
      }
    });

    // Start timer for haptic feedback
    const interval = setInterval(() => {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    }, 500);

    setTimer(interval);
  };

  const handlePressOut = () => {
    setIsPressed(false);

    // Stop progress animation
    Animated.timing(progressAnimation).stop();
    progressAnimation.setValue(0);

    // Clear timer
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
  };

  const pulseStyle = {
    transform: [
      {
        scale: pulseAnimation,
      },
    ],
  };

  const progressStyle = {
    width: progressAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
    }),
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.pulseContainer, pulseStyle]}>
        <TouchableOpacity
          style={[
            styles.button,
            isPressed && styles.buttonPressed,
            isDarkMode && styles.buttonDark,
          ]}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.7}
        >
          <Phone size={32} color="#FFFFFF" />
          <Text style={styles.buttonText}>{t('SOS')}</Text>
        </TouchableOpacity>
      </Animated.View>

      {isPressed && (
        <View style={styles.progressContainer}>
          <Animated.View style={[styles.progressBar, progressStyle]} />
          <Text style={styles.progressText}>
            {t('Hold for 3 seconds to activate emergency mode')}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  pulseContainer: {
    borderRadius: 40,
    overflow: 'hidden',
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonDark: {
    shadowColor: '#fff',
  },
  buttonPressed: {
    backgroundColor: '#B71C1C', // Darker red when pressed
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    marginTop: 4,
  },
  progressContainer: {
    width: '80%',
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    marginTop: layout.spacing.md,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.danger,
  },
  progressText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: layout.spacing.xs,
    textAlign: 'center',
  },
});
