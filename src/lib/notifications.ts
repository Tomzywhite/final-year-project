'use server'

import { createClient } from './supabase/server'
import type { Notification } from '@/types'

// ─── Fetch notifications for a user ──────────────────────────────────────────

export async function getNotifications(userId: string): Promise<Notification[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    console.error('Error fetching notifications:', error)
    return []
  }

  return data as Notification[]
}

// ─── Count unread notifications ───────────────────────────────────────────────

export async function getUnreadCount(userId: string): Promise<number> {
  const supabase = await createClient()

  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false)

  if (error) {
    console.error('Error counting unread notifications:', error)
    return 0
  }

  return count ?? 0
}

// ─── Mark all notifications as read ──────────────────────────────────────────

export async function markAllNotificationsRead(userId: string): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false)

  if (error) {
    console.error('Error marking notifications as read:', error)
    return false
  }

  return true
}

// ─── Mark a single notification as read ──────────────────────────────────────

export async function markNotificationRead(notificationId: string): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)

  if (error) {
    console.error('Error marking notification as read:', error)
    return false
  }

  return true
}
