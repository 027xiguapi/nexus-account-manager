import { PlatformConfig } from '@/types/platform'
import { Code2 } from 'lucide-react'
import { KiroAccountList } from './components/AccountList'

export const kiroConfig: PlatformConfig = {
  id: 'kiro',
  name: 'Kiro IDE',
  icon: Code2,
  color: '#4F46E5',
  description: 'Kiro IDE Account Management',
  
  AccountList: KiroAccountList,
  
  features: {
    machineId: true,
    autoRefresh: true,
    quota: true,
  },
}
