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
│   │   ├── accounts/            # 账户相关通用组件
│   │   │   ├── AccountCardBase.tsx          # 账户卡片基础组件
│   │   │   ├── AccountDetailsDialogBase.tsx # 详情对话框基础组件
│   │   │   ├── AccountSearch.tsx            # 账户搜索组件
│   │   │   └── AccountTable.tsx             # 账户表格组件
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
│       ├── utils/               # 通用工具模块
│       │   ├── paths.rs        # 路径工具
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
- **公共工具必须封装**：跨平台、跨模块使用的功能应放在 `src/lib/` (前端) 或 `src-tauri/src/utils/` (后端)

#### ❌ 禁止操作
- 引入 **新的 npm 依赖**（除非明确批准）
- 引入 **新的 Rust crate**（除非明确批准）
- "顺手重构" **无关代码**
- 擅自抽象或创建 **新的设计模式**
- 跨目录 **复制粘贴代码**
- 修改 **核心架构**（如插件系统、状态管理）
- **重复实现**：相同功能在多处重复实现，应提取为公共工具

### 2.3 平台开发规则

新增平台时必须遵循以下结构：

```typescript
src/platforms/[platform-name]/
├── components/
│   ├── AccountList.tsx                    # 必需：账户列表组件
│   ├── [Platform]AccountCard.tsx         # 必需：平台专属账户卡片（PascalCase）
│   ├── [Platform]AccountDetailsDialog.tsx # 必需：平台专属详情对话框（PascalCase）
│   └── AddAccountDialog.tsx               # 可选：添加账户对话框
├── methods/
│   ├── index.ts                           # 必需：导出所有认证方法
│   └── [MethodName]Method.tsx             # 认证方法组件
├── services/                               # 可选：平台特定服务
│   └── [Platform]Service.ts
└── index.ts                                # 必需：平台配置导出
```

**平台配置必须包含**：
- `id`: 唯一标识符
- `name`: 显示名称
- `icon`: Lucide React 图标
- `color`: 主题色
- `description`: 描述
- `AccountList`: 账户列表组件
- `features`: 功能特性配置

### 2.3.1 账户卡片组件规范

每个平台必须实现自己的账户卡片和详情对话框组件，使用通用基础组件进行封装。

#### 文件命名规范

**必须使用 PascalCase 命名**：
- ✅ `KiroAccountCard.tsx`
- ✅ `AntigravityAccountDetailsDialog.tsx`
- ❌ `kiro-account-card.tsx`
- ❌ `antigravity_account_details_dialog.tsx`

**文件位置**：
- 基础组件：`src/components/accounts/AccountCardBase.tsx`
- 平台组件：`src/platforms/[platform]/components/[Platform]AccountCard.tsx`

#### 账户卡片 (`[Platform]AccountCard.tsx`)

**必须使用**: `src/components/accounts/AccountCardBase.tsx` 作为基础组件

**实现要求**:
```typescript
import { memo, useState } from 'react'
import { AccountCard } from '@/components/accounts/AccountCardBase'
import { Badge } from '@/components/ui/badge'
import { Account } from '@/types/account'

interface KiroAccountCardProps {
  account: Account
  onExport?: () => void
}

export const KiroAccountCard = memo(function KiroAccountCard({ 
  account, 
  onExport 
}: KiroAccountCardProps) {
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleSwitch = async () => {
    // 切换账号逻辑
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      // 刷新账号逻辑
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <>
      <AccountCard
        id={account.id}
        email={account.email}
        name={account.name}
        isActive={account.isActive}
        
        // 自定义状态徽章（右上角）
        statusBadge={
          account.subscription && (
            <Badge variant="secondary">
              {account.subscription}
            </Badge>
          )
        }
        
        // 自定义警告标识（如封禁、错误状态）
        warningBadge={
          account.status === 'banned' ? (
            <Badge variant="destructive" className="rounded-none rounded-bl-lg">
              BANNED
            </Badge>
          ) : undefined
        }
        
        // 自定义徽章区域（订阅类型、平台标识等）
        badges={
          <>
            <Badge variant="outline">Pro</Badge>
            <Badge variant="outline">US Region</Badge>
          </>
        }
        
        // 自定义内容区域（配额、使用情况等）
        content={
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">使用量</span>
              <span className="font-medium">1.2K / 10K</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[12%]" />
            </div>
          </div>
        }
        
        // 标准操作
        onSwitch={handleSwitch}
        onRefresh={handleRefresh}
        onExport={onExport}
        onDetails={() => setDetailsOpen(true)}
        onDelete={() => setDeleteConfirmOpen(true)}
        
        isRefreshing={isRefreshing}
      />
      
      {/* 详情对话框 */}
      <KiroAccountDetailsDialog
        account={account}
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
      />
      
      {/* 删除确认对话框 */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="删除账号"
        description="确定要删除此账号吗？"
        onConfirm={handleDelete}
      />
    </>
  )
})
```

