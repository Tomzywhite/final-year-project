'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, ClipboardList, Users, LogOut, Building2, User, Menu, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { NotificationBell } from '@/components/ui/NotificationBell'
import type { Notification } from '@/types'

interface AdminSidebarProps {
  role?: string
  userId: string
  initialNotifications: Notification[]
}

export function AdminSidebar({ role, userId, initialNotifications }: AdminSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const links = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/requests', label: 'All Requests', icon: ClipboardList },
    { href: '/admin/settings', label: 'Profile Settings', icon: User },
  ]

  if (role === 'super_admin') {
    links.push({ href: '/admin/staff', label: 'Manage Staff', icon: Users })
  }

  const handleLogout = async () => {
    setIsOpen(false)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <>
      {/* Mobile Top Header Bar */}
      <div className="flex h-16 w-full items-center justify-between bg-caleb-green px-4 text-white md:hidden border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold tracking-wider text-white uppercase">Caleb University</span>
            <span className="text-[10px] text-white/70">Admin Portal</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <NotificationBell
            userId={userId}
            initialNotifications={initialNotifications}
            role="admin"
          />
          <button
            onClick={() => setIsOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-white/10 text-white"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Backdrop Overlay (Mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity md:hidden animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-caleb-green text-white transition-transform duration-300 ease-in-out",
          "md:static md:w-64 md:h-full md:translate-x-0 md:flex md:shrink-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="flex h-24 items-center justify-between px-6 mt-2 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-widest text-white uppercase">Caleb University</span>
              <span className="text-xs text-white/70">Admin Portal</span>
            </div>
          </div>

          {/* NotificationBell on desktop, Close button on mobile */}
          <div className="hidden md:block">
            <NotificationBell
              userId={userId}
              initialNotifications={initialNotifications}
              role="admin"
            />
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg hover:bg-white/10 text-white"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col flex-1 px-3 py-2 overflow-y-auto space-y-1">
          {links.map((link) => {
            const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/admin/dashboard')

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'group flex items-center gap-3 rounded text-sm font-medium transition-all px-3 py-3 w-full border-l-4',
                  isActive
                    ? 'bg-white/10 text-white border-caleb-gold'
                    : 'border-transparent text-white/70 hover:bg-white/5 hover:text-white'
                )}
              >
                <link.icon className={cn('h-5 w-5', !isActive && 'opacity-70 group-hover:opacity-100')} />
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-6 shrink-0">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 text-sm font-medium text-white/70 transition-colors hover:text-white"
          >
            <LogOut className="h-5 w-5 opacity-70" />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}
