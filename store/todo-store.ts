import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Todo } from '@/types';
import {
  scheduleTodoNotification,
  cancelNotification,
  sendImmediateNotification,
} from '@/utils/notifications';

interface TodoState {
  todos: Todo[];
  notificationIds: Record<string, string>; // Maps todo IDs to notification IDs
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  toggleTodoStatus: (id: string) => void;
  setTodos: (todos: Todo[]) => void; // For cloud sync
}

export const useTodoStore = create<TodoState>()(
  persist(
    (set, get) => ({
      todos: [],
      notificationIds: {},
      addTodo: async (todo) => {
        const now = new Date().toISOString();
        const newTodo: Todo = {
          id: Date.now().toString(),
          createdAt: now,
          updatedAt: now,
          status: 'pending',
          ...todo,
        };

        // Schedule notification if due date is set
        let notificationId = null;
        if (newTodo.dueDate) {
          notificationId = await scheduleTodoNotification(newTodo);
        }

        set((state) => ({
          todos: [...state.todos, newTodo],
          notificationIds: notificationId
            ? { ...state.notificationIds, [newTodo.id]: notificationId }
            : state.notificationIds,
        }));

        // Send immediate notification about the new task
        sendImmediateNotification(
          'New Task Added',
          `You've added a new task: "${newTodo.title}"`,
          {
            todoId: newTodo.id,
          }
        );
      },
      updateTodo: async (id, updates) => {
        const currentTodo = get().todos.find((todo) => todo.id === id);
        if (!currentTodo) return;

        // If due date changed, reschedule notification
        if (
          updates.dueDate !== undefined &&
          updates.dueDate !== currentTodo.dueDate
        ) {
          // Cancel existing notification
          const existingNotificationId = get().notificationIds[id];
          if (existingNotificationId) {
            await cancelNotification(existingNotificationId);
          }

          // Schedule new notification if due date is set
          let newNotificationId = null;
          if (updates.dueDate) {
            const updatedTodo = { ...currentTodo, ...updates };
            newNotificationId = await scheduleTodoNotification(updatedTodo);
          }

          // Update notification IDs
          set((state) => ({
            notificationIds: {
              ...state.notificationIds,
              [id]: newNotificationId || undefined,
            },
          }));
        }

        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id
              ? { ...todo, ...updates, updatedAt: new Date().toISOString() }
              : todo
          ),
        }));
      },
      deleteTodo: async (id) => {
        // Cancel notification if exists
        const notificationId = get().notificationIds[id];
        if (notificationId) {
          await cancelNotification(notificationId);
        }

        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
          notificationIds: {
            ...state.notificationIds,
            [id]: undefined,
          },
        }));
      },
      toggleTodoStatus: async (id) => {
        const todo = get().todos.find((t) => t.id === id);
        if (!todo) return;

        const newStatus = todo.status === 'pending' ? 'completed' : 'pending';
        const now = new Date().toISOString();

        // If completing the task, cancel notification
        if (newStatus === 'completed') {
          const notificationId = get().notificationIds[id];
          if (notificationId) {
            await cancelNotification(notificationId);
          }

          // Send completion notification
          sendImmediateNotification(
            'Task Completed',
            `You've completed the task: "${todo.title}"`,
            { todoId: id }
          );
        } else if (newStatus === 'pending' && todo.dueDate) {
          // If marking as pending again and has due date, reschedule notification
          const updatedTodo = { ...todo, status: 'pending' };
          const newNotificationId = await scheduleTodoNotification(updatedTodo);

          set((state) => ({
            notificationIds: {
              ...state.notificationIds,
              [id]: newNotificationId || undefined,
            },
          }));
        }

        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id
              ? {
                  ...todo,
                  status: newStatus,
                  completedAt: newStatus === 'completed' ? now : null,
                  updatedAt: now,
                }
              : todo
          ),
        }));
      },
      setTodos: (todos) => {
        set({ todos });
      },
    }),
    {
      name: 'safra-todos',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
