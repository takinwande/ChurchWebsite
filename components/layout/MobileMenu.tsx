'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/plan-a-visit', label: 'Plan a Visit' },
  { href: '/sermons', label: 'Sermons' },
  { href: '/events', label: 'Events' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function MobileMenu() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          aria-label="Open navigation menu"
          className="rounded-md p-2 text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72">
        <SheetHeader>
          <SheetTitle className="text-left text-primary">RCCG Covenant Assembly</SheetTitle>
        </SheetHeader>
        <nav className="mt-6 flex flex-col gap-1" aria-label="Mobile navigation">
          {navLinks.map(({ href, label }) => (
            <SheetClose asChild key={href}>
              <Link
                href={href}
                className={cn(
                  'rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                  pathname === href ? 'bg-primary/10 text-primary font-semibold' : 'text-foreground'
                )}
              >
                {label}
              </Link>
            </SheetClose>
          ))}
          <SheetClose asChild>
            <Link href="/give">
              <Button className="mt-4 w-full" size="default">
                Give
              </Button>
            </Link>
          </SheetClose>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
