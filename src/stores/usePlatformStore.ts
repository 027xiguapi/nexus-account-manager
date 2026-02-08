import { create } from 'zustand'
import { BaseAccount } from '@/types/platform'

interface PlatformStore {
  accounts: BaseAccount[]
  activeAccount: BaseAccount | null
  selectedPlatform: string | null
  
  setAccounts: (accounts: BaseAccount[]) => void
  addAccount: (account: BaseAccount) => void
  updateAccount: (id: string, data: Partial<BaseAccount>) => void
  deleteAccount: (id: string) => void
  setActiveAccount: (account: BaseAccount | null) => void
  setSelectedPlatform: (platform: string | null) => void
  getAccountsByPlatform: (platform: string) => BaseAccount[]
}

export const usePlatformStore = create<PlatformStore>((set, get) => ({
  accounts: [],
  activeAccount: null,
  selectedPlatform: null,
  
  setAccounts: (accounts) => set({ accounts }),
  
  addAccount: (account) =>
    set((state) => ({
      accounts: [...state.accounts, account],
    })),
  
  updateAccount: (id, data) =>
    set((state) => ({
      accounts: state.accounts.map((acc) =>
        acc.id === id ? { ...acc, ...data, updatedAt: new Date().toISOString() } : acc
      ),
    })),
  
  deleteAccount: (id) =>
    set((state) => ({
      accounts: state.accounts.filter((acc) => acc.id !== id),
      activeAccount: state.activeAccount?.id === id ? null : state.activeAccount,
    })),
  
  setActiveAccount: (account) => set({ activeAccount: account }),
  
  setSelectedPlatform: (platform) => set({ selectedPlatform: platform }),
  
  // 添加选择器函数
  getAccountsByPlatform: (platform) => {
    return get().accounts.filter((acc) => acc.platform === platform)
  },
}))
