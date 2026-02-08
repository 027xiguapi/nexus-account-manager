import { PlatformConfig } from '@/types/platform'
import { Code2 } from 'lucide-react'
import { KiroAccountList } from './components/AccountList'
import { ServiceFactory } from '@/services/ServiceFactory'
import { KiroAccountService } from './services/KiroAccountService'

// 注册服务
ServiceFactory.registerAccountService('kiro', new KiroAccountService())

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
