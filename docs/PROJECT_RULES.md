# AI 编程永久规则（强制执行）

> 本文档定义了 Nexus Account Manager 项目的 AI 编程规则，所有 AI 辅助开发必须严格遵守。

## 📋 项目概述

- **项目名称**: Nexus Account Manager
- **技术栈**: Tauri 2 + React 19 + TypeScript + Rust
- **架构模式**: 插件化平台架构
- **状态管理**: Zustand
- **UI 框架**: Tailwind CSS + Radix UI + Framer Motion
- **国际化**: i18next

---

## 一、项目结构（严格只读）

以下目录结构为 **强制规范**，禁止修改、移动、删除或新增未声明的顶层目录：

```
nexus-account-manager/
├── src/                          # React 前端源码
│   ├── components/               # 组件目录
│   │   ├── ui/                  # 基础 UI 组件（Radix UI + shadcn/ui）
│   │   ├── layout/              # 布局组件
│   │   ├── common/              # 通用组件（如 ThemeManager）
│   │   ├── accounts/            # 账户相关组件
│   │   ├── dashboard/           # 仪表盘组件
│   │   └── dialogs/             # 对话框组件
│   │
│   ├── platforms/               # 平台模块（插件化架构核心）
│   │   ├── antigravity/         # Antigravity 平台
│   │   │   ├── components/     # 平台专属组件
│   │   │   ├── methods/        # 认证方法（OAuth/Token/Import）
│   │   │   └── index.ts        # 平台配置导出
│   │   ├── claude/              # Claude 平台
│   │   ├── codex/               # Codex 平台
│   │   ├── gemini/              # Gemini 平台
│   │   ├── kiro/                # Kiro 平台
│   │   │   ├── components/
│   │   │   ├── methods/
│   │   │   ├── services/       # 平台服务层
│   │   │   └── index.ts
│   │   └── registry.ts          # 平台注册中心（所有平台必须在此注册）
│   │
│   ├── pages/                   # 页面组件
│   │   ├── Dashboard.tsx        # 仪表盘页面
│   │   ├── Accounts.tsx         # 账户管理页面
│   │   └── Settings.tsx         # 设置页面
│   │
│   ├── services/                # 服务层
│   │   ├── base/               # 基础服务类
│   │   │   ├── BaseAccountService.ts
│   │   │   └── BaseOAuthService.ts
│   │   ├── MachineIdService.ts
│   │   └── ServiceFactory.ts
│   │
│   ├── stores/                  # Zustand 状态管理
│   │   └── usePlatformStore.ts
│   │
│   ├── hooks/                   # 自定义 React Hooks
│   │   └── useTheme.ts
│   │
│   ├── types/                   # TypeScript 类型定义
│   │   ├── account.ts
│   │   └── platform.ts
│   │
│   ├── i18n/                    # 国际化配置
│   │   ├── config.ts
│   │   └── locales/
│   │       ├── en/
│   │       └── zh/
│   │
│   ├── lib/                     # 工具函数库
│   │   └── utils.ts
│   │
│   ├── assets/                  # 静态资源
│   ├── App.tsx                  # 应用根组件
│   ├── main.tsx                 # 应用入口
│   └── index.css                # 全局样式
│
├── src-tauri/                   # Rust 后端源码
│   └── src/
│       ├── core/                # 核心模块
│       │   ├── storage.rs      # 数据存储
│       │   ├── oauth.rs        # OAuth 处理
│       │   ├── oauth_server.rs # OAuth 服务器
│       │   ├── quota.rs        # 配额管理
│       │   ├── kiro.rs         # Kiro 特定逻辑
│       │   └── mod.rs
│       │
│       ├── commands/            # Tauri 命令（前后端通信）
│       │   ├── antigravity.rs
│       │   ├── kiro.rs
│       │   ├── machine.rs
│       │   ├── import.rs
│       │   └── mod.rs
│       │
│       ├── lib.rs               # 库入口
│       └── main.rs              # 应用入口
│
├── docs/                        # 项目文档
│   ├── PROJECT_RULES.md         # 本文件（AI 编程规则）
│   ├── ARCHITECTURE.md          # 架构文档
│   ├── API_PLATFORMS_GUIDE.md   # 平台开发指南
│   ├── CLAUDE_SETUP.md          # Claude 配置指南
│   ├── IMPLEMENTATION_SUMMARY.md
│   └── QUICK_REFERENCE.md
│
├── test/                        # 测试数据
│   ├── claude-test.json
│   ├── codex-test.json
│   └── gemini-test.json
│
├── public/                      # 公共静态资源
├── node_modules/                # Node 依赖（自动生成）
├── package.json                 # 项目配置
├── tsconfig.json                # TypeScript 配置
├── vite.config.ts               # Vite 配置
├── tailwind.config.js           # Tailwind 配置
└── components.json              # shadcn/ui 配置
```

---

## 二、强制规则（不可违反）

### 2.1 目录结构规则

#### ✅ 允许的操作
- 在 **已存在的目录** 中新增文件
- 修改 **已存在的文件**
- 在 `src/platforms/` 下新增 **完整的平台模块**（必须包含 components/methods/index.ts）

