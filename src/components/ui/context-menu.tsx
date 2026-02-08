import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import {
    Power, RefreshCw, Copy, Download, Info, Trash2, Shield
} from 'lucide-react'

export interface ContextMenuItem {
    id: string
    label: string
    icon?: typeof Power
    shortcut?: string
    danger?: boolean
    disabled?: boolean
    separator?: boolean
    onClick?: () => void
}

interface ContextMenuProps {
    items: ContextMenuItem[]
    position: { x: number; y: number }
    onClose: () => void
}

export function ContextMenu({ items, position, onClose }: ContextMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null)
    const [adjustedPosition, setAdjustedPosition] = useState(position)

    useEffect(() => {
        // Adjust position if menu goes off screen
        if (menuRef.current) {
            const rect = menuRef.current.getBoundingClientRect()
            const newX = position.x + rect.width > window.innerWidth
                ? window.innerWidth - rect.width - 10
                : position.x
            const newY = position.y + rect.height > window.innerHeight
                ? window.innerHeight - rect.height - 10
                : position.y
            setAdjustedPosition({ x: newX, y: newY })
        }
    }, [position])

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                onClose()
            }
        }
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }

        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('keydown', handleEscape)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('keydown', handleEscape)
        }
    }, [onClose])

    return createPortal(
        <div
            ref={menuRef}
            className="fixed z-[100] min-w-[180px] rounded-lg border border-border bg-popover p-1 shadow-lg animate-in fade-in-0 zoom-in-95 duration-100"
            style={{ left: adjustedPosition.x, top: adjustedPosition.y }}
        >
            {items.map((item, index) => {
                if (item.separator) {
                    return <div key={index} className="my-1 h-px bg-border" />
                }
                const Icon = item.icon
                return (
                    <button
                        key={item.id}
                        onClick={() => {
                            if (!item.disabled) {
                                item.onClick?.()
                                onClose()
                            }
                        }}
                        disabled={item.disabled}
                        className={cn(
                            "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                            "hover:bg-accent hover:text-accent-foreground",
                            "focus:bg-accent focus:text-accent-foreground focus:outline-none",
                            item.disabled && "opacity-50 cursor-not-allowed",
                            item.danger && "text-destructive hover:bg-destructive/10 hover:text-destructive"
                        )}
                    >
                        {Icon && <Icon className="h-4 w-4" />}
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.shortcut && (
                            <span className="text-xs text-muted-foreground">{item.shortcut}</span>
                        )}
                    </button>
                )
            })}
        </div>,
        document.body
    )
}

// Hook for easy context menu usage
export function useContextMenu() {
    const [contextMenu, setContextMenu] = useState<{
        visible: boolean
        x: number
        y: number
    }>({ visible: false, x: 0, y: 0 })

    const showContextMenu = (e: React.MouseEvent) => {
        e.preventDefault()
        setContextMenu({ visible: true, x: e.clientX, y: e.clientY })
    }

    const hideContextMenu = () => {
        setContextMenu({ visible: false, x: 0, y: 0 })
    }

    return { contextMenu, showContextMenu, hideContextMenu }
}

// Predefined menu items for accounts
export const getAccountContextMenuItems = (options: {
    onSwitch: () => void
    onRefresh: () => void
    onCopyEmail: () => void
    onCopyToken?: () => void
    onExport: () => void
    onDetails: () => void
    onDelete: () => void
    isActive?: boolean
    t: (key: string) => string
}): ContextMenuItem[] => [
        {
            id: 'switch',
            label: options.t('common.switch'),
            icon: Power,
            shortcut: 'Enter',
            disabled: options.isActive,
            onClick: options.onSwitch,
        },
        {
            id: 'refresh',
            label: options.t('common.refresh'),
            icon: RefreshCw,
            shortcut: 'R',
            onClick: options.onRefresh,
        },
        { id: 'sep1', label: '', separator: true },
        {
            id: 'copy-email',
            label: options.t('common.copy') + ' Email',
            icon: Copy,
            shortcut: 'C',
            onClick: options.onCopyEmail,
        },
        ...(options.onCopyToken ? [{
            id: 'copy-token',
            label: options.t('common.copy') + ' Token',
            icon: Shield,
            onClick: options.onCopyToken,
        }] : []),
        {
            id: 'export',
            label: options.t('common.export'),
            icon: Download,
            onClick: options.onExport,
        },
        { id: 'sep2', label: '', separator: true },
        {
            id: 'details',
            label: options.t('common.details'),
            icon: Info,
            shortcut: 'I',
            onClick: options.onDetails,
        },
        { id: 'sep3', label: '', separator: true },
        {
            id: 'delete',
            label: options.t('common.delete'),
            icon: Trash2,
            shortcut: 'Del',
            danger: true,
            onClick: options.onDelete,
        },
    ]
