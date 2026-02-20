'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[App error]', error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-4xl font-bold text-destructive/20">Oops!</p>
      <h2 className="mt-4 text-xl font-bold text-foreground">Something went wrong</h2>
      <p className="mt-2 text-sm text-muted-foreground">An unexpected error occurred. Please try again.</p>
      <Button className="mt-6" onClick={reset}>
        Try again
      </Button>
    </div>
  )
}
