import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type { User } from "@/types"
import { router } from "expo-router"

interface AuthState {
  user: User | null
  isGuest: boolean
  isLoading: boolean
  error: string | null
  returnUrl?: string
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  continueAsGuest: () => void
  upgradeToPremium: () => void
  resetError: () => void
  setReturnUrl: (url: string | undefined) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isGuest: false,
      isLoading: false,
      error: null,
      returnUrl: undefined,
      setReturnUrl: (url) => set({ returnUrl: url }),

      signIn: async (email, password) => {
        set({ isLoading: true, error: null })

        try {
          // In a real app, this would use Supabase or another auth provider
          // const { data, error } = await supabase.auth.signInWithPassword({ email, password });

          // For demo purposes, simulate a successful login
          const mockUser: User = {
            id: "123456",
            email,
            name: email.split("@")[0],
            isPremium: false,
            createdAt: new Date().toISOString(),
          }

          set({
            user: mockUser,
            isGuest: false,
            isLoading: false,
          })

          // After successful sign in, check for returnUrl
          const returnUrl = get().returnUrl
          if (returnUrl) {
            set({ returnUrl: undefined })
            router.replace(returnUrl)
          } else {
            router.replace("/")
          }
        } catch (error) {
          set({
            error: "Failed to sign in. Please check your credentials.",
            isLoading: false,
          })
        }
      },

      signUp: async (email, password) => {
        set({ isLoading: true, error: null })

        try {
          // In a real app, this would use Supabase or another auth provider
          // const { data, error } = await supabase.auth.signUp({ email, password });

          // For demo purposes, simulate a successful registration
          const mockUser: User = {
            id: "123456",
            email,
            name: email.split("@")[0],
            isPremium: false,
            createdAt: new Date().toISOString(),
          }

          set({
            user: mockUser,
            isGuest: false,
            isLoading: false,
          })

          // After successful sign in, check for returnUrl
          const returnUrl = get().returnUrl
          if (returnUrl) {
            set({ returnUrl: undefined })
            router.replace(returnUrl)
          } else {
            router.replace("/")
          }
        } catch (error) {
          set({
            error: "Failed to sign up. Please try again.",
            isLoading: false,
          })
        }
      },

      signOut: async () => {
        set({ isLoading: true, error: null })

        try {
          // In a real app, this would use Supabase or another auth provider
          // await supabase.auth.signOut();

          set({
            user: null,
            isGuest: false,
            isLoading: false,
          })

          // After successful sign in, check for returnUrl - not needed for signout
          router.replace("/")
        } catch (error) {
          set({
            error: "Failed to sign out. Please try again.",
            isLoading: false,
          })
        }
      },

      resetPassword: async (email) => {
        set({ isLoading: true, error: null })

        try {
          // In a real app, this would use Supabase or another auth provider
          // await supabase.auth.resetPasswordForEmail(email);

          set({ isLoading: false })
        } catch (error) {
          set({
            error: "Failed to send reset password email. Please try again.",
            isLoading: false,
          })
        }
      },

      continueAsGuest: () => {
        set({
          user: null,
          isGuest: true,
          isLoading: false,
          error: null,
        })
      },

      upgradeToPremium: () => {
        const { user } = get()

        if (user) {
          const premiumUntil = new Date()
          premiumUntil.setFullYear(premiumUntil.getFullYear() + 1)

          set({
            user: {
              ...user,
              isPremium: true,
              premiumUntil: premiumUntil.toISOString(),
            },
          })
        }
      },

      resetError: () => {
        set({ error: null })
      },
    }),
    {
      name: "safra-auth",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)
