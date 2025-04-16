"use client"

import type React from "react"
import { useState, useRef } from "react"
import { View, Text, StyleSheet, type FlatList, Dimensions, TouchableOpacity, Animated } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { ChevronRight, ChevronLeft, AlertTriangle, FileText, CheckSquare, Shield } from "lucide-react-native"
import { colors } from "@/constants/colors"
import { typography } from "@/constants/typography"
import { layout } from "@/constants/layout"
import { Button } from "@/components/Button"
import { useSettingsStore } from "@/store/settings-store"
import { useTranslation } from "@/hooks/use-translation"

const { width } = Dimensions.get("window")

interface OnboardingSlide {
  id: string
  title: string
  description: string
  icon: React.ReactNode
}

export default function OnboardingScreen() {
  const router = useRouter()
  const { completeOnboarding } = useSettingsStore()
  const { t } = useTranslation()

  const [currentIndex, setCurrentIndex] = useState(0)
  const flatListRef = useRef<FlatList>(null)
  const scrollX = useRef(new Animated.Value(0)).current

  const slides: OnboardingSlide[] = [
    {
      id: "1",
      title: t("Welcome to Safra"),
      description: t("Your personal emergency preparedness and safety companion."),
      icon: <Shield size={80} color={colors.primary} />,
    },
    {
      id: "2",
      title: t("Emergency Guides"),
      description: t(
        "Access detailed guides for various emergency situations, from natural disasters to medical emergencies.",
      ),
      icon: <AlertTriangle size={80} color={colors.warning} />,
    },
    {
      id: "3",
      title: t("Stay Organized"),
      description: t("Keep track of important tasks, notes, and emergency contacts all in one place."),
      icon: <CheckSquare size={80} color={colors.success} />,
    },
    {
      id: "4",
      title: t("Secure & Private"),
      description: t(
        "Your data is encrypted and stored securely. Password-protect sensitive information for extra security.",
      ),
      icon: <FileText size={80} color={colors.info} />,
    },
  ]

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      })
    } else {
      handleFinish()
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex - 1,
        animated: true,
      })
    }
  }

  const handleFinish = () => {
    completeOnboarding()
    router.replace("/auth/choice")
  }

  const renderSlide = ({ item }: { item: OnboardingSlide }) => {
    return (
      <View style={styles.slide}>
        <View style={styles.iconContainer}>{item.icon}</View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    )
  }

  const renderPagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {slides.map((_, index) => {
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width]

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [10, 20, 10],
            extrapolate: "clamp",
          })

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          })

          return <Animated.View key={index} style={[styles.dot, { width: dotWidth, opacity }]} />
        })}
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width)
          setCurrentIndex(index)
        }}
        scrollEventThrottle={16}
      />

      {renderPagination()}

      <View style={styles.buttonsContainer}>
        {currentIndex > 0 ? (
          <TouchableOpacity style={styles.prevButton} onPress={handlePrev}>
            <ChevronLeft size={24} color={colors.primary} />
            <Text style={styles.prevButtonText}>{t("Previous")}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.emptyButton} />
        )}

        {currentIndex < slides.length - 1 ? (
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>{t("Next")}</Text>
            <ChevronRight size={24} color={colors.background} />
          </TouchableOpacity>
        ) : (
          <Button title={t("Get Started")} onPress={handleFinish} style={styles.getStartedButton} />
        )}
      </View>

      <TouchableOpacity style={styles.skipButton} onPress={handleFinish}>
        <Text style={styles.skipButtonText}>{t("Skip")}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  slide: {
    width,
    padding: layout.spacing.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.highlight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: layout.spacing.xl,
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    textAlign: "center",
    marginBottom: layout.spacing.md,
  },
  description: {
    fontSize: typography.sizes.lg,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: layout.spacing.xl,
  },
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginHorizontal: 5,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: layout.spacing.xl,
    marginBottom: layout.spacing.xl,
  },
  prevButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  prevButtonText: {
    fontSize: typography.sizes.md,
    color: colors.primary,
    marginLeft: layout.spacing.xs,
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingVertical: layout.spacing.sm,
    paddingHorizontal: layout.spacing.md,
    borderRadius: layout.borderRadius.md,
  },
  nextButtonText: {
    fontSize: typography.sizes.md,
    color: colors.background,
    marginRight: layout.spacing.xs,
  },
  getStartedButton: {
    paddingHorizontal: layout.spacing.lg,
  },
  emptyButton: {
    width: 100,
  },
  skipButton: {
    position: "absolute",
    top: layout.spacing.lg,
    right: layout.spacing.lg,
    padding: layout.spacing.sm,
  },
  skipButtonText: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
  },
})
