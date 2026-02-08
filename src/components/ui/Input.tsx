import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md',
          'bg-[rgb(var(--background))] px-3 py-2',
          'border border-[rgb(var(--border))]',
          'text-sm',
          'placeholder:text-[rgb(var(--secondary))]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--primary))]',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'
