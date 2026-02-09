# Claude 平台功能说明

## 已完成的功能

✅ **JSON 导入** - 支持从 JSON 配置文件导入 Claude API 账号
✅ **账号列表** - 显示所有 Claude 账号，支持网格布局
✅ **账号切换** - 双击卡片或点击电源按钮切换激活账号
✅ **账号删除** - 支持删除账号（需确认）
✅ **账号导出** - 支持导出账号配置为 JSON 格式
✅ **Base URL 显示** - 在账号卡片上显示 API Base URL
✅ **多语言支持** - 中英文界面

## 文件结构

```
src/platforms/claude/
├── index.ts                    # 平台配置入口
├── components/
│   └── AccountList.tsx         # 账号列表组件
├── methods/
│   ├── index.ts               # 导入方法导出
│   └── JsonMethod.tsx         # JSON 导入组件
└── README.md                  # 平台使用文档
```

## JSON 配置格式

```json
{
  "env": {
    "ANTHROPIC_API_KEY": "sk-ant-...",
    "ANTHROPIC_AUTH_TOKEN": "sk-ant-...",
    "ANTHROPIC_BASE_URL": "https://api.anthropic.com"
  }
}
```

### 字段说明

- `ANTHROPIC_API_KEY` (必需): Claude API 密钥
- `ANTHROPIC_AUTH_TOKEN` (可选): 认证令牌
- `ANTHROPIC_BASE_URL` (可选): API 基础 URL

## 使用步骤

### 1. 准备 JSON 配置文件

创建一个 JSON 文件（如 `claude-config.json`），内容如下：

```json
{
  "env": {
    "ANTHROPIC_API_KEY": "sk-PalOEKekBGyth6ClwEES322s15mCUW93VWPJvQlXbgdFYDuW",
    "ANTHROPIC_AUTH_TOKEN": "sk-PalOEKekBGyth6ClwEES322s15mCUW93VWPJvQlXbgdFYDuW",
    "ANTHROPIC_BASE_URL": "https://routerpark.com"
  }
}
```

### 2. 导入账号

1. 启动应用程序
2. 在左侧导航栏选择 "Accounts"（账号管理）
3. 选择 "Claude" 平台标签
4. 点击右上角的 "添加账号" 按钮
5. 在弹出的对话框中选择 "JSON 导入" 方式
6. 粘贴 JSON 配置或点击 "上传文件" 按钮选择 JSON 文件
7. 点击 "导入" 按钮

### 3. 管理账号

#### 切换账号
- **方式 1**: 双击账号卡片
- **方式 2**: 悬停在卡片上，点击电源图标 🔌

#### 查看详情
- 悬停在卡片上，点击信息图标 ℹ️

#### 复制邮箱
- 点击账号卡片上的邮箱地址

#### 删除账号
- 悬停在卡片上，点击删除图标 🗑️
- 确认删除操作

#### 导出账号
- 点击页面右上角的 "导出" 按钮
- 选择导出格式和选项
- 下载配置文件

## 账号卡片功能

每个 Claude 账号卡片显示：

- **邮箱地址**: 从 Base URL 提取或使用默认值
- **账号名称**: 从 Base URL 提取的域名
- **API 标签**: 显示 "API" 标签
- **平台标签**: 显示 "Claude" 标签
- **Base URL**: 显示完整的 API 基础 URL
- **激活状态**: 绿色指示器和边框高亮

### 操作按钮（悬停显示）

- 🔌 **切换**: 激活/切换到此账号
- 🔄 **刷新**: 刷新账号信息
- 📋 **复制**: 复制邮箱地址
- 💾 **导出**: 导出账号配置
- ℹ️ **详情**: 查看完整账号信息
- 🗑️ **删除**: 删除此账号

## 示例配置

### 标准 Claude API

```json
{
  "env": {
    "ANTHROPIC_API_KEY": "sk-ant-api03-xxx",
    "ANTHROPIC_BASE_URL": "https://api.anthropic.com"
  }
}
```

### 使用代理服务

```json
{
  "env": {
    "ANTHROPIC_API_KEY": "sk-xxx",
    "ANTHROPIC_BASE_URL": "https://routerpark.com"
  }
}
```

### 完整配置

```json
{
  "env": {
    "ANTHROPIC_API_KEY": "sk-ant-api03-xxx",
    "ANTHROPIC_AUTH_TOKEN": "sk-ant-session-xxx",
    "ANTHROPIC_BASE_URL": "https://custom-proxy.example.com"
  }
}
```

## 技术实现

### 类型定义

```typescript
// src/types/account.ts
export interface ClaudeAccount extends BaseAccount {
    platform: 'claude';
    apiKey: string;
    authToken?: string;
    baseUrl: string;
}
```

### 平台配置

```typescript
// src/platforms/claude/index.ts
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
```

## 注意事项

⚠️ **安全提示**:
- API Key 包含敏感信息，请妥善保管
- 导出的 JSON 文件包含完整凭证，请勿分享
- 建议定期更换 API Key

⚠️ **使用限制**:
- 目前不支持自动刷新配额信息
- 不支持 OAuth 登录方式
- 删除操作不可恢复

## 测试文件

项目根目录下的 `claude-test.json` 文件包含示例配置，可用于测试导入功能。

## 后续开发建议

1. **配额监控**: 添加 API 使用量统计
2. **自动刷新**: 定期检查 API Key 有效性
3. **批量导入**: 支持一次导入多个账号
4. **密钥管理**: 添加密钥加密存储
5. **使用统计**: 记录 API 调用次数和成本
