'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Bell,
  FileText,
  Award,
  ClipboardList,
  Users2,
  Image,
  Building,
  ShieldCheck,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react'
import { SCHOOL_NAME, SCHOOL_NAME_BN } from '@/lib/constants'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Teachers', href: '/admin/teachers', icon: Users },
  { label: 'Students', href: '/admin/students', icon: GraduationCap },
  { label: 'Notices', href: '/admin/notices', icon: Bell },
  { label: 'Results', href: '/admin/results', icon: FileText },
  { label: 'Certificates', href: '/admin/certificates', icon: Award },
  { label: 'Admissions', href: '/admin/admissions', icon: ClipboardList },
  { label: 'Committee', href: '/admin/committee', icon: Users2 },
  { label: 'Gallery', href: '/admin/gallery', icon: Image },
  { label: 'Facilities', href: '/admin/facilities', icon: Building },
  { label: 'Verif. Logs', href: '/admin/verification-logs', icon: ShieldCheck },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
]

interface AdminSidebarProps {
  mobileOpen?: boolean
  onMobileClose?: () => void
}

export function AdminSidebar({ mobileOpen = false, onMobileClose }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className={cn(
          'flex items-center gap-3 px-4 py-4 border-b border-primary-700',
          collapsed && 'justify-center px-2'
        )}
      >
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary-800 font-bold text-sm shadow ring-2 ring-accent-600 flex-shrink-0">
          MSC
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <div className="font-bold text-white text-xs leading-tight truncate">{SCHOOL_NAME}</div>
            <div className="text-xs text-primary-300 truncate">{SCHOOL_NAME_BN}</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-0.5 px-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onMobileClose}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                    collapsed && 'justify-center px-2',
                    active
                      ? 'bg-white text-primary-800 shadow-sm'
                      : 'text-primary-100 hover:bg-primary-700 hover:text-white'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-4 w-4 flex-shrink-0',
                      active ? 'text-primary-800' : 'text-primary-300'
                    )}
                  />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                  {!collapsed && active && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-500" />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-primary-700">
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            title={collapsed ? 'Logout' : undefined}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-primary-200 hover:bg-red-600 hover:text-white transition-all',
              collapsed && 'justify-center px-2'
            )}
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </form>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col bg-primary-800 transition-all duration-300 relative',
          collapsed ? 'w-16' : 'w-60'
        )}
      >
        <SidebarContent />
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors z-10"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3 text-gray-600" />
          ) : (
            <ChevronLeft className="h-3 w-3 text-gray-600" />
          )}
        </button>
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={onMobileClose}
          />
          <aside className="relative w-64 bg-primary-800 flex flex-col h-full shadow-xl">
            <button
              onClick={onMobileClose}
              className="absolute top-3 right-3 text-primary-300 hover:text-white p-1 rounded"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  )
}
