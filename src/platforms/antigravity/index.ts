import { PlatformConfig } from '@/types/platform'
import { Zap } from 'lucide-react'
import { AntigravityAccountList } from './components/AccountList'

export const antigravityConfig: PlatformConfig = {
  id: 'antigravity',
  name: 'Antigravity',
  icon: Zap,
  color: '#FF6B35',
  description: 'Google/Anthropic AI Services Management',
  
  AccountList: AntigravityAccountList,
  
  features: {
    oauth: true,
    quota: true,
    proxy: true,
    autoRefresh: true,
  },
}