#### ❌ 禁止的操作
- 新增未在上述结构中声明的 **顶层目录**
- 删除或重命名 **任何已存在的目录**
- 移动文件到 **不同的目录层级**
- 修改 `src/platforms/registry.ts` 之外的 **平台注册逻辑**

### 2.2 代码编写规则

#### ✅ 必须遵守
- 使用 **TypeScript** 编写所有前端代码
- 使用 **Rust** 编写所有后端代码
- 遵循 **现有的代码风格** 和命名约定
- 使用 **已有的 UI 组件**（src/components/ui/）
- 通过 **Zustand store** 管理全局状态
- 使用 **i18next** 处理所有用户可见文本
- 新增平台必须在 `src/platforms/registry.ts` 中注册

#### ❌ 禁止操作
- 引入 **新的 npm 依赖**（除非明确批准）
- 引入 **新的 Rust crate**（除非明确批准）
- "顺手重构" **无关代码**
- 擅自抽象或创建 **新的设计模式**
- 跨目录 **复制粘贴代码**
- 修改 **核心架构**（如插件系统、状态管理）

### 2.3 平台开发规则

新增平台时必须遵循以下结构：

```typescript
src/platforms/[platform-name]/
├── components/
│   ├── AccountList.tsx          # 必需：账户列表组件
│   └── AddAccountDialog.tsx     # 可选：添加账户对话框
├── methods/
│   ├── index.ts                 # 必需：导出所有认证方法
│   └── [MethodName]Method.tsx   # 认证方法组件
├── services/                     # 可选：平台特定服务
│   └── [Platform]Service.ts
└── index.ts                      # 必需：平台配置导出
```

**平台配置必须包含**：
- `id`: 唯一标识符
- `name`: 显示名称
- `icon`: Lucide React 图标
- `color`: 主题色
- `description`: 描述
- `AccountList`: 账户列表组件
- `features`: 功能特性配置

### 2.4 Tauri 命令规则

新增 Tauri 命令时：

1. 在 `src-tauri/src/commands/` 中创建或修改对应文件
2. 在 `src-tauri/src/commands/mod.rs` 中导出命令
3. 在 `src-tauri/src/lib.rs` 中注册命令
4. 前端通过 `@tauri-apps/api` 调用

---

## 三、执行流程（强制遵守）

### 3.1 任务开始前

1. **理解需求**：明确任务目标和范围
2. **检查规则**：确认任务不违反本文档规则
3. **列出文件**：明确列出将要修改/创建的文件路径
4. **征求确认**：如有疑问，先询问用户

### 3.2 代码编写时

1. **最小改动**：只修改必要的代码
2. **保持一致**：遵循现有代码风格
3. **完整输出**：输出完整的文件内容（不使用省略）
4. **类型安全**：确保 TypeScript 类型正确
5. **错误处理**：添加适当的错误处理逻辑

### 3.3 任务完成后

1. **自我检查**：确认代码符合规则
2. **测试建议**：提供测试方法（如需要）
3. **简洁总结**：用 1-2 句话说明完成的工作

---

## 四、违规处理

如果任务要求与本规则冲突：

1. **立即停止** 执行
2. **明确指出** 具体冲突点
3. **提供建议** 符合规则的替代方案
4. **等待确认** 用户明确批准后再继续

### 示例冲突场景

❌ **用户要求**："在 src/ 下新增一个 utils/ 目录"  
✅ **正确响应**："根据项目规则，工具函数应放在 `src/lib/utils.ts` 中。是否在该文件中添加新的工具函数？"

❌ **用户要求**："安装 axios 来替换 fetch"  
✅ **正确响应**："项目规则禁止引入新依赖。当前使用 Tauri 的 `@tauri-apps/api` 进行 HTTP 请求。是否使用现有方案？"

---

## 五、特殊说明

### 5.1 文档修改

`docs/` 目录下的文档可以自由修改和新增，但需保持：
- Markdown 格式规范
- 内容准确性
- 与代码实现一致

### 5.2 测试文件

`test/` 目录下的 JSON 文件仅用于测试，可以修改但不应删除。

### 5.3 配置文件

以下配置文件需谨慎修改：
- `package.json`: 仅在明确需要时修改依赖
- `tsconfig.json`: 不要修改编译选项
- `vite.config.ts`: 不要修改核心配置
- `tailwind.config.js`: 可以添加主题配置
- `src-tauri/tauri.conf.json`: 仅修改应用元数据

---

## 六、快速检查清单

在提交代码前，确认以下事项：

- [ ] 没有新增未声明的目录
- [ ] 没有引入新的依赖
- [ ] 没有修改核心架构
- [ ] 代码符合 TypeScript/Rust 规范
- [ ] 新增平台已在 registry.ts 注册
- [ ] 所有文本使用 i18next 国际化
- [ ] UI 组件使用现有的 Radix UI 组件
- [ ] 状态管理使用 Zustand
- [ ] Tauri 命令已正确注册

---

## 七、参考文档

- [架构文档](./ARCHITECTURE.md)
- [平台开发指南](./API_PLATFORMS_GUIDE.md)
- [快速参考](./QUICK_REFERENCE.md)

---

**最后更新**: 2026-02-09  
**版本**: 2.0  
**维护者**: adnaan
