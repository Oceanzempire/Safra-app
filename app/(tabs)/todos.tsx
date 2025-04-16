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
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Stack, useRouter } from "expo-router"
import { Plus, Search, X, CheckCircle } from "lucide-react-native"
import { colors } from "@/constants/colors"
import { typography } from "@/constants/typography"
import { layout } from "@/constants/layout"
import { Button } from "@/components/Button"
import { TodoItem } from "@/components/TodoItem"
import { EmptyState } from "@/components/EmptyState"
import { useTodoStore } from "@/store/todo-store"
import type { Todo } from "@/types"
// At the top of the component, add the Header component
import { Header } from "@/components/Header"

export default function TodosScreen() {
  const router = useRouter()
  const { todos, addTodo, updateTodo, deleteTodo, toggleTodoStatus } = useTodoStore()

  const [searchQuery, setSearchQuery] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [newTodoTitle, setNewTodoTitle] = useState("")
  const [newTodoDescription, setNewTodoDescription] = useState("")
  const [newTodoPriority, setNewTodoPriority] = useState<"low" | "medium" | "high">("medium")

  // Filter todos based on search query
  const filteredTodos = todos.filter(
    (todo) =>
      todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (todo.description && todo.description.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  // Group todos by status
  const pendingTodos = filteredTodos.filter((todo) => todo.status === "pending")
  const completedTodos = filteredTodos.filter((todo) => todo.status === "completed")

  const handleAddTodo = () => {
    if (newTodoTitle.trim()) {
      addTodo({
        title: newTodoTitle,
        description: newTodoDescription,
        status: "pending",
        priority: newTodoPriority,
      })

      // Reset form
      setNewTodoTitle("")
      setNewTodoDescription("")
      setNewTodoPriority("medium")
      setShowAddModal(false)
    }
  }

  const handleTodoPress = (todo: Todo) => {
    // In a real app, you might navigate to a detail screen
    console.log("Todo pressed:", todo)
  }

  const renderTodoItem = ({ item }: { item: Todo }) => (
    <TodoItem todo={item} onToggle={toggleTodoStatus} onDelete={deleteTodo} onPress={handleTodoPress} />
  )

  return (
    <SafeAreaView style={styles.container} edges={["right", "left"]}>
      {/* Replace the Stack.Screen component with: */}
      <Header
        title={"Tasks"}
        rightComponent={
          <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
            <Plus size={24} color={colors.primary} />
          </TouchableOpacity>
        }
      />

      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tasks..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.textSecondary}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Todo Lists */}
      <View style={styles.content}>
        {filteredTodos.length > 0 ? (
          <>
            {/* Pending Todos */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Pending ({pendingTodos.length})</Text>
              <FlatList
                data={pendingTodos}
                renderItem={renderTodoItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.todoList}
                showsVerticalScrollIndicator={false}
              />
            </View>

            {/* Completed Todos */}
            {completedTodos.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Completed ({completedTodos.length})</Text>
                <FlatList
                  data={completedTodos}
                  renderItem={renderTodoItem}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.todoList}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            )}
          </>
        ) : (
          <EmptyState
            title="No tasks found"
            description={searchQuery ? "Try a different search term" : "Add your first task to get started"}
            icon={<CheckCircle size={48} color={colors.primary} />}
            actionLabel="Add Task"
            onAction={() => setShowAddModal(true)}
          />
        )}
      </View>

      {/* Add Todo Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Task</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter task title"
                value={newTodoTitle}
                onChangeText={setNewTodoTitle}
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Description (optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter task description"
                value={newTodoDescription}
                onChangeText={setNewTodoDescription}
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Priority</Text>
              <View style={styles.priorityContainer}>
                <TouchableOpacity
                  style={[
                    styles.priorityButton,
                    newTodoPriority === "low" && styles.priorityButtonActive,
                    { borderColor: colors.success },
                  ]}
                  onPress={() => setNewTodoPriority("low")}
                >
                  <Text
                    style={[
                      styles.priorityText,
                      newTodoPriority === "low" && styles.priorityTextActive,
                      {
                        color: newTodoPriority === "low" ? colors.background : colors.success,
                      },
                    ]}
                  >
                    Low
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.priorityButton,
                    newTodoPriority === "medium" && styles.priorityButtonActive,
                    { borderColor: colors.secondary },
                  ]}
                  onPress={() => setNewTodoPriority("medium")}
                >
                  <Text
                    style={[
                      styles.priorityText,
                      newTodoPriority === "medium" && styles.priorityTextActive,
                      {
                        color: newTodoPriority === "medium" ? colors.background : colors.secondary,
                      },
                    ]}
                  >
                    Medium
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.priorityButton,
                    newTodoPriority === "high" && styles.priorityButtonActive,
                    { borderColor: colors.danger },
                  ]}
                  onPress={() => setNewTodoPriority("high")}
                >
                  <Text
                    style={[
                      styles.priorityText,
                      newTodoPriority === "high" && styles.priorityTextActive,
                      {
                        color: newTodoPriority === "high" ? colors.background : colors.danger,
                      },
                    ]}
                  >
                    High
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.modalFooter}>
              <Button
                title="Cancel"
                variant="outline"
                onPress={() => setShowAddModal(false)}
                style={styles.footerButton}
              />
              <Button
                title="Add Task"
                onPress={handleAddTodo}
                style={styles.footerButton}
                disabled={!newTodoTitle.trim()}
              />
            </View>
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
  searchInput: {
    flex: 1,
    marginLeft: layout.spacing.sm,
    fontSize: typography.sizes.md,
    color: colors.text,
  },
  content: {
    flex: 1,
    padding: layout.spacing.md,
  },
  section: {
    marginBottom: layout.spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: layout.spacing.sm,
  },
  todoList: {
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
    maxHeight: "80%",
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
  formGroup: {
    marginBottom: layout.spacing.lg,
  },
  label: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.text,
    marginBottom: layout.spacing.xs,
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
  textArea: {
    minHeight: 100,
  },
  priorityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  priorityButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: layout.borderRadius.md,
    paddingVertical: layout.spacing.sm,
    alignItems: "center",
    marginHorizontal: layout.spacing.xs,
  },
  priorityButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  priorityText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
  },
  priorityTextActive: {
    color: colors.background,
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
})
