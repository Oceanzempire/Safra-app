import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type { MoodEntry } from "@/types"

interface MoodState {
  entries: MoodEntry[]
  addEntry: (entry: Omit<MoodEntry, "id">) => void
  updateEntry: (id: string, updates: Partial<MoodEntry>) => void
  deleteEntry: (id: string) => void
  setEntries: (entries: MoodEntry[]) => void // New method for cloud sync
}

export const useMoodStore = create<MoodState>()(
  persist(
    (set) => ({
      entries: [],
      addEntry: (entry) => {
        const newEntry: MoodEntry = {
          id: Date.now().toString(),
          ...entry,
        }

        set((state) => ({
          entries: [...state.entries, newEntry],
        }))
      },
      updateEntry: (id, updates) => {
        set((state) => ({
          entries: state.entries.map((entry) => (entry.id === id ? { ...entry, ...updates } : entry)),
        }))
      },
      deleteEntry: (id) => {
        set((state) => ({
          entries: state.entries.filter((entry) => entry.id !== id),
        }))
      },
      setEntries: (entries) => {
        set({ entries })
      },
    }),
    {
      name: "safra-mood",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)
