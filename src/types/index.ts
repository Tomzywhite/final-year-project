// ─── Roles ───────────────────────────────────────────────────────────────────

export type Role = 'student' | 'admin' | 'pending_admin' | 'super_admin'

// ─── Request Enums ───────────────────────────────────────────────────────────

export type RequestStatus = 'pending' | 'in_progress' | 'resolved' | 'rejected'

export type RequestType =
  | 'Course Registration Issue'
  | 'Result Complaint'
  | 'Transcript Request'
  | 'Clearance Issue'
  | 'Hostel Complaint'
  | 'ID Card Issue'
  | 'Portal Access Problem'
  | 'Other'

// ─── Database Models ──────────────────────────────────────────────────────────

export interface Profile {
  id: string
  full_name: string
  email: string
  matric_number: string | null
  role: Role
  created_at: string
  updated_at: string
}

export interface ServiceRequest {
  id: string
  request_number: string
  student_id: string
  request_type: RequestType
  subject: string
  description: string
  status: RequestStatus
  admin_remark: string | null
  attachment_url: string | null
  assigned_to: string | null
  created_at: string
  updated_at: string
}

// ─── Extended (Joined) Types ─────────────────────────────────────────────────

export interface ServiceRequestWithProfile extends ServiceRequest {
  profiles: Pick<Profile, 'full_name' | 'email' | 'matric_number'>
  assigned_admin: Pick<Profile, 'id' | 'full_name'> | null
}

// ─── Dashboard Stats ─────────────────────────────────────────────────────────

export interface RequestStats {
  total: number
  pending: number
  in_progress: number
  resolved: number
  rejected: number
}

// ─── Notifications ────────────────────────────────────────────────────────────

export interface Notification {
  id: string
  user_id: string
  request_id: string
  message: string
  is_read: boolean
  created_at: string
}

// ─── Activity Log ─────────────────────────────────────────────────────────────

export interface RequestActivity {
  id: string
  request_id: string
  actor_id: string | null
  actor_name: string | null
  action: string
  created_at: string
}
