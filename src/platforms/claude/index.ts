import { PlatformConfig } from '@/types/platform'
import { Code2, FileJson } from 'lucide-react'
import { ClaudeAccountList } from './components/AccountList'
import { JsonMethod } from './methods'

export const claudeConfig: PlatformConfig = {
  id: 'claude',
  name: 'Claude',
  icon: Code2,
  color: '#4F46E5',
  description: 'Claude API Account Management',

  AccountList: ClaudeAccountList,

  features: {
    machineId: false,
    autoRefresh: false,
    quota: false,
  },

  addMethods: [
    {
      id: 'json',
      name: 'JSON 导入',
      description: '从 JSON 文件导入账户信息',
      icon: FileJson,
      component: JsonMethod,
    }
  ],
}


