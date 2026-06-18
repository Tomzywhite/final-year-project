'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, ClipboardList, GraduationCap, User, LogOut, Plus, Building2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { NotificationBell } from '@/components/ui/NotificationBell'
import type { Notification } from '@/types'

interface StudentSidebarProps {
  userId: string
  initialNotifications: Notification[]
}

export function StudentSidebar({ userId, initialNotifications }: StudentSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const links = [
    { href: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/student/requests', label: 'My Requests', icon: ClipboardList },
    { href: '/student/records', label: 'Academic Records', icon: GraduationCap },
    { href: '/student/settings', label: 'Profile Settings', icon: User },
  ]

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="flex w-full flex-shrink-0 md:h-full md:w-64 flex-col bg-caleb-green text-white">
      {/* Brand Header */}
      <div className="flex h-24 items-center justify-between px-6 mt-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-widest text-white uppercase">Caleb University</span>
            <span className="text-xs text-white/70">Service Portal</span>
          </div>
        </div>
        <NotificationBell
          userId={userId}
          initialNotifications={initialNotifications}
          role="student"
        />
      </div>

      {/* Action Button */}
      <div className="px-6 pb-6">
        <Link
          href="/student/requests/new"
          className="flex w-full items-center justify-center gap-2 rounded bg-caleb-gold py-2.5 text-sm font-semibold text-caleb-green-dark transition-colors hover:bg-caleb-gold-hover"
        >
          <Plus className="h-4 w-4" />
          New Request
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col flex-1 px-3 py-2 overflow-y-auto space-y-1">
        {links.map((link) => {
          let isActive = pathname === link.href
          if (link.href === '/student/requests' && pathname.startsWith('/student/requests') && pathname !== '/student/requests/new') {
            isActive = true
          }

          return (
            <Link
              key={link.href}
              href={link.href}
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
      <div className="p-6">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 text-sm font-medium text-white/70 transition-colors hover:text-white"
        >
          <LogOut className="h-5 w-5 opacity-70" />
          Logout
        </button>
      </div>
    </div>
  )
}
