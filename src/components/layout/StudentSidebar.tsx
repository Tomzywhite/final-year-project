'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, ClipboardList, GraduationCap, User, LogOut, Plus, Building2, Menu, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { NotificationBell } from '@/components/ui/NotificationBell'
import type { Notification } from '@/types'

interface StudentSidebarProps {
  userId: string
  initialNotifications: Notification[]
}

export function StudentSidebar({ userId, initialNotifications }: StudentSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const links = [
    { href: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/student/requests', label: 'My Requests', icon: ClipboardList },
    { href: '/student/records', label: 'Academic Records', icon: GraduationCap },
    { href: '/student/settings', label: 'Profile Settings', icon: User },
  ]

  const handleLogout = async () => {
    setIsOpen(false)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <>
      {/* Mobile Top Header Bar */}
      <div className="flex h-16 w-full items-center justify-between bg-gradient-to-r from-caleb-green-dark to-caleb-green px-4 text-white md:hidden border-b border-emerald-950/40 shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
            <Building2 className="h-5 w-5 text-caleb-gold" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold tracking-wider text-white uppercase leading-none">Caleb University</span>
            <span className="text-[10px] text-emerald-300/80 font-medium tracking-wide mt-1">Service Portal</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <NotificationBell
            userId={userId}
            initialNotifications={initialNotifications}
            role="student"
          />
          <button
            onClick={() => setIsOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-white/10 text-white transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Backdrop Overlay (Mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm transition-opacity md:hidden animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-gradient-to-b from-[#061d15] via-caleb-green to-[#041610] text-white border-r border-emerald-950/20 transition-transform duration-300 ease-in-out shadow-2xl",
          "md:static md:w-64 md:h-full md:translate-x-0 md:flex md:shrink-0 md:shadow-none",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="flex h-24 items-center justify-between px-6 mt-2 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10 shadow-inner">
              <Building2 className="h-6 w-6 text-caleb-gold" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-widest text-white uppercase leading-none">Caleb University</span>
              <span className="text-[10px] text-emerald-400 font-bold tracking-wider uppercase mt-1">Service Portal</span>
            </div>
          </div>
          
          {/* NotificationBell on desktop, Close button on mobile */}
          <div className="hidden md:block">
            <NotificationBell
              userId={userId}
              initialNotifications={initialNotifications}
              role="student"
            />
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg hover:bg-white/10 text-white transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Action Button - Pulses on Hover */}
        <div className="px-5 pb-6 shrink-0">
          <Link
            href="/student/requests/new"
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-caleb-gold py-3 text-xs font-bold tracking-wide uppercase text-caleb-green-dark transition-all duration-300 hover:bg-caleb-gold-hover hover:-translate-y-0.5 glow-gold shadow-lg shadow-caleb-gold/25"
          >
            <Plus className="h-4 w-4 stroke-[3px]" />
            New Request
          </Link>
        </div>

        {/* Navigation - Rounded pills and smooth state transitions */}
        <nav className="flex flex-col flex-1 px-4 py-2 overflow-y-auto space-y-1.5 scrollbar-thin">
          {links.map((link) => {
            let isActive = pathname === link.href
            if (link.href === '/student/requests' && pathname.startsWith('/student/requests') && pathname !== '/student/requests/new') {
              isActive = true
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'group flex items-center gap-3.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all px-4 py-3.5 w-full border-l-2',
                  isActive
                    ? 'bg-white/10 text-caleb-gold border-caleb-gold shadow-sm backdrop-blur-md'
                    : 'border-transparent text-emerald-100/60 hover:bg-white/5 hover:text-white hover:border-white/10'
                )}
              >
                <link.icon className={cn('h-5 w-5 transition-transform duration-300 group-hover:scale-110', isActive ? 'text-caleb-gold' : 'text-emerald-100/60 group-hover:text-emerald-100')} />
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-6 border-t border-white/5 shrink-0 bg-black/10">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 text-xs font-bold tracking-wider uppercase text-emerald-100/50 transition-colors hover:text-white group"
          >
            <LogOut className="h-5 w-5 stroke-[2px] transition-transform duration-300 group-hover:-translate-x-1" />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}
