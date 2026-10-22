import Link from 'next/link'
import { cn } from '@/lib/utils'

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={cn('size-8', className)}
      fill="none"
    >
      <rect width="32" height="32" rx="9" fill="url(#pa-grad)" />
      <path
        d="M16 6.5c.6 4.4 2.6 6.9 7 7.5-4.4.6-6.4 3.1-7 7.5-.6-4.4-2.6-6.9-7-7.5 4.4-.6 6.4-3.1 7-7.5Z"
        fill="#fff"
      />
      <circle cx="23.5" cy="22.5" r="1.8" fill="#fff" fillOpacity=".85" />
      <defs>
        <linearGradient id="pa-grad" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7C6DF0" />
          <stop offset="1" stopColor="#4F46E5" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="PromptAvero home"
      className={cn('inline-flex items-center gap-2.5 rounded-lg', className)}
    >
      <LogoMark />
      <span className="font-heading text-xl font-semibold tracking-tight text-foreground">
        Prompt<span className="text-brand-text">Avero</span>
      </span>
    </Link>
  )
}
