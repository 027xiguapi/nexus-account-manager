/**
 * Codex Provider 预设配置
 * 基于 cc-switch 的完整供应商列表
 */

import { CodexProviderPreset } from '@/types/provider'

export const codexProviderPresets: CodexProviderPreset[] = [
  {
    id: 'openai-official',
    name: 'OpenAI Official',
    category: 'official',
    websiteUrl: 'https://platform.openai.com',
    apiKeyUrl: 'https://platform.openai.com/api-keys',
    description: 'OpenAI 官方 API',
    icon: 'openai',
    iconColor: '#10A37F',
    config: {
      env: {
        OPENAI_API_KEY: '',
      },
    },
  },
  {
    id: 'azure-openai',
    name: 'Azure OpenAI',
    category: 'official',
    websiteUrl: 'https://learn.microsoft.com/en-us/azure/ai-foundry/openai/how-to/codex',
    description: '微软 Azure OpenAI 服务',
    icon: 'azure',
    iconColor: '#0078D4',
    config: {
      env: {
        OPENAI_BASE_URL: 'https://YOUR_RESOURCE_NAME.openai.azure.com/openai',
        OPENAI_API_KEY: '',
        OPENAI_MODEL: 'gpt-5.2',
      },
    },
    endpointCandidates: ['https://YOUR_RESOURCE_NAME.openai.azure.com/openai'],
  },
  {
    id: 'aihubmix',
    name: 'AiHubMix',
    category: 'aggregator',
    websiteUrl: 'https://aihubmix.com',
    apiKeyUrl: 'https://aihubmix.com',
    description: 'AiHubMix API 聚合平台',
    icon: 'aihubmix',
    iconColor: '#006FFB',
    config: {
      env: {
        OPENAI_BASE_URL: 'https://aihubmix.com/v1',
        OPENAI_API_KEY: '',
        OPENAI_MODEL: 'gpt-5.2',
      },
    },
    endpointCandidates: ['https://aihubmix.com/v1', 'https://api.aihubmix.com/v1'],
  },
  {
    id: 'dmxapi',
    name: 'DMXAPI',
    category: 'aggregator',
    websiteUrl: 'https://www.dmxapi.cn',
    apiKeyUrl: 'https://www.dmxapi.cn',
    description: 'DMXAPI 聚合平台',
    isPartner: true,
    config: {
      env: {
        OPENAI_BASE_URL: 'https://www.dmxapi.cn/v1',
        OPENAI_API_KEY: '',
        OPENAI_MODEL: 'gpt-5.2',
      },
    },
    endpointCandidates: ['https://www.dmxapi.cn/v1'],
  },
  {
    id: 'packycode',
    name: 'PackyCode',
    category: 'third_party',
    websiteUrl: 'https://www.packyapi.com',
    apiKeyUrl: 'https://www.packyapi.com/register?aff=cc-switch',
    description: 'PackyCode API 中转服务',
    icon: 'packycode',
    isPartner: true,
    config: {
      env: {
        OPENAI_BASE_URL: 'https://www.packyapi.com/v1',
        OPENAI_API_KEY: '',
        OPENAI_MODEL: 'gpt-5.2',
      },
    },
    endpointCandidates: ['https://www.packyapi.com/v1', 'https://api-slb.packyapi.com/v1'],
  },
  {
    id: 'cubence',
    name: 'Cubence',
    category: 'third_party',
    websiteUrl: 'https://cubence.com',
    apiKeyUrl: 'https://cubence.com/signup?code=CCSWITCH&source=ccs',
    description: 'Cubence API 中转服务',
    icon: 'cubence',
    iconColor: '#000000',
    isPartner: true,
    config: {
      env: {
        OPENAI_BASE_URL: 'https://api.cubence.com/v1',
        OPENAI_API_KEY: '',
        OPENAI_MODEL: 'gpt-5.2',
      },
    },
    endpointCandidates: [
      'https://api.cubence.com/v1',
      'https://api-cf.cubence.com/v1',
      'https://api-dmit.cubence.com/v1',
      'https://api-bwg.cubence.com/v1',
    ],
  },
  {
    id: 'aigocode',
    name: 'AIGoCode',
    category: 'third_party',
    websiteUrl: 'https://aigocode.com',
    apiKeyUrl: 'https://aigocode.com/invite/CC-SWITCH',
    description: 'AIGoCode API 中转服务',
    icon: 'aigocode',
    iconColor: '#5B7FFF',
    isPartner: true,
    config: {
      env: {
        OPENAI_BASE_URL: 'https://api.aigocode.com',
        OPENAI_API_KEY: '',
        OPENAI_MODEL: 'gpt-5.2',
      },
    },
  },
  {
    id: 'rightcode',
    name: 'RightCode',
    category: 'third_party',
    websiteUrl: 'https://www.right.codes',
    apiKeyUrl: 'https://www.right.codes/register?aff=CCSWITCH',
    description: 'RightCode API 中转服务',
    icon: 'rc',
    iconColor: '#E96B2C',
    isPartner: true,
    config: {
      env: {
        OPENAI_BASE_URL: 'https://right.codes/codex/v1',
        OPENAI_API_KEY: '',
        OPENAI_MODEL: 'gpt-5.2',
      },
    },
  },
  {
    id: 'aicodemirror',
    name: 'AICodeMirror',
    category: 'third_party',
    websiteUrl: 'https://www.aicodemirror.com',
    apiKeyUrl: 'https://www.aicodemirror.com/register?invitecode=9915W3',
    description: 'AICodeMirror API 中转服务',
    icon: 'aicodemirror',
    iconColor: '#000000',
    isPartner: true,
    config: {
      env: {
        OPENAI_BASE_URL: 'https://api.aicodemirror.com/api/codex/backend-api/codex',
        OPENAI_API_KEY: '',
        OPENAI_MODEL: 'gpt-5.2',
      },
    },
    endpointCandidates: [
      'https://api.aicodemirror.com/api/codex/backend-api/codex',
      'https://api.claudecode.net.cn/api/codex/backend-api/codex',
    ],
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    category: 'aggregator',
    websiteUrl: 'https://openrouter.ai',
    apiKeyUrl: 'https://openrouter.ai/keys',
    description: 'OpenRouter API 聚合平台',
    icon: 'openrouter',
    iconColor: '#6566F1',
    config: {
      env: {
        OPENAI_BASE_URL: 'https://openrouter.ai/api/v1',
        OPENAI_API_KEY: '',
        OPENAI_MODEL: 'openai/gpt-4-turbo',
      },
    },
  },
  {
    id: 'custom',
    name: 'Custom Provider',
    category: 'custom',
    websiteUrl: '',
    description: '自定义供应商配置',
    config: {
      env: {
        OPENAI_BASE_URL: '',
        OPENAI_API_KEY: '',
      },
    },
  },
]

export function getCodexPreset(id: string): CodexProviderPreset | undefined {
  return codexProviderPresets.find((p) => p.id === id)
}

export function getCodexPresetsByCategory(category: string): CodexProviderPreset[] {
  return codexProviderPresets.filter((p) => p.category === category)
}
