'use client'

import * as React from 'react'
import { Bell, X, CheckCheck, ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { markAllNotificationsRead } from '@/lib/notifications'
import type { Notification } from '@/types'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface NotificationBellProps {
  initialNotifications: Notification[]
  userId: string
  /** 'student' renders links to /student/requests/:id, 'admin' to /admin/requests/:id */
  role: 'student' | 'admin'
}

export function NotificationBell({ initialNotifications, userId, role }: NotificationBellProps) {
  const router = useRouter()
  const supabase = createClient()
  const [notifications, setNotifications] = React.useState<Notification[]>(initialNotifications)
  const [open, setOpen] = React.useState(false)
  const [marking, setMarking] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  const unread = notifications.filter(n => !n.is_read).length

  // Real-time subscription
  React.useEffect(() => {
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setNotifications(prev => [payload.new as Notification, ...prev])
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [userId, supabase])

  // Close on outside click
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  async function handleMarkAllRead() {
    setMarking(true)
    await markAllNotificationsRead(userId)
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    setMarking(false)
  }

  function handleNotificationClick(n: Notification) {
    const href = role === 'student'
      ? `/student/requests/${n.request_id}`
      : `/admin/requests/${n.request_id}`
    setOpen(false)
    router.push(href)
  }

  function formatTime(iso: string) {
    const d = new Date(iso)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        id="notification-bell"
        onClick={() => setOpen(o => !o)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white transition-all"
        aria-label={`Notifications${unread > 0 ? ` (${unread} unread)` : ''}`}
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-caleb-gold text-[10px] font-bold text-caleb-green-dark shadow">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-11 z-50 w-80 rounded-lg border border-gray-200 bg-white shadow-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <h3 className="text-sm font-semibold text-gray-900">
              Notifications
              {unread > 0 && (
                <span className="ml-2 inline-flex items-center rounded-full bg-caleb-gold/20 px-1.5 py-0.5 text-xs font-semibold text-caleb-green-dark">
                  {unread} new
                </span>
              )}
            </h3>
            <div className="flex items-center gap-2">
              {unread > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  disabled={marking}
                  className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-caleb-green transition-colors disabled:opacity-50"
                  title="Mark all as read"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  All read
                </button>
              )}
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Bell className="h-8 w-8 text-gray-200 mb-2" />
                <p className="text-sm text-gray-400">No notifications yet</p>
              </div>
            ) : (
              notifications.map(n => (
                <button
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={cn(
                    'w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-start gap-3 group',
                    !n.is_read && 'bg-caleb-green/5'
                  )}
                >
                  <div className={cn(
                    'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                    n.is_read ? 'bg-gray-200' : 'bg-caleb-gold'
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      'text-sm leading-snug',
                      n.is_read ? 'text-gray-500' : 'text-gray-900 font-medium'
                    )}>
                      {n.message}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-400">{formatTime(n.created_at)}</p>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0 text-gray-300 group-hover:text-caleb-green mt-1 transition-colors" />
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
