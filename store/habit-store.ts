import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type { Habit } from "@/types"

interface HabitState {
  habits: Habit[]
  addHabit: (habit: Omit<Habit, "id" | "createdAt" | "completedDates">) => void
  updateHabit: (id: string, updates: Partial<Habit>) => void
  deleteHabit: (id: string) => void
  toggleHabitCompletion: (id: string, date: string) => void
  setHabits: (habits: Habit[]) => void // New method for cloud sync
}

export const useHabitStore = create<HabitState>()(
  persist(
    (set) => ({
      habits: [],
      addHabit: (habit) => {
        const newHabit: Habit = {
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          completedDates: [],
          ...habit,
        }

        set((state) => ({
          habits: [...state.habits, newHabit],
        }))
      },
      updateHabit: (id, updates) => {
        set((state) => ({
          habits: state.habits.map((habit) => (habit.id === id ? { ...habit, ...updates } : habit)),
        }))
      },
      deleteHabit: (id) => {
        set((state) => ({
          habits: state.habits.filter((habit) => habit.id !== id),
        }))
      },
      toggleHabitCompletion: (id, date) => {
        set((state) => ({
          habits: state.habits.map((habit) => {
            if (habit.id !== id) return habit

            const hasDate = habit.completedDates.includes(date)
            const completedDates = hasDate
              ? habit.completedDates.filter((d) => d !== date)
              : [...habit.completedDates, date]

            return {
              ...habit,
              completedDates,
            }
          }),
        }))
      },
      setHabits: (habits) => {
        set({ habits })
      },
    }),
    {
      name: "safra-habits",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)
