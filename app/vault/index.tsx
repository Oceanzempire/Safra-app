'use client';

import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import {
  Plus,
  Search,
  X,
  Trash2,
  Edit,
  Lock,
  Eye,
  EyeOff,
  Shield,
  ArrowLeft,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { layout } from '@/constants/layout';
import { Button } from '@/components/Button';
import { NoteItem } from '@/components/NoteItem';
import { EmptyState } from '@/components/EmptyState';
import { useVaultStore } from '@/store/vault-store';
import type { Note } from '@/types';
import { useSettingsStore } from '@/store/settings-store';
import { useColorScheme } from 'react-native';
import { Header } from '@/components/Header';
import { useTranslation } from '@/hooks/use-translation';

export default function VaultScreen() {
  const router = useRouter();
  const {
    vaultItems,
    addVaultItem,
    updateVaultItem,
    deleteVaultItem,
    isVaultUnlocked,
    unlockVault,
    lockVault,
    vaultPassword,
  } = useVaultStore();
  const { theme } = useSettingsStore();
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  // Determine which theme to use
  const activeTheme = theme === 'system' ? colorScheme || 'light' : theme;

  const isDarkMode = activeTheme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemContent, setNewItemContent] = useState('');
  const [selectedItem, setSelectedItem] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');

  // Vault unlock
  const [passwordInput, setPasswordInput] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(!isVaultUnlocked);
  const [showPassword, setShowPassword] = useState(false);
  const [showSetupVault, setShowSetupVault] = useState(!vaultPassword);
  const [newVaultPassword, setNewVaultPassword] = useState('');
  const [confirmVaultPassword, setConfirmVaultPassword] = useState('');

  // Filter items based on search query
  const filteredItems = vaultItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort items by updated date (newest first)
  const sortedItems = [...filteredItems].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const handleAddItem = () => {
    if (newItemTitle.trim() && newItemContent.trim()) {
      addVaultItem({
        title: newItemTitle,
        content: newItemContent,
      });

      // Reset form
      setNewItemTitle('');
      setNewItemContent('');
      setShowAddModal(false);
    }
  };

  const handleItemPress = (item: Note) => {
    setSelectedItem(item);
    setShowViewModal(true);
    setEditedTitle(item.title);
    setEditedContent(item.content);
  };

  const handleDeleteItem = () => {
    if (selectedItem) {
      Alert.alert(
        t('Delete Item'),
        t(
          'Are you sure you want to delete this item? This action cannot be undone.'
        ),
        [
          {
            text: t('Cancel'),
            style: 'cancel',
          },
          {
            text: t('Delete'),
            onPress: () => {
              deleteVaultItem(selectedItem.id);
              setSelectedItem(null);
              setShowViewModal(false);
            },
            style: 'destructive',
          },
        ]
      );
    }
  };

  const handleEditItem = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (selectedItem && editedTitle.trim() && editedContent.trim()) {
      updateVaultItem(selectedItem.id, {
        title: editedTitle,
        content: editedContent,
      });

      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    if (selectedItem) {
      setEditedTitle(selectedItem.title);
      setEditedContent(selectedItem.content);
      setIsEditing(false);
    }
  };

  const handleSetupVault = () => {
    if (newVaultPassword !== confirmVaultPassword) {
      Alert.alert(
        t("Passwords Don't Match"),
        t('Please make sure your passwords match.')
      );
      return;
    }

    if (newVaultPassword.length < 6) {
      Alert.alert(
        t('Password Too Short'),
        t('Your password should be at least 6 characters.')
      );
      return;
    }

    unlockVault(newVaultPassword);
    setShowSetupVault(false);
  };

  const handleUnlockVault = () => {
    if (passwordInput === vaultPassword) {
      unlockVault(passwordInput);
      setShowPasswordInput(false);
    } else {
      Alert.alert(
        t('Incorrect Password'),
        t('The password you entered is incorrect.')
      );
    }
  };

  const handleLockVault = () => {
    lockVault();
    router.back();
  };

  const renderVaultItem = ({ item }: { item: Note }) => (
    <NoteItem note={item} onPress={handleItemPress} isDarkMode={isDarkMode} />
  );

  if (showSetupVault) {
    return (
      <SafeAreaView
        style={[styles.container, isDarkMode && styles.containerDark]}
        edges={['right', 'left']}
      >
        <Header
          title={t('Setup Vault')}
          leftIcon={
            <ArrowLeft
              size={24}
              color={isDarkMode ? colors.darkText : colors.text}
            />
          }
          onLeftPress={() => router.back()}
        />

        <View style={styles.setupContainer}>
          <View style={styles.iconContainer}>
            <Shield size={64} color={colors.primary} />
          </View>

          <Text
            style={[styles.setupTitle, isDarkMode && styles.setupTitleDark]}
          >
            {t('Create Your Secure Vault')}
          </Text>

          <Text
            style={[
              styles.setupDescription,
              isDarkMode && styles.setupDescriptionDark,
            ]}
          >
            {t(
              'Your vault will be protected with a password. This password cannot be recovered, so make sure to remember it.'
            )}
          </Text>

          <View style={styles.formGroup}>
            <Text style={[styles.label, isDarkMode && styles.labelDark]}>
              {t('New Password')}
            </Text>
            <View
              style={[
                styles.passwordInputContainer,
                isDarkMode && styles.inputDark,
              ]}
            >
              <TextInput
                style={[
                  styles.passwordInput,
                  isDarkMode && styles.passwordInputDark,
                ]}
                placeholder={t('Enter vault password')}
                value={newVaultPassword}
                onChangeText={setNewVaultPassword}
                secureTextEntry={!showPassword}
                placeholderTextColor={
                  isDarkMode ? colors.darkTextSecondary : colors.textSecondary
                }
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff
                    size={20}
                    color={
                      isDarkMode
                        ? colors.darkTextSecondary
                        : colors.textSecondary
                    }
                  />
                ) : (
                  <Eye
                    size={20}
                    color={
                      isDarkMode
                        ? colors.darkTextSecondary
                        : colors.textSecondary
                    }
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, isDarkMode && styles.labelDark]}>
              {t('Confirm Password')}
            </Text>
            <View
              style={[
                styles.passwordInputContainer,
                isDarkMode && styles.inputDark,
              ]}
            >
              <TextInput
                style={[
                  styles.passwordInput,
                  isDarkMode && styles.passwordInputDark,
                ]}
                placeholder={t('Confirm vault password')}
                value={confirmVaultPassword}
                onChangeText={setConfirmVaultPassword}
                secureTextEntry={!showPassword}
                placeholderTextColor={
                  isDarkMode ? colors.darkTextSecondary : colors.textSecondary
                }
              />
            </View>
          </View>

          <Button
            title={t('Create Vault')}
            onPress={handleSetupVault}
            style={styles.setupButton}
            disabled={!newVaultPassword || !confirmVaultPassword}
            isDarkMode={isDarkMode}
          />

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
          >
            <Text
              style={[
                styles.cancelButtonText,
                isDarkMode && styles.cancelButtonTextDark,
              ]}
            >
              {t('Cancel')}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (showPasswordInput) {
    return (
      <SafeAreaView
        style={[styles.container, isDarkMode && styles.containerDark]}
        edges={['right', 'left']}
      >
        <Header
          title={t('Unlock Vault')}
          leftIcon={
            <ArrowLeft
              size={24}
              color={isDarkMode ? colors.darkText : colors.text}
            />
          }
          onLeftPress={() => router.back()}
        />

        <View style={styles.setupContainer}>
          <View style={styles.iconContainer}>
            <Lock size={64} color={colors.primary} />
          </View>

          <Text
            style={[styles.setupTitle, isDarkMode && styles.setupTitleDark]}
          >
            {t('Enter Vault Password')}
          </Text>

          <Text
            style={[
              styles.setupDescription,
              isDarkMode && styles.setupDescriptionDark,
            ]}
          >
            {t(
              'Your vault is locked. Enter your password to access your secure items.'
            )}
          </Text>

          <View style={styles.formGroup}>
            <View
              style={[
                styles.passwordInputContainer,
                isDarkMode && styles.inputDark,
              ]}
            >
              <TextInput
                style={[
                  styles.passwordInput,
                  isDarkMode && styles.passwordInputDark,
                ]}
                placeholder={t('Enter vault password')}
                value={passwordInput}
                onChangeText={setPasswordInput}
                secureTextEntry={!showPassword}
                placeholderTextColor={
                  isDarkMode ? colors.darkTextSecondary : colors.textSecondary
                }
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff
                    size={20}
                    color={
                      isDarkMode
                        ? colors.darkTextSecondary
                        : colors.textSecondary
                    }
                  />
                ) : (
                  <Eye
                    size={20}
                    color={
                      isDarkMode
                        ? colors.darkTextSecondary
                        : colors.textSecondary
                    }
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <Button
            title={t('Unlock Vault')}
            onPress={handleUnlockVault}
            style={styles.setupButton}
            disabled={!passwordInput}
            isDarkMode={isDarkMode}
          />

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
          >
            <Text
              style={[
                styles.cancelButtonText,
                isDarkMode && styles.cancelButtonTextDark,
              ]}
            >
              {t('Cancel')}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, isDarkMode && styles.containerDark]}
      edges={['right', 'left']}
    >
      <Header
        title={t('Secure Vault')}
        leftIcon={
          <ArrowLeft
            size={24}
            color={isDarkMode ? colors.darkText : colors.text}
          />
        }
        onLeftPress={() => router.back()}
        rightIcon={
          <Lock size={24} color={isDarkMode ? colors.darkText : colors.text} />
        }
        onRightPress={handleLockVault}
      />

      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, isDarkMode && styles.searchBarDark]}>
          <Search
            size={20}
            color={isDarkMode ? colors.darkTextSecondary : colors.textSecondary}
          />
          <TextInput
            style={[styles.searchInput, isDarkMode && styles.searchInputDark]}
            placeholder={t('Search vault...')}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={
              isDarkMode ? colors.darkTextSecondary : colors.textSecondary
            }
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X
                size={20}
                color={
                  isDarkMode ? colors.darkTextSecondary : colors.textSecondary
                }
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Vault Items List */}
      <View style={styles.content}>
        {sortedItems.length > 0 ? (
          <FlatList
            data={sortedItems}
            renderItem={renderVaultItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.notesList}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <EmptyState
            title={t('No vault items found')}
            description={
              searchQuery
                ? t('Try a different search term')
                : t('Add your first secure item to get started')
            }
            icon={<Shield size={48} color={colors.primary} />}
            actionLabel={t('Add Item')}
            onAction={() => setShowAddModal(true)}
            isDarkMode={isDarkMode}
          />
        )}
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[styles.fab, isDarkMode && styles.fabDark]}
        onPress={() => setShowAddModal(true)}
      >
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Add Item Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View
            style={[styles.modalContent, isDarkMode && styles.modalContentDark]}
          >
            <View style={styles.modalHeader}>
              <Text
                style={[styles.modalTitle, isDarkMode && styles.modalTitleDark]}
              >
                {t('New Secure Item')}
              </Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <X
                  size={24}
                  color={isDarkMode ? colors.darkText : colors.text}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, isDarkMode && styles.labelDark]}>
                {t('Title')}
              </Text>
              <TextInput
                style={[styles.input, isDarkMode && styles.inputDark]}
                placeholder={t('Enter item title')}
                value={newItemTitle}
                onChangeText={setNewItemTitle}
                placeholderTextColor={
                  isDarkMode ? colors.darkTextSecondary : colors.textSecondary
                }
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, isDarkMode && styles.labelDark]}>
                {t('Content')}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  isDarkMode && styles.inputDark,
                ]}
                placeholder={t('Enter item content')}
                value={newItemContent}
                onChangeText={setNewItemContent}
                placeholderTextColor={
                  isDarkMode ? colors.darkTextSecondary : colors.textSecondary
                }
                multiline
                numberOfLines={10}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.modalFooter}>
              <Button
                title={t('Cancel')}
                variant="outline"
                onPress={() => setShowAddModal(false)}
                style={styles.footerButton}
                isDarkMode={isDarkMode}
              />
              <Button
                title={t('Save Item')}
                onPress={handleAddItem}
                style={styles.footerButton}
                disabled={!newItemTitle.trim() || !newItemContent.trim()}
                isDarkMode={isDarkMode}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* View/Edit Item Modal */}
      <Modal
        visible={showViewModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setShowViewModal(false);
          setSelectedItem(null);
          setIsEditing(false);
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View
            style={[styles.modalContent, isDarkMode && styles.modalContentDark]}
          >
            <View style={styles.modalHeader}>
              <Text
                style={[styles.modalTitle, isDarkMode && styles.modalTitleDark]}
              >
                {isEditing ? t('Edit Item') : t('View Item')}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowViewModal(false);
                  setSelectedItem(null);
                  setIsEditing(false);
                }}
              >
                <X
                  size={24}
                  color={isDarkMode ? colors.darkText : colors.text}
                />
              </TouchableOpacity>
            </View>

            {selectedItem && (
              <>
                {isEditing ? (
                  <>
                    <View style={styles.formGroup}>
                      <Text
                        style={[styles.label, isDarkMode && styles.labelDark]}
                      >
                        {t('Title')}
                      </Text>
                      <TextInput
                        style={[styles.input, isDarkMode && styles.inputDark]}
                        value={editedTitle}
                        onChangeText={setEditedTitle}
                        placeholderTextColor={
                          isDarkMode
                            ? colors.darkTextSecondary
                            : colors.textSecondary
                        }
                      />
                    </View>

                    <View style={styles.formGroup}>
                      <Text
                        style={[styles.label, isDarkMode && styles.labelDark]}
                      >
                        {t('Content')}
                      </Text>
                      <TextInput
                        style={[
                          styles.input,
                          styles.textArea,
                          isDarkMode && styles.inputDark,
                        ]}
                        value={editedContent}
                        onChangeText={setEditedContent}
                        placeholderTextColor={
                          isDarkMode
                            ? colors.darkTextSecondary
                            : colors.textSecondary
                        }
                        multiline
                        numberOfLines={10}
                        textAlignVertical="top"
                      />
                    </View>

                    <View style={styles.modalFooter}>
                      <Button
                        title={t('Cancel')}
                        variant="outline"
                        onPress={handleCancelEdit}
                        style={styles.footerButton}
                        isDarkMode={isDarkMode}
                      />
                      <Button
                        title={t('Save Changes')}
                        onPress={handleSaveEdit}
                        style={styles.footerButton}
                        disabled={!editedTitle.trim() || !editedContent.trim()}
                        isDarkMode={isDarkMode}
                      />
                    </View>
                  </>
                ) : (
                  <>
                    <Text
                      style={[
                        styles.noteTitle,
                        isDarkMode && styles.noteTitleDark,
                      ]}
                    >
                      {selectedItem.title}
                    </Text>
                    <Text
                      style={[
                        styles.noteDate,
                        isDarkMode && styles.noteDateDark,
                      ]}
                    >
                      {t('Last updated')}:{' '}
                      {new Date(selectedItem.updatedAt).toLocaleString()}
                    </Text>
                    <View
                      style={[
                        styles.noteContentContainer,
                        isDarkMode && styles.noteContentContainerDark,
                      ]}
                    >
                      <Text
                        style={[
                          styles.noteContent,
                          isDarkMode && styles.noteContentDark,
                        ]}
                      >
                        {selectedItem.content}
                      </Text>
                    </View>

                    <View style={styles.modalFooter}>
                      <Button
                        title={t('Delete')}
                        variant="danger"
                        onPress={handleDeleteItem}
                        style={styles.footerButton}
                        icon={<Trash2 size={20} color={colors.background} />}
                        isDarkMode={isDarkMode}
                      />
                      <Button
                        title={t('Edit')}
                        variant="secondary"
                        onPress={handleEditItem}
                        style={styles.footerButton}
                        icon={<Edit size={20} color={colors.background} />}
                        isDarkMode={isDarkMode}
                      />
                    </View>
                  </>
                )}
              </>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
      {/* Return to Main App Button */}
      <TouchableOpacity
        style={[styles.returnButton, isDarkMode && styles.returnButtonDark]}
        onPress={() => router.push('/(tabs)')}
      >
        <Text
          style={[
            styles.returnButtonText,
            isDarkMode && styles.returnButtonTextDark,
          ]}
        >
          {t('Return to Main App')}
        </Text>
      </TouchableOpacity>
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
  addButton: {
    padding: layout.spacing.sm,
  },
  searchContainer: {
    paddingHorizontal: layout.spacing.md,
    paddingVertical: layout.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: layout.borderRadius.md,
    paddingHorizontal: layout.spacing.md,
    paddingVertical: layout.spacing.sm,
  },
  searchBarDark: {
    backgroundColor: colors.darkCard,
    borderColor: colors.darkBorder,
  },
  searchInput: {
    flex: 1,
    marginLeft: layout.spacing.sm,
    fontSize: typography.sizes.md,
    color: colors.text,
  },
  searchInputDark: {
    color: colors.darkText,
  },
  content: {
    flex: 1,
    padding: layout.spacing.md,
  },
  notesList: {
    paddingBottom: layout.spacing.md,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: layout.borderRadius.xl,
    borderTopRightRadius: layout.borderRadius.xl,
    padding: layout.spacing.lg,
    maxHeight: '90%',
  },
  modalContentDark: {
    backgroundColor: colors.darkBackground,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: layout.spacing.lg,
  },
  modalTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  modalTitleDark: {
    color: colors.darkText,
  },
  formGroup: {
    marginBottom: layout.spacing.lg,
  },
  label: {
    fontSize: typography.sizes.md,
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
    fontSize: typography.sizes.md,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputDark: {
    backgroundColor: colors.darkCard,
    borderColor: colors.darkBorder,
    color: colors.darkText,
  },
  textArea: {
    minHeight: 200,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: layout.spacing.lg,
  },
  footerButton: {
    flex: 1,
    marginHorizontal: layout.spacing.xs,
  },
  noteTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: layout.spacing.xs,
  },
  noteTitleDark: {
    color: colors.darkText,
  },
  noteDate: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginBottom: layout.spacing.md,
  },
  noteDateDark: {
    color: colors.darkTextSecondary,
  },
  noteContentContainer: {
    backgroundColor: colors.card,
    borderRadius: layout.borderRadius.md,
    padding: layout.spacing.md,
    flex: 1,
    maxHeight: '60%',
  },
  noteContentContainerDark: {
    backgroundColor: colors.darkCard,
  },
  noteContent: {
    fontSize: typography.sizes.md,
    color: colors.text,
    lineHeight: 24,
  },
  noteContentDark: {
    color: colors.darkText,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: layout.borderRadius.md,
    paddingHorizontal: layout.spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    fontSize: typography.sizes.md,
    color: colors.text,
  },
  passwordInputDark: {
    color: colors.darkText,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabDark: {
    shadowColor: '#fff',
  },
  setupContainer: {
    flex: 1,
    padding: layout.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: layout.spacing.xl,
  },
  setupTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: layout.spacing.md,
    textAlign: 'center',
  },
  setupTitleDark: {
    color: colors.darkText,
  },
  setupDescription: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    marginBottom: layout.spacing.xl,
    textAlign: 'center',
    paddingHorizontal: layout.spacing.lg,
  },
  setupDescriptionDark: {
    color: colors.darkTextSecondary,
  },
  setupButton: {
    width: '100%',
    marginTop: layout.spacing.md,
  },
  cancelButton: {
    marginTop: layout.spacing.lg,
    padding: layout.spacing.md,
  },
  cancelButtonText: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
  },
  cancelButtonTextDark: {
    color: colors.darkTextSecondary,
  },
  returnButton: {
    position: 'absolute',
    bottom: 90,
    left: 20,
    right: 20,
    backgroundColor: colors.primary,
    paddingVertical: layout.spacing.md,
    borderRadius: layout.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  returnButtonDark: {
    backgroundColor: colors.primary,
    shadowColor: '#fff',
  },
  returnButtonText: {
    color: colors.background,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
  },
  returnButtonTextDark: {
    color: colors.darkBackground,
  },
});
