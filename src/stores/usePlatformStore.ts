import { create } from 'zustand'
import { invoke } from '@tauri-apps/api/core'
import { Account } from '@/types/account'

// Backend Account Structure (matches Rust struct)
interface BackendAccount {
  id: string
  platform: string
  name: string | null
  email: string
  avatar: string | null
  is_active: boolean
  last_used_at: number
  created_at: number
  platform_data: any
}

interface PlatformStore {
  accounts: Account[]
  activeAccount: Account | null
  selectedPlatform: string | null
  isLoading: boolean
  error: string | null

  loadAllAccounts: () => Promise<void>
  addAccount: (account: Account) => Promise<void>
  updateAccount: (id: string, data: Partial<Account>) => Promise<void>
  deleteAccount: (id: string) => Promise<void>
  setActiveAccount: (account: Account | null) => void
  setSelectedPlatform: (platform: string | null) => void
  getAccountsByPlatform: (platform: string) => Account[]
}

// Helper: Transform Frontend -> Backend
const toBackend = (account: Account): BackendAccount => {
  // Extract common fields
  const { id, platform, name, email, avatar, isActive, lastUsedAt, createdAt, ...rest } = account

  return {
    id,
    platform,
    name: name || null,
    email,
    avatar: avatar || null,
    is_active: isActive,
    last_used_at: lastUsedAt,
    created_at: createdAt,
    platform_data: rest // Store remaining platform-specific fields in platform_data
  }
}

// Helper: Transform Backend -> Frontend
const toFrontend = (backend: BackendAccount): Account => {
  const { id, platform, name, email, avatar, is_active, last_used_at, created_at, platform_data } = backend

  const common = {
    id,
    platform: platform as 'antigravity' | 'kiro',
    name: name || undefined,
    email,
    avatar: avatar || undefined,
    isActive: is_active,
    lastUsedAt: last_used_at, // Provide default if missing? No, backend guarantees i64.
    createdAt: created_at,
  }

  // Merge common fields with platform data
  return { ...common, ...platform_data } as Account
}

export const usePlatformStore = create<PlatformStore>((set, get) => ({
  accounts: [],
  activeAccount: null,
  selectedPlatform: null,
  isLoading: false,
  error: null,

  loadAllAccounts: async () => {
    set({ isLoading: true, error: null })
    try {
      const backendAccounts = await invoke<BackendAccount[]>('get_accounts')
      const accounts = backendAccounts.map(toFrontend)
      set({ accounts, isLoading: false })
    } catch (err: any) {
      console.error('Failed to load accounts:', err)
      set({ error: err.message || 'Failed to load accounts', isLoading: false })
    }
  },

  addAccount: async (account) => {
    set({ isLoading: true, error: null })
    try {
      const backendAccount = toBackend(account)
      await invoke('add_account', { account: backendAccount })
      set((state) => ({
        accounts: [...state.accounts, account],
        isLoading: false
      }))
    } catch (err: any) {
      console.error('Failed to add account:', err)
      set({ error: err.message || 'Failed to add account', isLoading: false })
      throw err
    }
  },

  updateAccount: async (id, data) => {
    set({ isLoading: true, error: null })
    try {
      const current = get().accounts.find(a => a.id === id)
      if (!current) throw new Error('Account not found')

      // Calculate updated account state
      const updated = { ...current, ...data } as Account
      updated.lastUsedAt = Date.now() // Update usage time on modification? Or strictly explicitly? 
      // User might just be editing name. Let's not auto-update lastUsedAt unless explicit.
      // But we need to make sure `updated` is valid.

      const backendAccount = toBackend(updated)
      await invoke('update_account', { id, account: backendAccount })

      set((state) => ({
        accounts: state.accounts.map((acc) => (acc.id === id ? updated : acc)),
        isLoading: false
      }))
    } catch (err: any) {
      console.error('Failed to update account:', err)
      set({ error: err.message || 'Failed to update account', isLoading: false })
      throw err
    }
  },

  deleteAccount: async (id) => {
    set({ isLoading: true, error: null })
    try {
      await invoke('delete_account', { id })
      set((state) => ({
        accounts: state.accounts.filter((acc) => acc.id !== id),
        activeAccount: state.activeAccount?.id === id ? null : state.activeAccount,
        isLoading: false
      }))
    } catch (err: any) {
      console.error('Failed to delete account:', err)
      set({ error: err.message || 'Failed to delete account', isLoading: false })
    }
  },

  setActiveAccount: (account) => set({ activeAccount: account }),

  setSelectedPlatform: (platform) => set({ selectedPlatform: platform }),

  getAccountsByPlatform: (platform) => {
    return get().accounts.filter((acc) => acc.platform === platform)
  },
}))
