import { PlatformConfig } from '@/types/platform'
import { Sparkles, FileJson } from 'lucide-react'
import { GeminiAccountList } from './components/AccountList'
import { JsonMethod } from './methods/JsonMethod'

export const geminiConfig: PlatformConfig = {
  id: 'gemini',
  name: 'Gemini',
  icon: Sparkles,
  color: '#4285F4',
  description: 'Google Gemini API Account Management',

  AccountList: GeminiAccountList,

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
