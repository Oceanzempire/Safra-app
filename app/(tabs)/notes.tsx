"use client"

import { useState } from "react"
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
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Stack, useRouter } from "expo-router"
import { Plus, Search, X, FileText, Trash2, Edit, Lock, Unlock, Eye, EyeOff } from "lucide-react-native"
import { colors } from "@/constants/colors"
import { typography } from "@/constants/typography"
import { layout } from "@/constants/layout"
import { Button } from "@/components/Button"
import { NoteItem } from "@/components/NoteItem"
import { EmptyState } from "@/components/EmptyState"
import { useNoteStore } from "@/store/note-store"
import type { Note } from "@/types"
import { useSettingsStore } from "@/store/settings-store"
import { useColorScheme } from "react-native"
import { Header } from "@/components/Header"
import { useTranslation } from "@/hooks/use-translation"
import CryptoJS from "crypto-js"
import { SecurityQuestionSelector } from "@/components/SecurityQuestionSelector"

export default function NotesScreen() {
  const router = useRouter()
  const { notes, addNote, updateNote, deleteNote } = useNoteStore()
  const { theme } = useSettingsStore()
  const colorScheme = useColorScheme()
  const { t } = useTranslation()

  // Determine which theme to use
  const activeTheme = theme === "system" ? colorScheme || "light" : theme

  const isDarkMode = activeTheme === "dark"

  const [searchQuery, setSearchQuery] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [newNoteTitle, setNewNoteTitle] = useState("")
  const [newNoteContent, setNewNoteContent] = useState("")
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState("")
  const [editedContent, setEditedContent] = useState("")

  // Password protection
  const [isPasswordProtected, setIsPasswordProtected] = useState(false)
  const [notePassword, setNotePassword] = useState("")
  const [passwordInput, setPasswordInput] = useState("")
  const [showPasswordInput, setShowPasswordInput] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [decryptedContent, setDecryptedContent] = useState("")
  const [securityQuestion, setSecurityQuestion] = useState("")
  const [securityAnswer, setSecurityAnswer] = useState("")
  const [showSecurityQuestion, setShowSecurityQuestion] = useState(false)

  // Filter notes based on search query
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (note.isEncrypted ? false : note.content.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  // Sort notes by updated date (newest first)
  const sortedNotes = [...filteredNotes].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )

  const handleAddNote = () => {
    if (newNoteTitle.trim() && newNoteContent.trim()) {
      // If password protected, encrypt the content
      if (isPasswordProtected && notePassword) {
        const encryptedContent = CryptoJS.AES.encrypt(newNoteContent, notePassword).toString()

        // Store security question if provided
        const securityData =
          securityQuestion && securityAnswer ? { question: securityQuestion, answer: securityAnswer } : null

        addNote({
          title: newNoteTitle,
          content: encryptedContent,
          isEncrypted: true,
          securityData,
        })
      } else {
        addNote({
          title: newNoteTitle,
          content: newNoteContent,
          isEncrypted: false,
        })
      }

      // Reset form
      setNewNoteTitle("")
      setNewNoteContent("")
      setNotePassword("")
      setSecurityQuestion("")
      setSecurityAnswer("")
      setIsPasswordProtected(false)
      setShowAddModal(false)
    }
  }

  const handleNotePress = (note: Note) => {
    setSelectedNote(note)

    if (note.isEncrypted) {
      setShowPasswordInput(true)
      setPasswordInput("")
      setDecryptedContent("")
    } else {
      setShowViewModal(true)
      setEditedTitle(note.title)
      setEditedContent(note.content)
    }
  }

  const handlePasswordSubmit = () => {
    if (selectedNote && passwordInput) {
      try {
        const decrypted = CryptoJS.AES.decrypt(selectedNote.content, passwordInput).toString(CryptoJS.enc.Utf8)

        if (decrypted) {
          setDecryptedContent(decrypted)
          setEditedContent(decrypted)
          setEditedTitle(selectedNote.title)
          setShowPasswordInput(false)
          setShowViewModal(true)
        } else {
          Alert.alert(t("Incorrect Password"), t("The password you entered is incorrect."))
        }
      } catch (error) {
        Alert.alert(t("Incorrect Password"), t("The password you entered is incorrect."))
      }
    }
  }

  const handleDeleteNote = () => {
    if (selectedNote) {
      Alert.alert(t("Delete Note"), t("Are you sure you want to delete this note? This action cannot be undone."), [
        {
          text: t("Cancel"),
          style: "cancel",
        },
        {
          text: t("Delete"),
          onPress: () => {
            try {
              // Delete the note
              deleteNote(selectedNote.id)

              // Show success message
              Alert.alert(t("Note Deleted"), t("Your note has been successfully deleted."))

              // Close the modal and reset state
              setSelectedNote(null)
              setShowViewModal(false)
            } catch (error) {
              console.error("Error deleting note:", error)
              Alert.alert(t("Error"), t("There was an error deleting your note. Please try again."))
            }
          },
          style: "destructive",
        },
      ])
    }
  }

  const handleEditNote = () => {
    setIsEditing(true)
  }

  const handleSaveEdit = () => {
    if (selectedNote && editedTitle.trim() && editedContent.trim()) {
      if (selectedNote.isEncrypted) {
        // Re-encrypt with the same password
        const encryptedContent = CryptoJS.AES.encrypt(editedContent, passwordInput).toString()

        updateNote(selectedNote.id, {
          title: editedTitle,
          content: encryptedContent,
        })
      } else {
        updateNote(selectedNote.id, {
          title: editedTitle,
          content: editedContent,
        })
      }

      setIsEditing(false)
    }
  }

  const handleCancelEdit = () => {
    if (selectedNote) {
      setEditedTitle(selectedNote.title)
      setEditedContent(selectedNote.isEncrypted ? decryptedContent : selectedNote.content)
      setIsEditing(false)
    }
  }

  const renderNoteItem = ({ item }: { item: Note }) => (
    <NoteItem note={item} onPress={handleNotePress} isDarkMode={isDarkMode} />
  )

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]} edges={["right", "left"]}>
      <Header title={t("Notes")} />

      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, isDarkMode && styles.searchBarDark]}>
          <Search size={20} color={isDarkMode ? colors.darkTextSecondary : colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, isDarkMode && styles.searchInputDark]}
            placeholder={t("Search notes...")}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={isDarkMode ? colors.darkTextSecondary : colors.textSecondary}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <X size={20} color={isDarkMode ? colors.darkTextSecondary : colors.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Notes List */}
      <View style={styles.content}>
        {sortedNotes.length > 0 ? (
          <FlatList
            data={sortedNotes}
            renderItem={renderNoteItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.notesList}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <EmptyState
            title={t("No notes found")}
            description={searchQuery ? t("Try a different search term") : t("Add your first note to get started")}
            icon={<FileText size={48} color={colors.primary} />}
            actionLabel={t("Add Note")}
            onAction={() => setShowAddModal(true)}
            isDarkMode={isDarkMode}
          />
        )}
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity style={[styles.fab, isDarkMode && styles.fabDark]} onPress={() => setShowAddModal(true)}>
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Add Note Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalContainer}>
          <View style={[styles.modalContent, isDarkMode && styles.modalContentDark]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, isDarkMode && styles.modalTitleDark]}>{t("New Note")}</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <X size={24} color={isDarkMode ? colors.darkText : colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, isDarkMode && styles.labelDark]}>{t("Title")}</Text>
              <TextInput
                style={[styles.input, isDarkMode && styles.inputDark]}
                placeholder={t("Enter note title")}
                value={newNoteTitle}
                onChangeText={setNewNoteTitle}
                placeholderTextColor={isDarkMode ? colors.darkTextSecondary : colors.textSecondary}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, isDarkMode && styles.labelDark]}>{t("Content")}</Text>
              <TextInput
                style={[styles.input, styles.textArea, isDarkMode && styles.inputDark]}
                placeholder={t("Enter note content")}
                value={newNoteContent}
                onChangeText={setNewNoteContent}
                placeholderTextColor={isDarkMode ? colors.darkTextSecondary : colors.textSecondary}
                multiline
                numberOfLines={10}
                textAlignVertical="top"
              />
            </View>

            {/* Password Protection Toggle */}
            <View style={styles.passwordToggleContainer}>
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => setIsPasswordProtected(!isPasswordProtected)}
              >
                {isPasswordProtected ? (
                  <Lock size={20} color={colors.primary} />
                ) : (
                  <Unlock size={20} color={isDarkMode ? colors.darkTextSecondary : colors.textSecondary} />
                )}
                <Text
                  style={[
                    styles.passwordToggleText,
                    isPasswordProtected && styles.passwordToggleTextActive,
                    isDarkMode && styles.passwordToggleTextDark,
                    isPasswordProtected && isDarkMode && styles.passwordToggleTextActiveDark,
                  ]}
                >
                  {t("Password Protect")}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Password Input (if protection is enabled) */}
            {isPasswordProtected && (
              <View style={styles.formGroup}>
                <Text style={[styles.label, isDarkMode && styles.labelDark]}>{t("Password")}</Text>
                <View style={[styles.passwordInputContainer, isDarkMode && styles.inputDark]}>
                  <TextInput
                    style={[styles.passwordInput, isDarkMode && styles.passwordInputDark]}
                    placeholder={t("Enter password")}
                    value={notePassword}
                    onChangeText={setNotePassword}
                    secureTextEntry={!showPassword}
                    placeholderTextColor={isDarkMode ? colors.darkTextSecondary : colors.textSecondary}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <EyeOff size={20} color={isDarkMode ? colors.darkTextSecondary : colors.textSecondary} />
                    ) : (
                      <Eye size={20} color={isDarkMode ? colors.darkTextSecondary : colors.textSecondary} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {isPasswordProtected && (
              <View style={styles.formGroup}>
                <Text style={[styles.label, isDarkMode && styles.labelDark]}>{t("Security Question")}</Text>
                <SecurityQuestionSelector
                  value={securityQuestion}
                  onChange={setSecurityQuestion}
                  isDarkMode={isDarkMode}
                />
              </View>
            )}

            {isPasswordProtected && (
              <View style={styles.formGroup}>
                <Text style={[styles.label, isDarkMode && styles.labelDark]}>{t("Answer")}</Text>
                <TextInput
                  style={[styles.input, isDarkMode && styles.inputDark]}
                  placeholder={t("Enter the answer to your security question")}
                  value={securityAnswer}
                  onChangeText={setSecurityAnswer}
                  placeholderTextColor={isDarkMode ? colors.darkTextSecondary : colors.textSecondary}
                />
              </View>
            )}

            <View style={styles.modalFooter}>
              <Button
                title={t("Cancel")}
                variant="outline"
                onPress={() => setShowAddModal(false)}
                style={styles.footerButton}
                isDarkMode={isDarkMode}
              />
              <Button
                title={t("Save Note")}
                onPress={handleAddNote}
                style={styles.footerButton}
                disabled={!newNoteTitle.trim() || !newNoteContent.trim() || (isPasswordProtected && !notePassword)}
                isDarkMode={isDarkMode}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Password Input Modal */}
      <Modal
        visible={showPasswordInput}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setShowPasswordInput(false)
          setSelectedNote(null)
        }}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.passwordModalContent, isDarkMode && styles.modalContentDark]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, isDarkMode && styles.modalTitleDark]}>{t("Protected Note")}</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowPasswordInput(false)
                  setSelectedNote(null)
                }}
              >
                <X size={24} color={isDarkMode ? colors.darkText : colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.passwordModalText, isDarkMode && styles.passwordModalTextDark]}>
              {t("This note is password protected. Please enter the password to view it.")}
            </Text>

            <View style={[styles.passwordInputContainer, isDarkMode && styles.inputDark]}>
              <TextInput
                style={[styles.passwordInput, isDarkMode && styles.passwordInputDark]}
                placeholder={t("Enter password")}
                value={passwordInput}
                onChangeText={setPasswordInput}
                secureTextEntry={!showPassword}
                placeholderTextColor={isDarkMode ? colors.darkTextSecondary : colors.textSecondary}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff size={20} color={isDarkMode ? colors.darkTextSecondary : colors.textSecondary} />
                ) : (
                  <Eye size={20} color={isDarkMode ? colors.darkTextSecondary : colors.textSecondary} />
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.forgotPasswordLink}
              onPress={() => {
                Alert.alert(
                  t("Forgot Password"),
                  t(
                    "Unfortunately, encrypted notes cannot be recovered without the password. Would you like to delete this note instead?",
                  ),
                  [
                    {
                      text: t("Cancel"),
                      style: "cancel",
                    },
                    {
                      text: t("Delete Note"),
                      style: "destructive",
                      onPress: () => {
                        if (selectedNote) {
                          deleteNote(selectedNote.id)
                          setShowPasswordInput(false)
                          setSelectedNote(null)
                        }
                      },
                    },
                  ],
                )
              }}
            >
              <Text style={[styles.forgotPasswordText, isDarkMode && styles.forgotPasswordTextDark]}>
                {t("Forgot Password?")}
              </Text>
            </TouchableOpacity>

            {selectedNote?.securityData && (
              <TouchableOpacity
                style={styles.securityQuestionButton}
                onPress={() => {
                  Alert.alert(t("Security Question"), selectedNote.securityData.question, [
                    {
                      text: t("Show Answer"),
                      onPress: () => {
                        Alert.alert(
                          t("Security Answer"),
                          t("The answer to your security question is: ") + selectedNote.securityData.answer,
                        )
                      },
                    },
                    {
                      text: t("OK"),
                      style: "cancel",
                    },
                  ])
                }}
              >
                <Text style={[styles.securityQuestionText, isDarkMode && styles.securityQuestionTextDark]}>
                  {t("View Security Question")}
                </Text>
              </TouchableOpacity>
            )}

            <Button
              title={t("Unlock Note")}
              onPress={handlePasswordSubmit}
              style={styles.unlockButton}
              disabled={!passwordInput}
              isDarkMode={isDarkMode}
            />
          </View>
        </View>
      </Modal>

      {/* View/Edit Note Modal */}
      <Modal
        visible={showViewModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setShowViewModal(false)
          setSelectedNote(null)
          setIsEditing(false)
        }}
      >
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalContainer}>
          <View style={[styles.modalContent, isDarkMode && styles.modalContentDark]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, isDarkMode && styles.modalTitleDark]}>
                {isEditing ? t("Edit Note") : t("View Note")}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowViewModal(false)
                  setSelectedNote(null)
                  setIsEditing(false)
                }}
              >
                <X size={24} color={isDarkMode ? colors.darkText : colors.text} />
              </TouchableOpacity>
            </View>

            {selectedNote && (
              <>
                {isEditing ? (
                  <>
                    <View style={styles.formGroup}>
                      <Text style={[styles.label, isDarkMode && styles.labelDark]}>{t("Title")}</Text>
                      <TextInput
                        style={[styles.input, isDarkMode && styles.inputDark]}
                        value={editedTitle}
                        onChangeText={setEditedTitle}
                        placeholderTextColor={isDarkMode ? colors.darkTextSecondary : colors.textSecondary}
                      />
                    </View>

                    <View style={styles.formGroup}>
                      <Text style={[styles.label, isDarkMode && styles.labelDark]}>{t("Content")}</Text>
                      <TextInput
                        style={[styles.input, styles.textArea, isDarkMode && styles.inputDark]}
                        value={editedContent}
                        onChangeText={setEditedContent}
                        placeholderTextColor={isDarkMode ? colors.darkTextSecondary : colors.textSecondary}
                        multiline
                        numberOfLines={10}
                        textAlignVertical="top"
                      />
                    </View>

                    <View style={styles.modalFooter}>
                      <Button
                        title={t("Cancel")}
                        variant="outline"
                        onPress={handleCancelEdit}
                        style={styles.footerButton}
                        isDarkMode={isDarkMode}
                      />
                      <Button
                        title={t("Save Changes")}
                        onPress={handleSaveEdit}
                        style={styles.footerButton}
                        disabled={!editedTitle.trim() || !editedContent.trim()}
                        isDarkMode={isDarkMode}
                      />
                    </View>
                  </>
                ) : (
                  <>
                    <Text style={[styles.noteTitle, isDarkMode && styles.noteTitleDark]}>{selectedNote.title}</Text>
                    <Text style={[styles.noteDate, isDarkMode && styles.noteDateDark]}>
                      {t("Last updated")}: {new Date(selectedNote.updatedAt).toLocaleString()}
                    </Text>
                    <View style={[styles.noteContentContainer, isDarkMode && styles.noteContentContainerDark]}>
                      <Text style={[styles.noteContent, isDarkMode && styles.noteContentDark]}>
                        {selectedNote.isEncrypted ? decryptedContent : selectedNote.content}
                      </Text>
                    </View>

                    <View style={styles.modalFooter}>
                      <Button
                        title={t("Delete")}
                        variant="danger"
                        onPress={handleDeleteNote}
                        style={styles.footerButton}
                        icon={<Trash2 size={20} color={colors.background} />}
                        isDarkMode={isDarkMode}
                      />
                      <Button
                        title={t("Edit")}
                        variant="secondary"
                        onPress={handleEditNote}
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
    flexDirection: "row",
    alignItems: "center",
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
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: layout.borderRadius.xl,
    borderTopRightRadius: layout.borderRadius.xl,
    padding: layout.spacing.lg,
    maxHeight: "90%",
  },
  modalContentDark: {
    backgroundColor: colors.darkBackground,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    flexDirection: "row",
    justifyContent: "space-between",
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
    maxHeight: "60%",
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
  passwordToggleContainer: {
    marginBottom: layout.spacing.lg,
  },
  passwordToggle: {
    flexDirection: "row",
    alignItems: "center",
  },
  passwordToggleText: {
    marginLeft: layout.spacing.sm,
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
  },
  passwordToggleTextDark: {
    color: colors.darkTextSecondary,
  },
  passwordToggleTextActive: {
    color: colors.primary,
    fontWeight: typography.weights.medium,
  },
  passwordToggleTextActiveDark: {
    color: colors.primary,
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
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
  passwordModalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: layout.borderRadius.xl,
    borderTopRightRadius: layout.borderRadius.xl,
    padding: layout.spacing.lg,
  },
  passwordModalText: {
    fontSize: typography.sizes.md,
    color: colors.text,
    marginBottom: layout.spacing.lg,
    textAlign: "center",
  },
  passwordModalTextDark: {
    color: colors.darkText,
  },
  unlockButton: {
    marginTop: layout.spacing.lg,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabDark: {
    shadowColor: "#fff",
  },
  forgotPasswordLink: {
    marginTop: layout.spacing.md,
    alignSelf: "center",
  },
  forgotPasswordText: {
    fontSize: typography.sizes.sm,
    color: colors.primary,
    textDecorationLine: "underline",
  },
  forgotPasswordTextDark: {
    color: colors.primary,
  },
  securityQuestionButton: {
    marginTop: layout.spacing.sm,
    alignSelf: "center",
  },
  securityQuestionText: {
    fontSize: typography.sizes.sm,
    color: colors.primary,
    textDecorationLine: "underline",
  },
  securityQuestionTextDark: {
    color: colors.primary,
  },
})