**AccountCard 基础组件 Props**:
- `id`: 账号 ID（必需，用于 key 等场景）
- `email`: 邮箱（必需）
- `name`: 名称（可选）
- `isActive`: 是否激活（可选）
- `statusBadge`: 状态徽章（头部右侧）
- `warningBadge`: 警告标识（右上角，如 BANNED）
- `badges`: 徽章区域（订阅类型、平台标识等）
- `content`: 主要内容区域（配额、使用情况等）
- `footer`: 底部自定义区域
- `onSwitch`, `onRefresh`, `onCopy`, `onExport`, `onDetails`, `onDelete`: 标准操作
- `customActions`: 额外的自定义操作
- `isRefreshing`, `isSwitching`: 加载状态
- `variant`: 卡片变体（`default` | `compact` | `detailed`）

**设计原则**:
- ✅ 使用 `AccountCard` 基础组件，通过插槽自定义内容
- ✅ 平台特定数据通过 `badges` 和 `content` 插槽渲染
- ✅ 保持统一的交互逻辑（hover 显示操作、激活状态等）
- ✅ 保留 `id` 属性，可能用于 React key 或其他场景
- ❌ 不要从头实现卡片布局
- ❌ 不要修改基础组件的核心交互逻辑

#### 详情对话框 (`[Platform]AccountDetailsDialog.tsx`)

**必须使用**: `src/components/accounts/AccountDetailsDialogBase.tsx` 作为基础组件

**实现要求**:
```typescript
import { 
  AccountDetailsDialog, 
  DetailRow, 
  DetailGrid 
} from '@/components/accounts/AccountDetailsDialogBase'
import { User, Award, Key, Globe } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Account } from '@/types/account'

interface KiroAccountDetailsDialogProps {
  account: Account
  open: boolean
  onClose: () => void
}

export function KiroAccountDetailsDialog({ 
  account, 
  open, 
  onClose 
}: KiroAccountDetailsDialogProps) {
  const sections = [
    {
      title: '基础信息',
      icon: <User className="h-4 w-4" />,
      content: (
        <DetailGrid columns={2}>
          <DetailRow 
            label="邮箱" 
            value={account.email} 
            copyable 
          />
          <DetailRow 
            label="名称" 
            value={account.name || '-'} 
          />
          <DetailRow 
            label="账号 ID" 
            value={account.id} 
            copyable 
          />
          <DetailRow 
            label="状态" 
            value={
              <Badge variant={account.isActive ? 'default' : 'secondary'}>
                {account.isActive ? '激活' : '未激活'}
              </Badge>
            } 
          />
        </DetailGrid>
      )
    },
    {
      title: '订阅信息',
      icon: <Award className="h-4 w-4" />,
      content: (
        <DetailGrid columns={1}>
          <DetailRow 
            label="订阅类型" 
            value={account.subscription || '免费版'} 
          />
          <DetailRow 
            label="到期时间" 
            value={account.expiresAt || '永久'} 
          />
        </DetailGrid>
      )
    },
    {
      title: '认证信息',
      icon: <Key className="h-4 w-4" />,
      content: (
        <DetailGrid columns={1}>
          <DetailRow 
            label="Access Token" 
            value={account.credentials?.accessToken || '-'} 
            copyable 
          />
          <DetailRow 
            label="认证方式" 
            value={account.credentials?.authMethod || '-'} 
          />
        </DetailGrid>
      )
    },
    {
      title: '区域设置',
      icon: <Globe className="h-4 w-4" />,
      content: (
        <DetailRow 
          label="服务区域" 
          value={account.credentials?.region || 'US'} 
        />
      )
    }
  ]
  
  return (
    <AccountDetailsDialog
      open={open}
      onClose={onClose}
      title={account.name || account.email}
      subtitle={account.email}
      badges={
        <>
          <Badge variant="outline">{account.subscription || '免费版'}</Badge>
          {account.isActive && <Badge>当前激活</Badge>}
        </>
      }
      sections={sections}
      maxWidth="xl"
    />
  )
}
```

**辅助组件**:
- `DetailRow`: 单行详情展示，支持图标、复制功能
  - `label`: 标签文本
  - `value`: 值（支持 string 或 ReactNode）
  - `icon`: 图标（可选）
  - `copyable`: 是否可复制（可选）
