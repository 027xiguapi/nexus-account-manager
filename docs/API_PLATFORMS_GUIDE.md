# API 平台管理指南

本应用现已支持 5 个 AI 平台的账号管理，包括 Claude、OpenAI Codex 和 Google Gemini。

## 支持的平台

### 1. Claude (Anthropic)
- **图标**: Code2
- **颜色**: #4F46E5 (靛蓝)
- **功能**: JSON 导入

### 2. OpenAI Codex
- **图标**: Terminal
- **颜色**: #10A37F (绿色)
- **功能**: JSON 导入

### 3. Google Gemini
- **图标**: Sparkles
- **颜色**: #4285F4 (蓝色)
- **功能**: JSON 导入

### 4. Antigravity
- **图标**: Zap
- **颜色**: #FF6B35 (橙色)
- **功能**: OAuth、Token、数据库导入

### 5. Kiro IDE
- **图标**: Code2
- **颜色**: #4F46E5 (靛蓝)
- **功能**: Builder ID、社交登录、Token 导入

---

## JSON 配置格式

### Claude

```json
{
  "env": {
    "ANTHROPIC_API_KEY": "sk-ant-...",
    "ANTHROPIC_AUTH_TOKEN": "sk-ant-...",
    "ANTHROPIC_BASE_URL": "https://api.anthropic.com"
  }
}
```

**字段说明**:
- `ANTHROPIC_API_KEY` (必需): Claude API 密钥
- `ANTHROPIC_AUTH_TOKEN` (可选): 认证令牌
- `ANTHROPIC_BASE_URL` (可选): API 基础 URL，默认 `https://api.anthropic.com`

### OpenAI Codex

```json
{
  "env": {
    "OPENAI_API_KEY": "sk-proj-...",
    "OPENAI_ORGANIZATION": "org-...",
    "OPENAI_BASE_URL": "https://api.openai.com/v1"
  }
}
```

**字段说明**:
- `OPENAI_API_KEY` (必需): OpenAI API 密钥
- `OPENAI_ORGANIZATION` (可选): 组织 ID
- `OPENAI_BASE_URL` (可选): API 基础 URL，默认 `https://api.openai.com/v1`

### Google Gemini

```json
{
  "env": {
    "GEMINI_API_KEY": "AIza...",
    "GEMINI_PROJECT_ID": "my-project",
    "GEMINI_BASE_URL": "https://generativelanguage.googleapis.com/v1"
  }
}
```

**字段说明**:
- `GEMINI_API_KEY` 或 `GOOGLE_API_KEY` (必需): Gemini API 密钥
- `GEMINI_PROJECT_ID` (可选): 项目 ID
- `GEMINI_BASE_URL` (可选): API 基础 URL，默认 `https://generativelanguage.googleapis.com/v1`

---

## 使用步骤

### 1. 导入账号

1. 启动应用程序
2. 在左侧导航栏选择 "Accounts"（账号管理）
3. 选择对应的平台标签（Claude / Codex / Gemini）
4. 点击右上角的 "添加账号" 按钮
5. 在弹出的对话框中选择 "JSON 导入" 方式
6. 粘贴 JSON 配置或点击 "上传文件" 按钮
7. 点击 "导入" 按钮

### 2. 切换账号

- **方式 1**: 双击账号卡片
- **方式 2**: 悬停在卡片上，点击电源图标 🔌

激活的账号会显示：
- 绿色指示器（右上角闪烁的点）
- 蓝色边框高亮
- 左侧蓝色竖线

### 3. 删除账号

1. 悬停在账号卡片上
2. 点击右下角的删除图标 🗑️
3. 确认删除操作

⚠️ **注意**: 删除操作不可恢复！

### 4. 导出账号

1. 点击页面右上角的 "导出" 按钮
2. 选择导出格式（JSON / TXT / CSV / 剪贴板）
3. 选择是否包含凭证信息
4. 下载或复制配置文件

---

## 账号卡片功能

每个账号卡片显示以下信息：

### 基本信息
- **邮箱地址**: 点击可复制
- **账号名称**: 从 Base URL 提取
- **API 类型标签**: 显示 "API"
- **平台标签**: 显示平台名称（Claude / Codex / Gemini）
- **Base URL**: 完整的 API 基础 URL

### 操作按钮（悬停显示）

左侧按钮组：
- 🔌 **切换**: 激活/切换到此账号
- 🔄 **刷新**: 刷新账号信息
- 📋 **复制**: 复制邮箱地址
- 💾 **导出**: 导出账号配置

右侧按钮组：
- ℹ️ **详情**: 查看完整账号信息
- 🗑️ **删除**: 删除此账号

---

## 示例配置

### Claude - 标准 API

```json
{
  "env": {
    "ANTHROPIC_API_KEY": "sk-ant-api03-xxx"
  }
}
```

### Claude - 使用代理

```json
{
  "env": {
    "ANTHROPIC_API_KEY": "sk-xxx",
    "ANTHROPIC_BASE_URL": "https://routerpark.com"
  }
}
```

### Codex - 标准配置

```json
{
  "env": {
    "OPENAI_API_KEY": "sk-proj-xxx"
  }
}
```

### Codex - 带组织 ID

```json
{
  "env": {
    "OPENAI_API_KEY": "sk-proj-xxx",
    "OPENAI_ORGANIZATION": "org-xxxxxxxxxx"
  }
}
```

### Gemini - 标准配置

