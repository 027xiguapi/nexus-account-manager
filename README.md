# Nexus Account Manager

> Your AI Accounts, Unified

A unified multi-platform AI account management tool built with Tauri, React, and Rust.

## ✨ Features

### 🔌 Plugin Architecture
- **Extensible Platform System**: Add new platforms with minimal code
- **Modular Design**: Each platform is an independent module
- **Type-Safe**: Full TypeScript and Rust type safety

### 🎨 Modern UI
- **macOS-Inspired Design**: Clean, minimalist interface
- **Dark/Light Theme**: Seamless theme switching
- **Smooth Animations**: Powered by Framer Motion
- **Responsive Layout**: Works on all screen sizes

### 📦 Supported Platforms

#### Antigravity
- Google/Anthropic AI Services
- OAuth 2.0 Authorization
- Quota Monitoring
- API Proxy Support

#### Kiro IDE
- Account Management
- Machine ID Management
- Auto Token Refresh
- Usage Tracking

### 🚀 Core Features
- **Multi-Account Management**: Add, edit, delete accounts across platforms
- **Quick Switching**: One-click account switching
- **Import/Export**: Backup and restore your accounts
- **Tags & Groups**: Organize accounts with tags and groups
- **Local Storage**: All data stored locally (no cloud sync)

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **React Router** - Navigation
- **Lucide React** - Icons
- **Framer Motion** - Animations

### Backend
- **Rust** - Core logic
- **Tauri 2** - Desktop framework
- **Serde** - Serialization

## 📦 Installation

### Prerequisites
- Node.js 18+
- Rust 1.70+
- npm or yarn

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run tauri dev

# Build for production
npm run tauri build
```

## 🏗️ Project Structure

```
nexus-account-manager/
├── src/                      # React frontend
│   ├── components/
│   │   ├── ui/              # Base UI components
│   │   └── layout/          # Layout components
│   ├── platforms/           # Platform modules
│   │   ├── antigravity/
│   │   ├── kiro/
│   │   └── registry.ts      # Platform registry
│   ├── pages/               # Page components
│   ├── stores/              # Zustand stores
│   ├── hooks/               # Custom hooks
│   ├── types/               # TypeScript types
│   └── lib/                 # Utilities
│
├── src-tauri/               # Rust backend
│   └── src/
│       ├── core/            # Core modules
│       │   └── storage.rs   # Data storage
│       ├── commands/        # Tauri commands
│       └── lib.rs           # Main entry
│
├── docs/                    # Documentation
│
└── test/                    # Test
```

## 🔌 Adding a New Platform

### 1. Create Platform Module

```typescript
// src/platforms/myplatform/index.ts
import { PlatformConfig } from '@/types/platform'
import { MyIcon } from 'lucide-react'
import { MyPlatformAccountList } from './components/AccountList'

export const myPlatformConfig: PlatformConfig = {
  id: 'myplatform',
  name: 'My Platform',
  icon: MyIcon,
  color: '#FF0000',
  description: 'My platform description',
  
  AccountList: MyPlatformAccountList,
  
  features: {
    oauth: true,
    quota: false,
  },
}
```

### 2. Register Platform

```typescript
// src/platforms/registry.ts
import { myPlatformConfig } from './myplatform'

export const platforms: PlatformConfig[] = [
  antigravityConfig,
  kiroConfig,
  myPlatformConfig, // Add here
]
```

### 3. Create Components

```typescript
// src/platforms/myplatform/components/AccountList.tsx
export function MyPlatformAccountList() {
  // Your component logic
}
```

That's it! Your new platform is now integrated.

## 🤖 AI Programming Guidelines

This project follows **strict AI programming rules**.
Before using any AI-assisted development, **you must include the following statement at the beginning of the conversation**:

```markdown
Please strictly follow all rules defined in #[[file:docs/PROJECT_RULES.md]] during development.
```

For detailed guidelines, please refer to: **[docs/PROJECT_RULES.md](./docs/PROJECT_RULES.md)**


## 📝 License

MIT © adnaan

## 🙏 Acknowledgments

- Inspired by [Antigravity Manager](https://github.com/lbjlaq/Antigravity-Manager)
- Inspired by [Kiro Account Manager](https://github.com/kiro-dev/kiro-account-manager)

---

**Made with ❤️ by adnaan**
