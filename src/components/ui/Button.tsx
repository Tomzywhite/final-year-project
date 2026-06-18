import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  loading?: boolean
}

export default function Button({
  children,
  variant = 'primary',
  loading = false,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const base =
    'relative inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#003B5C] focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden shadow-sm active:scale-[0.98]'

  const variants: Record<string, string> = {
    primary:
      'bg-gradient-to-r from-[#003B5C] to-[#00223E] text-white hover:shadow-md hover:from-[#004e7a] hover:to-[#003B5C]',
    secondary:
      'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-sm hover:shadow active:bg-slate-100',
    danger:
      'bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-md hover:from-red-500 hover:to-red-600',
  }

  return (
    <button
      disabled={disabled || loading}
      className={cn(base, variants[variant], className)}
      {...props}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Please wait...
        </>
      ) : (
        <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
      )}
    </button>
  )
}