```json
{
  "env": {
    "GEMINI_API_KEY": "AIzaSyxxxxxxxxx"
  }
}
```

### Gemini - 带项目 ID

```json
{
  "env": {
    "GEMINI_API_KEY": "AIzaSyxxxxxxxxx",
    "GEMINI_PROJECT_ID": "my-project-123"
  }
}
```

---

## 技术实现

### 文件结构

```
src/platforms/
├── claude/
│   ├── index.ts
│   ├── components/
│   │   └── AccountList.tsx
│   └── methods/
│       ├── index.ts
│       └── JsonMethod.tsx
├── codex/
│   ├── index.ts
│   ├── components/
│   │   └── AccountList.tsx
│   └── methods/
│       ├── index.ts
│       └── JsonMethod.tsx
├── gemini/
│   ├── index.ts
│   ├── components/
│   │   └── AccountList.tsx
│   └── methods/
│       ├── index.ts
│       └── JsonMethod.tsx
└── registry.ts
```

### 类型定义

```typescript
// Claude
export interface ClaudeAccount extends BaseAccount {
    platform: 'claude';
    apiKey: string;
    authToken?: string;
    baseUrl: string;
}

// Codex
export interface CodexAccount extends BaseAccount {
    platform: 'codex';
    apiKey: string;
    organizationId?: string;
    baseUrl: string;
}

// Gemini
export interface GeminiAccount extends BaseAccount {
    platform: 'gemini';
    apiKey: string;
    projectId?: string;
    baseUrl: string;
}
```

### 平台注册

```typescript
// src/platforms/registry.ts
export const platforms: PlatformConfig[] = [
  antigravityConfig,
  kiroConfig,
  claudeConfig,
  codexConfig,
  geminiConfig,
]
```

---

## 测试文件

项目根目录下提供了测试配置文件：

- `claude-test.json` - Claude 平台测试配置
- `codex-test.json` - OpenAI Codex 平台测试配置
- `gemini-test.json` - Google Gemini 平台测试配置

可以使用这些文件测试导入功能。

---

## 安全注意事项

⚠️ **重要提示**:

1. **API Key 安全**
   - API Key 包含敏感信息，请妥善保管
   - 不要将 API Key 提交到版本控制系统
   - 建议定期更换 API Key

2. **导出文件**
   - 导出的 JSON 文件包含完整凭证
   - 请勿分享或上传到公共位置
   - 建议加密存储导出文件

3. **删除操作**
   - 删除操作不可恢复
   - 删除前请确认是否需要导出备份

4. **Base URL**
   - 使用自定义 Base URL 时请确保来源可信
   - 避免使用不明来源的代理服务

---

## 功能对比

| 功能 | Claude | Codex | Gemini | Antigravity | Kiro |
|------|--------|-------|--------|-------------|------|
| JSON 导入 | ✅ | ✅ | ✅ | ❌ | ❌ |
| OAuth 登录 | ❌ | ❌ | ❌ | ✅ | ✅ |
| Token 导入 | ❌ | ❌ | ❌ | ✅ | ✅ |
| 数据库导入 | ❌ | ❌ | ❌ | ✅ | ❌ |
| 配额监控 | ❌ | ❌ | ❌ | ✅ | ✅ |
| 自动刷新 | ❌ | ❌ | ❌ | ✅ | ✅ |
| 账号切换 | ✅ | ✅ | ✅ | ✅ | ✅ |
| 账号删除 | ✅ | ✅ | ✅ | ✅ | ✅ |
| 账号导出 | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 常见问题

### Q: 如何获取 API Key？

**Claude**: 访问 [Anthropic Console](https://console.anthropic.com/) 创建 API Key

**Codex**: 访问 [OpenAI Platform](https://platform.openai.com/api-keys) 创建 API Key

**Gemini**: 访问 [Google AI Studio](https://makersuite.google.com/app/apikey) 创建 API Key

### Q: 为什么导入失败？

1. 检查 JSON 格式是否正确
2. 确认必需字段是否存在
3. 验证 API Key 格式是否正确
4. 查看错误提示信息

### Q: 如何使用自定义代理？

在 JSON 配置中设置 `BASE_URL` 字段为代理地址：

```json
{
  "env": {
    "ANTHROPIC_API_KEY": "sk-xxx",
    "ANTHROPIC_BASE_URL": "https://your-proxy.com"
  }
}
```

### Q: 可以同时使用多个账号吗？

可以！您可以添加多个账号，但同一时间只能激活一个账号。通过切换功能可以快速在不同账号间切换。

### Q: 账号数据存储在哪里？

账号数据存储在本地数据库中，具体路径可在设置页面查看。所有敏感信息都经过加密存储。

---

## 后续开发计划

### 短期计划
- [ ] 添加 API 使用量统计
- [ ] 支持批量导入多个账号
- [ ] 添加账号有效性检测
- [ ] 支持账号分组管理

### 长期计划
- [ ] 添加配额监控和告警
- [ ] 支持自动刷新 Token
- [ ] 添加使用成本统计
- [ ] 支持更多 AI 平台

---

## 贡献指南

如需添加新的 AI 平台支持，请参考现有平台的实现：

1. 在 `src/types/account.ts` 中定义账号类型
2. 在 `src/platforms/` 下创建平台文件夹
3. 实现 `AccountList` 和 `JsonMethod` 组件
4. 在 `registry.ts` 中注册平台
5. 添加翻译文件
6. 更新文档

---

## 许可证

本项目遵循 MIT 许可证。
