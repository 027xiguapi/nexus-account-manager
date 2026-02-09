# 快速参考

## 平台配置速查

### Claude
```json
{"env": {"ANTHROPIC_API_KEY": "sk-ant-..."}}
```

### OpenAI Codex
```json
{"env": {"OPENAI_API_KEY": "sk-proj-..."}}
```

### Google Gemini
```json
{"env": {"GEMINI_API_KEY": "AIza..."}}
```

## 快捷操作

| 操作 | 方法 |
|------|------|
| 切换账号 | 双击卡片 或 点击 🔌 |
| 复制邮箱 | 点击邮箱地址 |
| 删除账号 | 悬停 → 点击 🗑️ |
| 导出账号 | 页面右上角 "导出" |
| 查看详情 | 悬停 → 点击 ℹ️ |

## 文件位置

```
测试配置:
├── claude-test.json
├── codex-test.json
└── gemini-test.json

源代码:
src/platforms/
├── claude/
├── codex/
└── gemini/
```

## 支持的字段

### Claude
- ✅ ANTHROPIC_API_KEY (必需)
- ⭕ ANTHROPIC_AUTH_TOKEN
- ⭕ ANTHROPIC_BASE_URL

### Codex
- ✅ OPENAI_API_KEY (必需)
- ⭕ OPENAI_ORGANIZATION
- ⭕ OPENAI_BASE_URL

### Gemini
- ✅ GEMINI_API_KEY / GOOGLE_API_KEY (必需)
- ⭕ GEMINI_PROJECT_ID
- ⭕ GEMINI_BASE_URL

## 默认 Base URL

| 平台 | 默认 URL |
|------|----------|
| Claude | https://api.anthropic.com |
| Codex | https://api.openai.com/v1 |
| Gemini | https://generativelanguage.googleapis.com/v1 |
