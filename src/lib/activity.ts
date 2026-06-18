'use server'

import { createClient } from './supabase/server'
import type { RequestActivity } from '@/types'

// ─── Fetch all activity for a request ────────────────────────────────────────

export async function getRequestActivity(requestId: string): Promise<RequestActivity[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('request_activity')
    .select('*')
    .eq('request_id', requestId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching request activity:', error)
    return []
  }

  return data as RequestActivity[]
}

// ─── Log an activity entry ────────────────────────────────────────────────────

export async function logActivity({
  requestId,
  actorId,
  actorName,
  action,
}: {
  requestId: string
  actorId?: string | null
  actorName?: string | null
  action: string
}): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('request_activity')
    .insert({
      request_id: requestId,
      actor_id: actorId ?? null,
      actor_name: actorName ?? null,
      action,
    })

  if (error) {
    // Non-fatal — don't throw, just log
    console.error('Error logging activity:', error)
  }
}
