'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Menu, X, ShieldCheck } from 'lucide-react'
import { SCHOOL_NAME, SCHOOL_NAME_BN, NAV_LINKS } from '@/lib/constants'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition-all duration-300',
        isScrolled ? 'bg-white shadow-md' : 'bg-white'
      )}
    >
      {/* Top bar */}
      <div className="bg-primary-800 text-white py-1.5">
        <div className="container mx-auto px-4 flex justify-between items-center text-xs">
          <span>EIIN: 102726 | Established: 1937</span>
          <span className="hidden sm:block">মিরুখালী, মঠবাড়িয়া, পিরোজপুর, বাংলাদেশ</span>
        </div>
      </div>

      {/* Main nav */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-primary-800 flex items-center justify-center text-white font-bold text-lg shadow-md ring-2 ring-accent-600 ring-offset-1">
              MSC
            </div>
            <div>
              <div className="font-bold text-primary-800 text-sm leading-tight">{SCHOOL_NAME}</div>
              <div className="text-xs text-gray-500">{SCHOOL_NAME_BN}</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-primary-800 text-white'
                    : 'text-gray-700 hover:bg-primary-50 hover:text-primary-800'
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/verify"
              className="ml-2 flex items-center gap-1.5 bg-accent-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-accent-500 transition-colors"
            >
              <ShieldCheck className="h-4 w-4" />
              Verify
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="container mx-auto px-4 py-2 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'px-4 py-2.5 rounded-md text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-primary-800 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/verify"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 bg-accent-600 text-white rounded-md text-sm font-medium hover:bg-accent-500 transition-colors mt-1"
            >
              <ShieldCheck className="h-4 w-4" />
              Verify Certificate
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
