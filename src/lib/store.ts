'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api } from './utils'

// Client-Store hält nur UI-Zustand + eine CACHE-Kopie des Profils.
// Wahrheit über Tier & Konto liegt immer auf dem Server (/api/auth/me) —
// dieser Cache steuert nur, was gerendert wird, nie, was erlaubt ist.

export interface Profile {
  id: string
  email: string
  name: string | null
  klasse: string | null
  jahr: number | null
  profil: string | null
  school: string | null
  personal: string | null
  tier: 'free' | 'pro' | 'premium'
  verified?: boolean
  autoActions?: boolean
  streak?: number
  onboarded?: boolean
}

interface AppState {
  theme: 'light' | 'dark'
  setTheme: (t: 'light' | 'dark') => void
  profile: Profile | null
  setProfile: (p: Profile | null) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'dark',
      setTheme: (theme) => {
        set({ theme })
        if (typeof document !== 'undefined') {
          document.documentElement.dataset.theme = theme
          localStorage.setItem('lgki-theme', theme)
        }
      },
      profile: null,
      setProfile: (profile) => set({ profile }),
    }),
    { name: 'lgki-ui' }
  )
)

/** Profil vom Server nachladen (Quelle der Wahrheit). */
export async function refreshProfile(): Promise<Profile | null> {
  try {
    const res = await fetch(api('/api/auth/me'))
    if (!res.ok) { useAppStore.getState().setProfile(null); return null }
    const p = (await res.json()) as Profile
    useAppStore.getState().setProfile(p)
    return p
  } catch {
    return null
  }
}
