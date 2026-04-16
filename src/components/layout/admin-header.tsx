'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { Menu, ChevronDown, User, LogOut, Settings } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { getInitials } from '@/lib/utils'

interface AdminHeaderProps {
  title?: string
  onMobileMenuToggle?: () => void
}

export function AdminHeader({ title = 'Dashboard', onMobileMenuToggle }: AdminHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { data: session } = useSession()

  const userName = session?.user?.name ?? 'Admin'
  const userRole = (session?.user as { role?: string })?.role ?? 'Administrator'
  const userInitials = getInitials(userName)

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-30 shadow-sm">
      {/* Left: mobile toggle + title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-1.5 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-base font-semibold text-gray-800">{title}</h1>
      </div>

      {/* Right: user dropdown */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          aria-expanded={dropdownOpen}
          aria-haspopup="true"
        >
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-primary-800 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {userInitials}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium text-gray-800 leading-tight">{userName}</p>
            <p className="text-xs text-gray-500 leading-tight capitalize">{userRole}</p>
          </div>
          <ChevronDown
            className={`h-4 w-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Dropdown */}
        {dropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setDropdownOpen(false)}
            />
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20">
              {/* User info */}
              <div className="px-4 py-2.5 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500 capitalize">{userRole}</p>
              </div>

              {/* Menu items */}
              <Link
                href="/admin/settings"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Settings className="h-4 w-4 text-gray-400" />
                Settings
              </Link>
              <Link
                href="/admin/profile"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <User className="h-4 w-4 text-gray-400" />
                Profile
              </Link>

              <div className="border-t border-gray-100 mt-1">
                <form action="/api/auth/signout" method="POST">
                  <button
                    type="submit"
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
