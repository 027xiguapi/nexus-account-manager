import { PlatformConfig } from '@/types/platform'
import { Terminal, FileJson } from 'lucide-react'
import { CodexAccountList } from './components/AccountList'
import { JsonMethod } from './methods/JsonMethod'

export const codexConfig: PlatformConfig = {
  id: 'codex',
  name: 'Codex',
  icon: Terminal,
  color: '#10A37F',
  description: 'OpenAI Codex API Account Management',

  AccountList: CodexAccountList,

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
