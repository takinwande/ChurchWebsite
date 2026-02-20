import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold text-primary/20">404</p>
      <h1 className="mt-4 text-2xl font-bold text-foreground">Page not found</h1>
      <p className="mt-2 text-muted-foreground">
        Sorry, we couldn&apos;t find the page you&apos;re looking for.
      </p>
      <Button asChild className="mt-6">
        <Link href="/">Go back home</Link>
      </Button>
    </div>
  )
}
