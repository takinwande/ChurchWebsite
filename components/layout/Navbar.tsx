'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useScroll, useMotionValueEvent } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { MobileMenu } from './MobileMenu'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/plan-a-visit', label: 'Plan a Visit' },
  { href: '/sermons', label: 'Sermons' },
  { href: '/events', label: 'Events' },
  { href: '/about', label: 'About' },
  { href: '/ministries', label: 'Ministries' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/prayer', label: 'Prayer' },
  { href: '/contact', label: 'Contact' },
]

export function Navbar() {
  const pathname = usePathname()
  const { scrollY } = useScroll()
  const [isScrolled, setIsScrolled] = useState(false)

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 10)
  })

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 transition-shadow duration-200',
        isScrolled ? 'border-border/80 shadow-md' : 'border-border/60 shadow-none'
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo / Name */}
        <Link href="/" className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md">
          <Image
            src="/logo.jpg"
            alt=""
            width={44}
            height={44}
            className="rounded-sm object-contain"
            priority
          />
          <span className="text-lg font-bold text-primary leading-tight">
            RCCG{' '}
            <span className="hidden sm:inline">Covenant Assembly</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Primary navigation">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'px-3 py-1.5 text-sm font-medium rounded-md transition-colors hover:text-primary hover:bg-primary/5',
                pathname === href
                  ? 'text-primary font-semibold bg-primary/8'
                  : 'text-muted-foreground'
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden lg:inline-flex">
            <Link href="/give">Give</Link>
          </Button>
          <MobileMenu />
        </div>
      </div>
    </header>
  )
}
