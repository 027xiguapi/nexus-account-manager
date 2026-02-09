# Nexus Account Manager - Architecture

## 🎯 Design Philosophy

Nexus is built on three core principles:

1. **Extensibility**: Adding new platforms should be trivial
2. **Type Safety**: Full type safety across Rust and TypeScript
3. **Simplicity**: Clean, maintainable code

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Platform   │  │   Platform   │  │   Platform   │  │
│  │  Antigravity │  │     Kiro     │  │   Future...  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│           │                │                │            │
│           └────────────────┴────────────────┘            │
│                          │                               │
│                  ┌───────▼────────┐                      │
│                  │ Platform       │                      │
│                  │ Registry       │                      │
│                  └───────┬────────┘                      │
│                          │                               │
│                  ┌───────▼────────┐                      │
│                  │ Base Components│                      │
│                  │ & UI Library   │                      │
│                  └───────┬────────┘                      │
└──────────────────────────┼──────────────────────────────┘
                           │
                    Tauri Bridge
                           │
┌──────────────────────────▼──────────────────────────────┐
│                    Rust Backend                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Storage    │  │   Commands   │  │    Core      │  │
│  │   Layer      │  │   (Tauri)    │  │   Logic      │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## 📦 Module System

### Frontend Modules

#### 1. Core (`src/core/`)
Platform-agnostic components and utilities:
- **components/ui/**: Base UI components (Button, Card, Input, etc.)
- **layouts/**: Layout components (Sidebar, MainLayout)
- **hooks/**: Reusable hooks (useTheme, etc.)
- **lib/**: Utility functions

#### 2. Platforms (`src/platforms/`)
Each platform is a self-contained module:

```typescript
platforms/
├── registry.ts              # Central registry
├── types.ts                 # Platform interfaces
├── antigravity/
│   ├── index.ts            # Platform config
│   ├── components/         # Platform-specific components
│   ├── pages/              # Platform-specific pages
│   └── stores/             # Platform-specific state
└── kiro/
    └── ...
```

**Platform Interface**:
```typescript
interface PlatformConfig {
  id: string                    // Unique identifier
  name: string                  // Display name
  icon: LucideIcon             // Icon component
  color: string                // Brand color
  description: string          // Description
  
  // Components
  AccountList: ComponentType   // Required
  AccountDetail?: ComponentType // Optional
  Settings?: ComponentType     // Optional
  
  // Features
  features: {
    oauth?: boolean
    quota?: boolean
    proxy?: boolean
    machineId?: boolean
  }
}
```

#### 3. Stores (`src/stores/`)
Global state management using Zustand:
- **usePlatformStore**: Manages accounts across all platforms
- **useTheme**: Theme management

### Backend Modules

#### 1. Core (`src-tauri/src/core/`)
Core business logic:
- **storage.rs**: Data persistence layer
- Future: crypto, export, etc.

#### 2. Commands (`src-tauri/src/commands/`)
Tauri command handlers:
- `get_accounts()`: Fetch all accounts
- `add_account()`: Add new account
- `update_account()`: Update existing account
- `delete_account()`: Delete account
- `export_accounts()`: Export to JSON
- `import_accounts()`: Import from JSON

## 🔄 Data Flow

### Adding an Account

```
User Action (Frontend)
    │
    ▼
Platform Component
    │
    ▼
usePlatformStore.addAccount()
    │
    ▼
Tauri invoke("add_account")
    │
    ▼
Rust Command Handler
    │
    ▼
Storage.save()
    │
    ▼
accounts.json (Disk)
    │
    ▼
Return Success
    │
    ▼
Update UI
```

### Switching Platforms

```
User Clicks Platform Tab
    │
    ▼
Update URL Query (?platform=kiro)
    │
    ▼
Accounts Page Reads Query
    │
    ▼
Load Platform Config from Registry
    │
    ▼
Render Platform.AccountList Component
```

## 🎨 UI Design System

### Color System
Uses CSS variables for theme support:

```css
:root {
  --background: 255 255 255;
  --foreground: 0 0 0;
  --card: 245 245 247;
  --border: 210 210 215;
  --primary: 0 122 255;
}

.dark {
  --background: 0 0 0;
  --foreground: 255 255 255;
  --card: 28 28 30;
  --border: 56 56 58;
  --primary: 10 132 255;
}
```

### Component Hierarchy

```
Button (Base)
  ├── variant: primary | secondary | ghost | danger
  └── size: sm | md | lg

Card (Container)
  ├── CardHeader
  ├── CardTitle
  └── CardContent

Input (Form)
  └── Styled with focus states
```

## 🔐 Data Storage

### Storage Format

```json
{
  "accounts": [
    {
      "id": "uuid-v4",
      "platform": "antigravity",
      "name": "My Account",
      "email": "user@example.com",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "tags": ["work", "personal"],
      "group": "Production",
      "platform_data": {
        "token": "...",
        "quota": {...}
      }
    }
  ]
}
```

### Storage Location
- **Windows**: `%APPDATA%\com.administrator.nexus-account-manager\accounts.json`
- **macOS**: `~/Library/Application Support/com.administrator.nexus-account-manager/accounts.json`
- **Linux**: `~/.config/com.administrator.nexus-account-manager/accounts.json`

## 🚀 Performance Considerations

### Frontend
- **Code Splitting**: Each platform is lazy-loaded
- **Memoization**: React.memo for expensive components
- **Virtual Scrolling**: For large account lists (future)

### Backend
- **Async I/O**: All file operations are async
- **Mutex Locking**: Thread-safe state management
- **JSON Streaming**: For large exports (future)

## 🔮 Future Enhancements

### Planned Features
1. **Platform Plugins**: Load platforms from external packages
2. **Cloud Sync**: Optional cloud backup
3. **Encryption**: Optional data encryption
4. **Auto-Update**: Built-in update mechanism
5. **CLI**: Command-line interface
6. **API Server**: Optional HTTP API

### Scalability
The architecture supports:
- **10+ platforms** without performance degradation
- **1000+ accounts** with virtual scrolling
- **Plugin system** for third-party platforms

## 📚 Best Practices

### Adding a Platform
1. Create folder in `src/platforms/[platform-name]/`
2. Implement `PlatformConfig` interface
3. Register in `registry.ts`
4. Add platform-specific components
5. Update documentation

### Component Guidelines
- Use base components from `src/components/ui/`
- Follow macOS design patterns
- Support both light and dark themes
- Add proper TypeScript types
- Write self-documenting code

### State Management
- Use Zustand for global state
- Keep platform state isolated
- Avoid prop drilling
- Use React Context sparingly

---

**Questions?** Open an issue on GitHub!
