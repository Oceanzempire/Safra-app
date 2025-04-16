import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type { EmergencyContact, Document, UserProfile } from "@/types"

interface EmergencyState {
  contacts: EmergencyContact[]
  documents: Document[]
  profile: UserProfile
  lastKnownLocation?: {
    latitude: number
    longitude: number
    timestamp: string
  }

  // Contacts
  addContact: (contact: Omit<EmergencyContact, "id">) => void
  updateContact: (id: string, updates: Partial<EmergencyContact>) => void
  deleteContact: (id: string) => void
  setContacts: (contacts: EmergencyContact[]) => void // New method for cloud sync

  // Documents
  addDocument: (document: Omit<Document, "id" | "createdAt">) => void
  updateDocument: (id: string, updates: Partial<Document>) => void
  deleteDocument: (id: string) => void
  setDocuments: (documents: Document[]) => void // New method for cloud sync

  // Profile
  updateProfile: (updates: Partial<UserProfile>) => void
  setProfile: (profile: UserProfile) => void // New method for cloud sync

  // Location
  updateLocation: (location: { latitude: number; longitude: number }) => void
}

export const useEmergencyStore = create<EmergencyState>()(
  persist(
    (set) => ({
      contacts: [],
      documents: [],
      profile: {
        name: "",
      },

      // Contacts
      addContact: (contact) => {
        const newContact: EmergencyContact = {
          id: Date.now().toString(),
          ...contact,
        }

        set((state) => ({
          contacts: [...state.contacts, newContact],
        }))
      },
      updateContact: (id, updates) => {
        set((state) => ({
          contacts: state.contacts.map((contact) => (contact.id === id ? { ...contact, ...updates } : contact)),
        }))
      },
      deleteContact: (id) => {
        set((state) => ({
          contacts: state.contacts.filter((contact) => contact.id !== id),
        }))
      },
      setContacts: (contacts) => {
        set({ contacts })
      },

      // Documents
      addDocument: (document) => {
        const newDocument: Document = {
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          ...document,
        }

        set((state) => ({
          documents: [...state.documents, newDocument],
        }))
      },
      updateDocument: (id, updates) => {
        set((state) => ({
          documents: state.documents.map((document) => (document.id === id ? { ...document, ...updates } : document)),
        }))
      },
      deleteDocument: (id) => {
        set((state) => ({
          documents: state.documents.filter((document) => document.id !== id),
        }))
      },
      setDocuments: (documents) => {
        set({ documents })
      },

      // Profile
      updateProfile: (updates) => {
        set((state) => ({
          profile: { ...state.profile, ...updates },
        }))
      },
      setProfile: (profile) => {
        set({ profile })
      },

      // Location
      updateLocation: (location) => {
        set({
          lastKnownLocation: {
            ...location,
            timestamp: new Date().toISOString(),
          },
        })
      },
    }),
    {
      name: "safra-emergency",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)
