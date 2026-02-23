import React from 'react'

export interface GivingMethodCardProps {
  icon: React.ReactNode
  name: string
  description: string
  detail: string
  action?: {
    label: string
    href: string
  }
  note?: string
}

export function GivingMethodCard({
  icon,
  name,
  description,
  detail,
  action,
  note,
}: GivingMethodCardProps) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
      <div className="mb-4 flex h-16 w-16 items-center justify-center" aria-hidden="true">
        {icon}
      </div>

      <h2 className="mb-2 text-xl font-bold text-foreground">{name}</h2>
      <p className="mb-5 text-sm text-muted-foreground leading-relaxed">{description}</p>

      <p className="mb-5 rounded-lg bg-muted px-4 py-2 font-mono text-base font-semibold text-foreground break-all">
        {detail}
      </p>

      {action && (
        <a
          href={action.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {action.label}
        </a>
      )}

      {note && (
        <p className="mt-4 text-xs text-muted-foreground leading-relaxed">{note}</p>
      )}
    </div>
  )
}
