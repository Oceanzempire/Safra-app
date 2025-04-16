'use client';

import type React from 'react';
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { layout } from '@/constants/layout';
import { ChevronDown, Check } from 'lucide-react-native';
import { useTranslation } from '@/hooks/use-translation';

interface SecurityQuestionSelectorProps {
  value: string;
  onChange: (question: string) => void;
  isDarkMode?: boolean;
}

export const SecurityQuestionSelector: React.FC<
  SecurityQuestionSelectorProps
> = ({ value, onChange, isDarkMode = false }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { t } = useTranslation();

  // List of security questions
  const securityQuestions = [
    t('What was the name of your first pet?'),
    t('What was your childhood nickname?'),
    t('In what city were you born?'),
    t("What is your mother's maiden name?"),
    t('What high school did you attend?'),
    t('What was the make of your first car?'),
    t('What is your favorite movie?'),
    t('What is the name of your favorite childhood teacher?'),
    t('What is your favorite book?'),
    t('What is the name of the street you grew up on?'),
  ];

  const handleSelect = (question: string) => {
    onChange(question);
    setModalVisible(false);
  };

  return (
    <View>
      <TouchableOpacity
        style={[styles.selector, isDarkMode && styles.selectorDark]}
        onPress={() => setModalVisible(true)}
      >
        <Text
          style={[
            styles.selectorText,
            !value && styles.placeholderText,
            isDarkMode && styles.selectorTextDark,
            !value && isDarkMode && styles.placeholderTextDark,
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {value || t('Select a security question')}
        </Text>
        <ChevronDown
          size={20}
          color={isDarkMode ? colors.darkTextSecondary : colors.textSecondary}
        />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalContent, isDarkMode && styles.modalContentDark]}
          >
            <View style={styles.modalHeader}>
              <Text
                style={[styles.modalTitle, isDarkMode && styles.modalTitleDark]}
              >
                {t('Select a Security Question')}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text
                  style={[
                    styles.closeButtonText,
                    isDarkMode && styles.closeButtonTextDark,
                  ]}
                >
                  {t('Cancel')}
                </Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={securityQuestions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.questionItem,
                    isDarkMode && styles.questionItemDark,
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <Text
                    style={[
                      styles.questionText,
                      isDarkMode && styles.questionTextDark,
                    ]}
                  >
                    {item}
                  </Text>
                  {value === item && <Check size={20} color={colors.primary} />}
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.questionsList}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: layout.borderRadius.md,
    padding: layout.spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectorDark: {
    backgroundColor: colors.darkCard,
    borderColor: colors.darkBorder,
  },
  selectorText: {
    flex: 1,
    fontSize: typography.sizes.md,
    color: colors.text,
    marginRight: layout.spacing.sm,
  },
  selectorTextDark: {
    color: colors.darkText,
  },
  placeholderText: {
    color: colors.textSecondary,
  },
  placeholderTextDark: {
    color: colors.darkTextSecondary,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: layout.borderRadius.lg,
    borderTopRightRadius: layout.borderRadius.lg,
    paddingTop: layout.spacing.md,
    maxHeight: '80%',
  },
  modalContentDark: {
    backgroundColor: colors.darkBackground,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: layout.spacing.lg,
    paddingBottom: layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text,
  },
  modalTitleDark: {
    color: colors.darkText,
  },
  closeButton: {
    padding: layout.spacing.xs,
  },
  closeButtonText: {
    fontSize: typography.sizes.md,
    color: colors.primary,
  },
  closeButtonTextDark: {
    color: colors.primary,
  },
  questionsList: {
    paddingBottom: layout.spacing.xl,
  },
  questionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: layout.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  questionItemDark: {
    borderBottomColor: colors.darkBorder,
  },
  questionText: {
    fontSize: typography.sizes.md,
    color: colors.text,
    flex: 1,
    marginRight: layout.spacing.sm,
  },
  questionTextDark: {
    color: colors.darkText,
  },
});