- `DetailGrid`: 网格布局，支持 1/2/3 列
  - `columns`: 列数（1 | 2 | 3）
  - `children`: 子元素（通常是 DetailRow）

**设计原则**:
- ✅ 使用分组 `sections` 组织信息
- ✅ 使用 `DetailRow` 和 `DetailGrid` 快速构建布局
- ✅ 平台特定信息通过自定义 `content` 渲染
- ✅ 敏感信息（Token、密钥）使用 `copyable` 属性
- ❌ 不要使用 `createPortal` 自己实现对话框
- ❌ 不要重复实现复制、关闭等通用逻辑

#### 禁止的实现方式

❌ **错误示例 1**: 从头实现卡片
```typescript
// 不要这样做！
export function MyAccountCard() {
  return (
    <Card>
      <CardContent>
        {/* 完全自定义的布局 */}
      </CardContent>
    </Card>
  )
}
```

❌ **错误示例 2**: 使用 createPortal 实现对话框
```typescript
// 不要这样做！
export function MyDetailsDialog() {
  return createPortal(
    <div className="fixed inset-0">
      {/* 自己实现的对话框 */}
    </div>,
    document.body
  )
}
```

❌ **错误示例 3**: 使用 kebab-case 命名
```typescript
// 不要这样做！
// 文件名: kiro-account-card.tsx
export function KiroAccountCard() { ... }
```

✅ **正确示例**: 使用基础组件 + 自定义内容 + PascalCase 命名
```typescript
// 这样做！
// 文件名: KiroAccountCard.tsx
import { AccountCard } from '@/components/accounts/AccountCardBase'

export const KiroAccountCard = memo(function KiroAccountCard({ account }) {
  return (
    <AccountCard
      id={account.id}
      email={account.email}
      name={account.name}
      badges={<MyCustomBadges />}
      content={<MyCustomContent />}
      onSwitch={handleSwitch}
      onRefresh={handleRefresh}
    />
  )
})

// 文件名: KiroAccountDetailsDialog.tsx
import { AccountDetailsDialog } from '@/components/accounts/AccountDetailsDialogBase'

export function KiroAccountDetailsDialog({ account, open, onClose }) {
  return (
    <AccountDetailsDialog
      open={open}
      onClose={onClose}
      title={account.name}
      sections={mySections}
    />
  )
}
```

### 2.4 Tauri 命令规则

新增 Tauri 命令时：

1. 在 `src-tauri/src/commands/` 中创建或修改对应文件
2. 在 `src-tauri/src/commands/mod.rs` 中导出命令
3. 在 `src-tauri/src/lib.rs` 中注册命令
4. 前端通过 `@tauri-apps/api` 调用

### 2.5 工具模块规则

**前端工具** (`src/lib/`):
- 通用工具函数放在 `src/lib/utils.ts`
- 复杂工具可创建独立文件（如 `src/lib/validators.ts`）

**后端工具** (`src-tauri/src/utils/`):
- 按功能分类创建模块（如 `paths.rs`, `crypto.rs`）
- 在 `src-tauri/src/utils/mod.rs` 中导出
- 示例：路径工具 `utils::paths::get_ide_database_paths()`

### 2.6 公共服务使用规则

#### 机器码服务 (MachineIdService)

**位置**: `src/services/MachineIdService.ts`

机器码（设备指纹）用于账号隔离，所有平台共享此服务。

**使用方式**:
```typescript
import { MachineIdService } from '@/services/MachineIdService'

// 在平台服务的切换账号方法中使用
static async switchAccount(accountId: string) {
  const machineService = MachineIdService.getInstance()
  
  // 检查是否已绑定机器码
  let machineId = await machineService.getMachineIdForAccount(accountId)
  
  // 如果没有，生成新的并绑定
  if (!machineId) {
    machineId = await machineService.generateMachineId()
    await machineService.bindMachineId(accountId, machineId)
  }
  
  // 使用 machineId 进行后续操作...
}
```

**主要方法**:
- `generateMachineId()`: 生成随机机器码
- `getMachineIdForAccount(accountId)`: 获取账号绑定的机器码
- `bindMachineId(accountId, machineId)`: 绑定账号到机器码
- `unbindMachineId(accountId)`: 解绑账号的机器码

**最佳实践**:
- ✅ 每个账号绑定独立的机器码
- ✅ 在首次切换账号时懒加载生成
- ✅ 删除账号时清理绑定关系
- ❌ 不要在添加账号时立即绑定
- ❌ 不要多个账号共享机器码

#### 存储服务 (StorageService)

**位置**: `src/services/StorageService.ts`

