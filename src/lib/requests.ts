'use server'

import { createClient } from './supabase/server'
import { logActivity } from './activity'
import type { RequestStats, ServiceRequest, ServiceRequestWithProfile, RequestStatus, Profile, Role } from '@/types'

export async function getStudentStats(studentId: string): Promise<RequestStats> {
  const supabase = createClient()
  
  const { data, error } = await (await supabase)
    .from('service_requests')
    .select('status')
    .eq('student_id', studentId)

  if (error) {
    console.error('Error fetching stats:', error)
    return {
      total: 0,
      pending: 0,
      in_progress: 0,
      resolved: 0,
      rejected: 0,
    }
  }

  const stats: RequestStats = {
    total: data.length,
    pending: data.filter(r => r.status === 'pending').length,
    in_progress: data.filter(r => r.status === 'in_progress').length,
    resolved: data.filter(r => r.status === 'resolved').length,
    rejected: data.filter(r => r.status === 'rejected').length,
  }

  return stats
}

export async function getStudentRequests(studentId: string): Promise<ServiceRequest[]> {
  const supabase = createClient()
  
  const { data, error } = await (await supabase)
    .from('service_requests')
    .select('*')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching requests:', error)
    return []
  }

  return data as ServiceRequest[]
}

export async function getRequestById(id: string): Promise<ServiceRequest | null> {
  const supabase = createClient()
  
  const { data, error } = await (await supabase)
    .from('service_requests')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching request by id:', error)
    return null
  }

  return data as ServiceRequest
}

// --- Admin methods ---

export async function getAllRequestStats(): Promise<RequestStats> {
  const supabase = createClient()
  
  const { data, error } = await (await supabase)
    .from('service_requests')
    .select('status')

  if (error) {
    console.error('Error fetching all stats:', error)
    return {
      total: 0,
      pending: 0,
      in_progress: 0,
      resolved: 0,
      rejected: 0,
    }
  }

  const stats: RequestStats = {
    total: data.length,
    pending: data.filter(r => r.status === 'pending').length,
    in_progress: data.filter(r => r.status === 'in_progress').length,
    resolved: data.filter(r => r.status === 'resolved').length,
    rejected: data.filter(r => r.status === 'rejected').length,
  }

  return stats
}

export async function getAllRequests(): Promise<ServiceRequestWithProfile[]> {
  const supabase = createClient()
  
  const { data, error } = await (await supabase)
    .from('service_requests')
    .select('*, profiles!service_requests_student_id_fkey ( full_name, email, matric_number ), assigned_admin:profiles!service_requests_assigned_to_fkey ( id, full_name )')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching all requests:', error)
    return []
  }

  return data as ServiceRequestWithProfile[]
}

export async function getRequestByIdWithProfile(id: string): Promise<ServiceRequestWithProfile | null> {
  const supabase = createClient()
  
  const { data, error } = await (await supabase)
    .from('service_requests')
    .select('*, profiles!service_requests_student_id_fkey ( full_name, email, matric_number ), assigned_admin:profiles!service_requests_assigned_to_fkey ( id, full_name )')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching request by id with profile:', error)
    return null
  }

  return data as ServiceRequestWithProfile
}

// ─── Claim / Unclaim ─────────────────────────────────────────────────────────

export async function claimRequest(
  requestId: string,
  adminId: string
): Promise<{ success: boolean; message: string }> {
  const supabase = createClient()

  const { data, error } = await (await supabase)
    .from('service_requests')
    .update({ assigned_to: adminId, status: 'in_progress' })
    .eq('id', requestId)
    .is('assigned_to', null)   // atomic guard — only succeeds if still unclaimed
    .select()
    .single()

  if (error || !data) {
    return { success: false, message: 'This request has already been claimed by another admin.' }
  }

  // Log the claim action
  await logActivity({
    requestId,
    actorId: adminId,
    action: 'Request claimed and set to In Progress',
  })

  return { success: true, message: 'Request claimed successfully.' }
}

export async function unclaimRequest(
  requestId: string,
  adminId: string,
  role: Role
): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient()

  const { error } = role === 'super_admin'
    ? await supabase
        .from('service_requests')
        .update({ assigned_to: null })
        .eq('id', requestId)
    : await supabase
        .from('service_requests')
        .update({ assigned_to: null })
        .eq('id', requestId)
        .eq('assigned_to', adminId)  // regular admins can only unclaim their own

  if (error) {
    return { success: false, message: 'Failed to unclaim request.' }
  }

  await logActivity({
    requestId,
    actorId: adminId,
    action: 'Request unclaimed and returned to pool',
  })

  return { success: true, message: 'Request unclaimed.' }
}

export async function updateRequestStatus(
  id: string,
  payload: { status: RequestStatus; admin_remark?: string }
): Promise<ServiceRequest | null> {
  const ObjectToUpdate: any = { status: payload.status }
  if (payload.admin_remark !== undefined) {
    ObjectToUpdate.admin_remark = payload.admin_remark
  }

  const supabase = createClient()
  
  const { data, error } = await (await supabase)
    .from('service_requests')
    .update(ObjectToUpdate)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating request:', error.message)
    return null
  }

  // Build a readable action string
  const statusLabel = payload.status.replace('_', ' ')
  const action = payload.admin_remark
    ? `Status changed to "${statusLabel}" with remark`
    : `Status changed to "${statusLabel}"`

  await logActivity({
    requestId: id,
    action,
  })

  return data as ServiceRequest
}

// ─── Signed Attachment URL ────────────────────────────────────────────────────

export async function getSignedAttachmentUrl(path: string): Promise<string | null> {
  const supabase = await createClient()

  const { data, error } = await supabase.storage
    .from('request-attachments')
    .createSignedUrl(path, 60 * 60) // 1 hour

  if (error || !data) {
    console.error('Error generating signed URL:', error)
    return null
  }

  return data.signedUrl
}

export async function getPendingAdmins(): Promise<Profile[]> {
  const supabase = createClient()
  
  const { data, error } = await (await supabase)
    .from('profiles')
    .select('*')
    .eq('role', 'pending_admin')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching pending admins:', error)
    return []
  }

  return data as Profile[]
}

export async function updateUserRole(userId: string, newRole: Role) {
  const supabase = createClient()
  
  const { error } = await (await supabase)
    .from('profiles')
    .update({ role: newRole })
    .eq('id', userId)

  if (error) {
    console.error('Error updating user role:', error.message)
    return false
  }

  return true
}
