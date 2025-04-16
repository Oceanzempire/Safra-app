"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { CreditCard, Check, Cloud, Lock, Zap } from "lucide-react-native"
import { colors } from "@/constants/colors"
import { typography } from "@/constants/typography"
import { layout } from "@/constants/layout"
import { Button } from "@/components/Button"
import { useAuthStore } from "@/store/auth-store"
import { useSettingsStore } from "@/store/settings-store"
import { useColorScheme } from "react-native"
import { useTranslation } from "@/hooks/use-translation"
import { Header } from "@/components/Header"

export default function CheckoutScreen() {
  const router = useRouter()
  const { theme } = useSettingsStore()
  const { upgradeToPremium } = useAuthStore()
  const colorScheme = useColorScheme()
  const { t } = useTranslation()
  const { updateSettings } = useSettingsStore()
  const { cloudSync, cloudProvider } = useSettingsStore()

  // Determine which theme to use
  const activeTheme = theme === "system" ? colorScheme || "light" : theme

  const isDarkMode = activeTheme === "dark"

  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("yearly")
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal" | "applepay" | "googlepay">("card")
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const plans = {
    monthly: {
      price: 4.99,
      period: t("month"),
      savings: 0,
    },
    yearly: {
      price: 39.99,
      period: t("year"),
      savings: 20, // 20% savings compared to monthly
    },
  }

  const handlePurchase = () => {
    if (paymentMethod === "card" && (!cardNumber || !cardName || !expiryDate || !cvv)) {
      Alert.alert(t("Incomplete Information"), t("Please fill in all card details"))
      return
    }

    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)

      // Update user to premium with expiry date (1 year from now for yearly, 1 month for monthly)
      const expiryDate = new Date()
      if (selectedPlan === "yearly") {
        expiryDate.setFullYear(expiryDate.getFullYear() + 1)
      } else {
        expiryDate.setMonth(expiryDate.getMonth() + 1)
      }

      upgradeToPremium(expiryDate.toISOString())

      // Enable cloud sync if it was the reason user upgraded
      if (cloudSync === false && cloudProvider) {
        updateSettings({ cloudSync: true })
      }

      // Show success message
      Alert.alert(t("Purchase Successful"), t("Thank you for upgrading to Safra Premium!"), [
        {
          text: t("Continue"),
          onPress: () => router.replace("/"),
        },
      ])
    }, 2000)
  }

  const formatCardNumber = (text: string) => {
    // Remove all non-digit characters
    const cleaned = text.replace(/\D/g, "")

    // Format with spaces every 4 digits
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, "$1 ")

    // Limit to 19 characters (16 digits + 3 spaces)
    return formatted.slice(0, 19)
  }

  const formatExpiryDate = (text: string) => {
    // Remove all non-digit characters
    const cleaned = text.replace(/\D/g, "")

    // Format as MM/YY
    if (cleaned.length > 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`
    }

    return cleaned
  }

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
      <Header title={t("Premium Subscription")} showBackButton={true} />

      <ScrollView style={styles.content}>
        {/* Premium Features */}
        <View style={styles.featuresContainer}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}>{t("Premium Features")}</Text>

          <View style={[styles.featureCard, isDarkMode && styles.featureCardDark]}>
            <View style={styles.featureIconContainer}>
              <Cloud size={24} color={colors.primary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, isDarkMode && styles.featureTitleDark]}>{t("Cloud Sync")}</Text>
              <Text style={[styles.featureDescription, isDarkMode && styles.featureDescriptionDark]}>
                {t("Sync your data across all your devices with Google Drive, iCloud, Dropbox, or OneDrive")}
              </Text>
            </View>
          </View>

          <View style={[styles.featureCard, isDarkMode && styles.featureCardDark]}>
            <View style={styles.featureIconContainer}>
              <Lock size={24} color={colors.primary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, isDarkMode && styles.featureTitleDark]}>{t("Advanced Security")}</Text>
              <Text style={[styles.featureDescription, isDarkMode && styles.featureDescriptionDark]}>
                {t("Password-protect notes and documents, biometric authentication, and end-to-end encryption")}
              </Text>
            </View>
          </View>

          <View style={[styles.featureCard, isDarkMode && styles.featureCardDark]}>
            <View style={styles.featureIconContainer}>
              <Zap size={24} color={colors.primary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, isDarkMode && styles.featureTitleDark]}>{t("Premium Support")}</Text>
              <Text style={[styles.featureDescription, isDarkMode && styles.featureDescriptionDark]}>
                {t("Priority customer support and early access to new features")}
              </Text>
            </View>
          </View>
        </View>

        {/* Subscription Plans */}
        <View style={styles.plansContainer}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}>{t("Choose a Plan")}</Text>

          <View style={styles.planOptions}>
            <TouchableOpacity
              style={[
                styles.planOption,
                selectedPlan === "monthly" && styles.selectedPlan,
                isDarkMode && styles.planOptionDark,
                selectedPlan === "monthly" && isDarkMode && styles.selectedPlanDark,
              ]}
              onPress={() => setSelectedPlan("monthly")}
            >
              <Text style={[styles.planName, isDarkMode && styles.planNameDark]}>{t("Monthly")}</Text>
              <Text style={[styles.planPrice, isDarkMode && styles.planPriceDark]}>${plans.monthly.price}</Text>
              <Text style={[styles.planPeriod, isDarkMode && styles.planPeriodDark]}>
                {t("per")} {plans.monthly.period}
              </Text>

              {selectedPlan === "monthly" && (
                <View style={styles.checkmarkContainer}>
                  <Check size={16} color={colors.background} />
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.planOption,
                selectedPlan === "yearly" && styles.selectedPlan,
                isDarkMode && styles.planOptionDark,
                selectedPlan === "yearly" && isDarkMode && styles.selectedPlanDark,
              ]}
              onPress={() => setSelectedPlan("yearly")}
            >
              <View style={styles.savingsBadge}>
                <Text style={styles.savingsText}>
                  {t("Save")} {plans.yearly.savings}%
                </Text>
              </View>

              <Text style={[styles.planName, isDarkMode && styles.planNameDark]}>{t("Yearly")}</Text>
              <Text style={[styles.planPrice, isDarkMode && styles.planPriceDark]}>${plans.yearly.price}</Text>
              <Text style={[styles.planPeriod, isDarkMode && styles.planPeriodDark]}>
                {t("per")} {plans.yearly.period}
              </Text>

              {selectedPlan === "yearly" && (
                <View style={styles.checkmarkContainer}>
                  <Check size={16} color={colors.background} />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.paymentContainer}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}>{t("Payment Method")}</Text>

          <View style={styles.paymentOptions}>
            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMethod === "card" && styles.selectedPayment,
                isDarkMode && styles.paymentOptionDark,
                paymentMethod === "card" && isDarkMode && styles.selectedPaymentDark,
              ]}
              onPress={() => setPaymentMethod("card")}
            >
              <CreditCard
                size={24}
                color={
                  paymentMethod === "card"
                    ? colors.primary
                    : isDarkMode
                      ? colors.darkTextSecondary
                      : colors.textSecondary
                }
              />
              <Text
                style={[
                  styles.paymentText,
                  paymentMethod === "card" && styles.selectedPaymentText,
                  isDarkMode && styles.paymentTextDark,
                  paymentMethod === "card" && isDarkMode && styles.selectedPaymentTextDark,
                ]}
              >
                {t("Credit Card")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMethod === "paypal" && styles.selectedPayment,
                isDarkMode && styles.paymentOptionDark,
                paymentMethod === "paypal" && isDarkMode && styles.selectedPaymentDark,
              ]}
              onPress={() => setPaymentMethod("paypal")}
            >
              <Text
                style={[
                  styles.paypalText,
                  paymentMethod === "paypal" && styles.selectedPaymentText,
                  isDarkMode && styles.paymentTextDark,
                  paymentMethod === "paypal" && isDarkMode && styles.selectedPaymentTextDark,
                ]}
              >
                PayPal
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMethod === "applepay" && styles.selectedPayment,
                isDarkMode && styles.paymentOptionDark,
                paymentMethod === "applepay" && isDarkMode && styles.selectedPaymentDark,
              ]}
              onPress={() => setPaymentMethod("applepay")}
            >
              <Text
                style={[
                  styles.applePayText,
                  paymentMethod === "applepay" && styles.selectedPaymentText,
                  isDarkMode && styles.paymentTextDark,
                  paymentMethod === "applepay" && isDarkMode && styles.selectedPaymentTextDark,
                ]}
              >
                Apple Pay
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMethod === "googlepay" && styles.selectedPayment,
                isDarkMode && styles.paymentOptionDark,
                paymentMethod === "googlepay" && isDarkMode && styles.selectedPaymentDark,
              ]}
              onPress={() => setPaymentMethod("googlepay")}
            >
              <Text
                style={[
                  styles.googlePayText,
                  paymentMethod === "googlepay" && styles.selectedPaymentText,
                  isDarkMode && styles.paymentTextDark,
                  paymentMethod === "googlepay" && isDarkMode && styles.selectedPaymentTextDark,
                ]}
              >
                Google Pay
              </Text>
            </TouchableOpacity>
          </View>

          {/* Credit Card Form */}
          {paymentMethod === "card" && (
            <View style={styles.cardForm}>
              <View style={styles.formGroup}>
                <Text style={[styles.label, isDarkMode && styles.labelDark]}>{t("Card Number")}</Text>
                <TextInput
                  style={[styles.input, isDarkMode && styles.inputDark]}
                  placeholder="1234 5678 9012 3456"
                  placeholderTextColor={isDarkMode ? colors.darkTextSecondary : colors.textSecondary}
                  keyboardType="number-pad"
                  value={cardNumber}
                  onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                  maxLength={19}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, isDarkMode && styles.labelDark]}>{t("Cardholder Name")}</Text>
                <TextInput
                  style={[styles.input, isDarkMode && styles.inputDark]}
                  placeholder="John Doe"
                  placeholderTextColor={isDarkMode ? colors.darkTextSecondary : colors.textSecondary}
                  value={cardName}
                  onChangeText={setCardName}
                />
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formGroup, styles.halfWidth]}>
                  <Text style={[styles.label, isDarkMode && styles.labelDark]}>{t("Expiry Date")}</Text>
                  <TextInput
                    style={[styles.input, isDarkMode && styles.inputDark]}
                    placeholder="MM/YY"
                    placeholderTextColor={isDarkMode ? colors.darkTextSecondary : colors.textSecondary}
                    keyboardType="number-pad"
                    value={expiryDate}
                    onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                    maxLength={5}
                  />
                </View>

                <View style={[styles.formGroup, styles.halfWidth]}>
                  <Text style={[styles.label, isDarkMode && styles.labelDark]}>{t("CVV")}</Text>
                  <TextInput
                    style={[styles.input, isDarkMode && styles.inputDark]}
                    placeholder="123"
                    placeholderTextColor={isDarkMode ? colors.darkTextSecondary : colors.textSecondary}
                    keyboardType="number-pad"
                    value={cvv}
                    onChangeText={setCvv}
                    maxLength={4}
                    secureTextEntry
                  />
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Order Summary */}
        <View style={[styles.summaryContainer, isDarkMode && styles.summaryContainerDark]}>
          <Text style={[styles.summaryTitle, isDarkMode && styles.summaryTitleDark]}>{t("Order Summary")}</Text>

          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, isDarkMode && styles.summaryLabelDark]}>{t("Plan")}</Text>
            <Text style={[styles.summaryValue, isDarkMode && styles.summaryValueDark]}>
              {selectedPlan === "monthly" ? t("Monthly") : t("Yearly")}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, isDarkMode && styles.summaryLabelDark]}>{t("Price")}</Text>
            <Text style={[styles.summaryValue, isDarkMode && styles.summaryValueDark]}>
              ${selectedPlan === "monthly" ? plans.monthly.price : plans.yearly.price}
            </Text>
          </View>

          {selectedPlan === "yearly" && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, isDarkMode && styles.summaryLabelDark]}>{t("Savings")}</Text>
              <Text style={[styles.savingsValue, isDarkMode && styles.savingsValueDark]}>{plans.yearly.savings}%</Text>
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={[styles.totalLabel, isDarkMode && styles.totalLabelDark]}>{t("Total")}</Text>
            <Text style={[styles.totalValue, isDarkMode && styles.totalValueDark]}>
              ${selectedPlan === "monthly" ? plans.monthly.price : plans.yearly.price}
            </Text>
          </View>
        </View>

        {/* Terms and Conditions */}
        <Text style={[styles.termsText, isDarkMode && styles.termsTextDark]}>
          {t(
            "By proceeding with the purchase, you agree to our Terms of Service and Privacy Policy. Your subscription will automatically renew unless canceled at least 24 hours before the end of the current period.",
          )}
        </Text>

        {/* Purchase Button */}
        <View style={styles.modalFooter}>
          <Button
            title={isProcessing ? t("Processing...") : t("Complete Purchase")}
            onPress={handlePurchase}
            loading={isProcessing}
            disabled={isProcessing}
            style={styles.purchaseButton}
            isDarkMode={isDarkMode}
          />

          <TouchableOpacity
            style={[styles.alreadySubscribedButton, isDarkMode && styles.alreadySubscribedButtonDark]}
            onPress={() => router.replace("/")}
          >
            <Text style={[styles.alreadySubscribedText, isDarkMode && styles.alreadySubscribedTextDark]}>
              {t("Already Subscribed")}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
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
  featuresContainer: {
    marginBottom: layout.spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: layout.spacing.md,
  },
  sectionTitleDark: {
    color: colors.darkText,
  },
  featureCard: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: layout.borderRadius.md,
    padding: layout.spacing.md,
    marginBottom: layout.spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureCardDark: {
    backgroundColor: colors.darkCard,
    borderColor: colors.darkBorder,
  },
  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.highlight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: layout.spacing.md,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.text,
    marginBottom: layout.spacing.xs,
  },
  featureTitleDark: {
    color: colors.darkText,
  },
  featureDescription: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  featureDescriptionDark: {
    color: colors.darkTextSecondary,
  },
  plansContainer: {
    marginBottom: layout.spacing.lg,
  },
  planOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  planOption: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: layout.borderRadius.md,
    padding: layout.spacing.md,
    marginHorizontal: layout.spacing.xs,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    position: "relative",
  },
  planOptionDark: {
    backgroundColor: colors.darkCard,
    borderColor: colors.darkBorder,
  },
  selectedPlan: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  selectedPlanDark: {
    borderColor: colors.primary,
  },
  planName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.text,
    marginBottom: layout.spacing.xs,
  },
  planNameDark: {
    color: colors.darkText,
  },
  planPrice: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  planPriceDark: {
    color: colors.darkText,
  },
  planPeriod: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  planPeriodDark: {
    color: colors.darkTextSecondary,
  },
  checkmarkContainer: {
    position: "absolute",
    top: -10,
    right: -10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  savingsBadge: {
    position: "absolute",
    top: -10,
    left: -10,
    backgroundColor: colors.success,
    paddingHorizontal: layout.spacing.sm,
    paddingVertical: layout.spacing.xs,
    borderRadius: layout.borderRadius.sm,
  },
  savingsText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.background,
  },
  paymentContainer: {
    marginBottom: layout.spacing.lg,
  },
  paymentOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: layout.spacing.md,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: layout.borderRadius.md,
    padding: layout.spacing.sm,
    marginRight: layout.spacing.sm,
    marginBottom: layout.spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  paymentOptionDark: {
    backgroundColor: colors.darkCard,
    borderColor: colors.darkBorder,
  },
  selectedPayment: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  selectedPaymentDark: {
    borderColor: colors.primary,
  },
  paymentText: {
    fontSize: typography.sizes.md,
    color: colors.text,
    marginLeft: layout.spacing.xs,
  },
  paymentTextDark: {
    color: colors.darkText,
  },
  selectedPaymentText: {
    color: colors.primary,
    fontWeight: typography.weights.medium,
  },
  selectedPaymentTextDark: {
    color: colors.primary,
  },
  paypalText: {
    fontSize: typography.sizes.md,
    color: colors.text,
    fontWeight: typography.weights.medium,
  },
  applePayText: {
    fontSize: typography.sizes.md,
    color: colors.text,
    fontWeight: typography.weights.medium,
  },
  googlePayText: {
    fontSize: typography.sizes.md,
    color: colors.text,
    fontWeight: typography.weights.medium,
  },
  cardForm: {
    marginTop: layout.spacing.md,
  },
  formGroup: {
    marginBottom: layout.spacing.md,
  },
  formRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfWidth: {
    width: "48%",
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.text,
    marginBottom: layout.spacing.xs,
  },
  labelDark: {
    color: colors.darkText,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: layout.borderRadius.md,
    padding: layout.spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: typography.sizes.md,
    color: colors.text,
  },
  inputDark: {
    backgroundColor: colors.darkCard,
    borderColor: colors.darkBorder,
    color: colors.darkText,
  },
  summaryContainer: {
    backgroundColor: colors.card,
    borderRadius: layout.borderRadius.md,
    padding: layout.spacing.md,
    marginBottom: layout.spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryContainerDark: {
    backgroundColor: colors.darkCard,
    borderColor: colors.darkBorder,
  },
  summaryTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: layout.spacing.md,
  },
  summaryTitleDark: {
    color: colors.darkText,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: layout.spacing.sm,
  },
  summaryLabel: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
  },
  summaryLabelDark: {
    color: colors.darkTextSecondary,
  },
  summaryValue: {
    fontSize: typography.sizes.md,
    color: colors.text,
    fontWeight: typography.weights.medium,
  },
  summaryValueDark: {
    color: colors.darkText,
  },
  savingsValue: {
    fontSize: typography.sizes.md,
    color: colors.success,
    fontWeight: typography.weights.medium,
  },
  savingsValueDark: {
    color: colors.success,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: layout.spacing.md,
  },
  totalLabel: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  totalLabelDark: {
    color: colors.darkText,
  },
  totalValue: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  totalValueDark: {
    color: colors.primary,
  },
  termsText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: layout.spacing.lg,
  },
  termsTextDark: {
    color: colors.darkTextSecondary,
  },
  purchaseButton: {
    marginBottom: layout.spacing.xl,
  },
  modalFooter: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: layout.spacing.md,
  },
  alreadySubscribedButton: {
    marginTop: layout.spacing.md,
    alignItems: "center",
    paddingVertical: layout.spacing.sm,
  },
  alreadySubscribedButtonDark: {
    // Same as light mode
  },
  alreadySubscribedText: {
    color: colors.primary,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
  },
  alreadySubscribedTextDark: {
    color: colors.primary,
  },
})
