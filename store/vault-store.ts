import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type { Note } from "@/types"

interface VaultState {
  vaultItems: Note[]
  vaultPassword: string | null
  isVaultUnlocked: boolean
  addVaultItem: (item: Omit<Note, "id" | "createdAt" | "updatedAt">) => void
  updateVaultItem: (id: string, updates: Partial<Note>) => void
  deleteVaultItem: (id: string) => void
  unlockVault: (password: string) => void
  lockVault: () => void
  changeVaultPassword: (oldPassword: string, newPassword: string) => boolean
}

export const useVaultStore = create<VaultState>()(
  persist(
    (set, get) => ({
      vaultItems: [],
      vaultPassword: null,
      isVaultUnlocked: false,

      addVaultItem: (item) => {
        const now = new Date().toISOString()
        const newItem: Note = {
          id: Date.now().toString(),
          createdAt: now,
          updatedAt: now,
          ...item,
        }

        set((state) => ({
          vaultItems: [...state.vaultItems, newItem],
        }))
      },

      updateVaultItem: (id, updates) => {
        set((state) => ({
          vaultItems: state.vaultItems.map((item) =>
            item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item,
          ),
        }))
      },

      deleteVaultItem: (id) => {
        set((state) => ({
          vaultItems: state.vaultItems.filter((item) => item.id !== id),
        }))
      },

      unlockVault: (password) => {
        set((state) => {
          // If this is the first time setting up the vault
          if (!state.vaultPassword) {
            return {
              vaultPassword: password,
              isVaultUnlocked: true,
            }
          }

          // Otherwise, just unlock the vault
          return {
            isVaultUnlocked: true,
          }
        })
      },

      lockVault: () => {
        set({ isVaultUnlocked: false })
      },

      changeVaultPassword: (oldPassword, newPassword) => {
        const { vaultPassword } = get()

        if (oldPassword !== vaultPassword) {
          return false
        }

        set({ vaultPassword: newPassword })
        return true
      },
    }),
    {
      name: "safra-vault",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)
