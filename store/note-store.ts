import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type { Note } from "@/types"

interface NoteState {
  notes: Note[]
  addNote: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => void
  updateNote: (id: string, updates: Partial<Note>) => void
  deleteNote: (id: string) => void
  setNotes: (notes: Note[]) => void // For cloud sync
  clearNotes: () => void // For account switching
}

export const useNoteStore = create<NoteState>()(
  persist(
    (set) => ({
      notes: [],
      addNote: (note) => {
        const now = new Date().toISOString()
        const newNote: Note = {
          id: Date.now().toString(),
          createdAt: now,
          updatedAt: now,
          isEncrypted: note.isEncrypted || false,
          ...note,
        }

        set((state) => ({
          notes: [...state.notes, newNote],
        }))
      },
      updateNote: (id, updates) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id ? { ...note, ...updates, updatedAt: new Date().toISOString() } : note,
          ),
        }))
      },
      deleteNote: (id) => {
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
        }))
      },
      setNotes: (notes) => {
        set({ notes })
      },
      clearNotes: () => {
        set({ notes: [] })
      },
    }),
    {
      name: "safra-notes",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)