统一的数据持久化服务，管理账号数据存储路径。

**使用方式**:
```typescript
import { StorageService } from '@/services/StorageService'

// 获取当前存储路径
const path = await StorageService.getCurrentPath()

// 设置自定义存储路径
await StorageService.setCustomPath('/path/to/storage')

// 选择存储目录（打开文件选择器）
const newPath = await StorageService.selectDirectory()
```

#### 确认对话框 (ConfirmDialog)

**位置**: `src/components/dialogs/ConfirmDialog.tsx`

替代原生 `confirm()` 的自定义确认对话框。

**使用方式**:
```typescript
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog'

function MyComponent() {
  const [confirmOpen, setConfirmOpen] = useState(false)
  
  const handleDelete = async () => {
    // 确认后执行的操作
    await deleteAccount(accountId)
  }
  
  return (
    <>
      <Button onClick={() => setConfirmOpen(true)}>删除</Button>
      
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="删除账号"
        description="确定要删除此账号吗？此操作不可撤销。"
        confirmText="删除"
        cancelText="取消"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </>
  )
}
```

**Props**:
- `open`: 对话框是否打开
- `onOpenChange`: 状态变化回调
- `title`: 标题
- `description`: 描述文本
- `confirmText`: 确认按钮文本（可选）
- `cancelText`: 取消按钮文本（可选）
- `variant`: 按钮样式，`"default"` 或 `"destructive"`
- `onConfirm`: 确认回调（支持异步）

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

**最后更新**: 2026-02-10  
**版本**: 2.2  
**维护者**: adnaan

---

## 八、组件复用规范

### 8.1 通用 UI 组件

**位置**: `src/components/ui/` 和 `src/components/accounts/`

所有通用 UI 组件必须放在这些目录：
- `src/components/ui/`: 基础 UI 组件（Button, Card, Badge 等）
- `src/components/accounts/`: 账户相关通用组件（AccountCardBase, AccountDetailsDialogBase 等）

**使用原则**:
- ✅ 优先使用现有组件
- ✅ 通过 props 和插槽自定义
- ✅ 保持组件的通用性和可扩展性
- ❌ 不要在平台目录中重复实现通用组件
- ❌ 不要修改组件的核心逻辑以适配单一平台

### 8.2 账户卡片系统

**基础组件**: `src/components/accounts/AccountCardBase.tsx`

提供统一的卡片布局和交互逻辑，支持以下自定义：

**Props 说明**:
- `id`, `email`, `name`, `isActive`: 基础账户信息
- `warningBadge`: 警告标识（右上角，如 BANNED、ERROR）
- `statusBadge`: 状态标识（头部右侧）
- `badges`: 徽章区域（订阅类型、平台标识等）
- `content`: 主要内容区域（配额、使用情况等）
- `footer`: 底部自定义区域
- `onSwitch`, `onRefresh`, `onCopy`, `onExport`, `onDetails`, `onDelete`: 标准操作
- `customActions`: 额外的自定义操作
- `variant`: 卡片变体（`default` | `compact` | `detailed`）

**交互特性**:
- Hover 显示操作按钮
- 激活状态显示左侧指示条和光晕效果
- 警告状态显示红色边框和背景
- 点击邮箱复制到剪贴板
- 平滑的动画过渡

### 8.3 详情对话框系统

**基础组件**: `src/components/accounts/AccountDetailsDialogBase.tsx`

提供统一的对话框结构，支持分组展示详细信息。

**主要组件**:

1. **AccountDetailsDialog**: 对话框容器
   - `title`, `subtitle`: 标题和副标题
   - `avatar`: 头像区域
   - `badges`: 状态徽章
   - `sections`: 详情分组数组
   - `maxWidth`: 对话框宽度（`sm` | `md` | `lg` | `xl` | `2xl`）

2. **DetailRow**: 单行详情
   - `label`: 标签
   - `value`: 值（支持 string 或 ReactNode）
   - `icon`: 图标
   - `copyable`: 是否可复制

3. **DetailGrid**: 网格布局
   - `columns`: 列数（1 | 2 | 3）
   - `children`: 子元素（通常是 DetailRow）

**使用示例**:
```typescript
const sections = [
  {
    title: '基础信息',
    icon: <User className="h-4 w-4" />,
    content: (
      <DetailGrid columns={2}>
        <DetailRow label="邮箱" value={email} copyable />
        <DetailRow label="名称" value={name} />
      </DetailGrid>
    )
  }
]

return (
  <AccountDetailsDialog
    open={open}
    onClose={onClose}
    title="账户详情"
    sections={sections}
  />
)
```
