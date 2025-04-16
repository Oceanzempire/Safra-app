"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Stack, useRouter } from "expo-router"
import {
  Heart,
  Flame,
  Wind,
  Droplets,
  ThermometerSnowflake,
  ThermometerSun,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react-native"
import { colors } from "@/constants/colors"
import { typography } from "@/constants/typography"
import { layout } from "@/constants/layout"
import { Card } from "@/components/Card"
import { emergencyGuides, type EmergencyGuide } from "@/constants/emergency-guides"

export default function EmergencyGuidesScreen() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGuide, setSelectedGuide] = useState<EmergencyGuide | null>(null)

  // Filter guides based on category and search query
  const filteredGuides = emergencyGuides.filter((guide) => {
    const matchesCategory = selectedCategory ? guide.category === selectedCategory : true
    const matchesSearch = searchQuery
      ? guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true

    return matchesCategory && matchesSearch
  })

  // Group guides by category
  const guidesByCategory = filteredGuides.reduce(
    (acc, guide) => {
      if (!acc[guide.category]) {
        acc[guide.category] = []
      }
      acc[guide.category].push(guide)
      return acc
    },
    {} as Record<string, EmergencyGuide[]>,
  )

  // Get icon for category
  const getCategoryIcon = (category: string, size: number, color: string) => {
    switch (category) {
      case "medical":
        return <Heart size={size} color={color} />
      case "natural":
        return <Wind size={size} color={color} />
      case "home":
        return <Flame size={size} color={color} />
      case "travel":
        return <AlertTriangle size={size} color={color} />
      default:
        return <AlertTriangle size={size} color={color} />
    }
  }

  // Get icon for guide
  const getGuideIcon = (guideId: string, size: number, color: string) => {
    switch (guideId) {
      case "cpr":
        return <Heart size={size} color={color} />
      case "fire-safety":
        return <Flame size={size} color={color} />
      case "tornado":
        return <Wind size={size} color={color} />
      case "hypothermia":
        return <ThermometerSnowflake size={size} color={color} />
      case "heat-stroke":
        return <ThermometerSun size={size} color={color} />
      case "allergic-reaction":
        return <AlertTriangle size={size} color={color} />
      case "drowning":
        return <Droplets size={size} color={color} />
      default:
        return <AlertTriangle size={size} color={color} />
    }
  }

  // Get color for category
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "medical":
        return "#F44336"
      case "natural":
        return "#2196F3"
      case "home":
        return "#FF9800"
      case "travel":
        return "#4CAF50"
      default:
        return colors.primary
    }
  }

  // Get category name
  const getCategoryName = (category: string) => {
    switch (category) {
      case "medical":
        return "Medical"
      case "natural":
        return "Natural Disasters"
      case "home":
        return "Home Safety"
      case "travel":
        return "Travel Safety"
      default:
        return category
    }
  }

  // Handle guide selection
  const handleGuideSelect = (guide: EmergencyGuide) => {
    setSelectedGuide(guide)
  }

  // Handle back from guide detail
  const handleBackFromGuide = () => {
    setSelectedGuide(null)
  }

  return (
    <SafeAreaView style={styles.container} edges={["right", "left"]}>
      <Stack.Screen
        options={{
          title: "Emergency Guides",
        }}
      />

      {selectedGuide ? (
        // Guide Detail View
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity style={styles.backButton} onPress={handleBackFromGuide}>
            <ArrowLeft size={24} color={colors.primary} />
            <Text style={styles.backButtonText}>All Guides</Text>
          </TouchableOpacity>

          <View style={styles.guideHeader}>
            <View
              style={[
                styles.guideIconLarge,
                {
                  backgroundColor: getCategoryColor(selectedGuide.category) + "20",
                },
              ]}
            >
              {getGuideIcon(selectedGuide.id, 40, getCategoryColor(selectedGuide.category))}
            </View>
            <Text style={styles.guideTitle}>{selectedGuide.title}</Text>
            <Text style={styles.guideCategoryBadge}>{getCategoryName(selectedGuide.category)}</Text>
          </View>

          <Card style={styles.guideCard}>
            <Text style={styles.guideDescription}>{selectedGuide.description}</Text>

            <Text style={styles.sectionTitle}>Steps to Follow</Text>
            {selectedGuide.steps.map((step, index) => (
              <View key={index} style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}

            {selectedGuide.additionalInfo && (
              <>
                <Text style={styles.sectionTitle}>Additional Information</Text>
                <Text style={styles.additionalInfo}>{selectedGuide.additionalInfo}</Text>
              </>
            )}
          </Card>

          <Text style={styles.disclaimer}>
            Disclaimer: This guide is for informational purposes only and is not a substitute for professional medical
            advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare provider with any
            questions you may have regarding a medical condition.
          </Text>
        </ScrollView>
      ) : (
        // Guide List View
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Categories */}
          <View style={styles.categoriesContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContent}
            >
              <TouchableOpacity
                style={[styles.categoryButton, selectedCategory === null && styles.categoryButtonActive]}
                onPress={() => setSelectedCategory(null)}
              >
                <Text style={[styles.categoryButtonText, selectedCategory === null && styles.categoryButtonTextActive]}>
                  All
                </Text>
              </TouchableOpacity>

              {Object.keys(guidesByCategory).map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[styles.categoryButton, selectedCategory === category && styles.categoryButtonActive]}
                  onPress={() => setSelectedCategory(category === selectedCategory ? null : category)}
                >
                  {getCategoryIcon(
                    category,
                    16,
                    selectedCategory === category ? colors.background : getCategoryColor(category),
                  )}
                  <Text
                    style={[
                      styles.categoryButtonText,
                      selectedCategory === category && styles.categoryButtonTextActive,
                    ]}
                  >
                    {getCategoryName(category)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Guides */}
          {Object.entries(guidesByCategory).map(([category, guides]) => (
            <View key={category} style={styles.categorySection}>
              <Text style={styles.categorySectionTitle}>{getCategoryName(category)}</Text>

              <View style={styles.guidesGrid}>
                {guides.map((guide) => (
                  <TouchableOpacity key={guide.id} style={styles.guideItem} onPress={() => handleGuideSelect(guide)}>
                    <View style={[styles.guideIcon, { backgroundColor: getCategoryColor(category) + "20" }]}>
                      {getGuideIcon(guide.id, 24, getCategoryColor(category))}
                    </View>
                    <Text style={styles.guideItemTitle}>{guide.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  )
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
  categoriesContainer: {
    marginBottom: layout.spacing.md,
  },
  categoriesContent: {
    paddingVertical: layout.spacing.sm,
    paddingHorizontal: layout.spacing.xs,
    gap: layout.spacing.sm,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: layout.spacing.xs,
    paddingHorizontal: layout.spacing.md,
    borderRadius: layout.borderRadius.full,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.text,
    marginLeft: 4,
  },
  categoryButtonTextActive: {
    color: colors.background,
  },
  categorySection: {
    marginBottom: layout.spacing.xl,
  },
  categorySectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: layout.spacing.sm,
  },
  guidesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  guideItem: {
    width: "48%",
    backgroundColor: colors.card,
    borderRadius: layout.borderRadius.lg,
    padding: layout.spacing.md,
    marginBottom: layout.spacing.md,
    alignItems: "center",
  },
  guideIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: layout.spacing.sm,
  },
  guideItemTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.text,
    textAlign: "center",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: layout.spacing.md,
  },
  backButtonText: {
    fontSize: typography.sizes.md,
    color: colors.primary,
    fontWeight: typography.weights.medium,
    marginLeft: layout.spacing.xs,
  },
  guideHeader: {
    alignItems: "center",
    marginBottom: layout.spacing.lg,
  },
  guideIconLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: layout.spacing.md,
  },
  guideTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    textAlign: "center",
    marginBottom: layout.spacing.xs,
  },
  guideCategoryBadge: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    backgroundColor: colors.highlight,
    paddingVertical: layout.spacing.xs,
    paddingHorizontal: layout.spacing.sm,
    borderRadius: layout.borderRadius.full,
  },
  guideCard: {
    marginBottom: layout.spacing.lg,
  },
  guideDescription: {
    fontSize: typography.sizes.md,
    color: colors.text,
    lineHeight: 24,
    marginBottom: layout.spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: layout.spacing.md,
    marginTop: layout.spacing.md,
  },
  stepItem: {
    flexDirection: "row",
    marginBottom: layout.spacing.md,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: layout.spacing.sm,
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.background,
  },
  stepText: {
    flex: 1,
    fontSize: typography.sizes.md,
    color: colors.text,
    lineHeight: 24,
  },
  additionalInfo: {
    fontSize: typography.sizes.md,
    color: colors.text,
    fontStyle: "italic",
    lineHeight: 24,
    backgroundColor: colors.highlight,
    padding: layout.spacing.md,
    borderRadius: layout.borderRadius.md,
  },
  disclaimer: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: layout.spacing.xl,
  },
})
