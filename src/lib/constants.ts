import type { RequestStatus, RequestType } from '@/types'

// ─── Request Types ────────────────────────────────────────────────────────────

export const REQUEST_TYPES: RequestType[] = [
  'Course Registration Issue',
  'Result Complaint',
  'Transcript Request',
  'Clearance Issue',
  'Hostel Complaint',
  'ID Card Issue',
  'Portal Access Problem',
  'Other',
]

// ─── Status Values ────────────────────────────────────────────────────────────

export const REQUEST_STATUSES: RequestStatus[] = [
  'pending',
  'in_progress',
  'resolved',
  'rejected',
]

// ─── Human-readable Status Labels ────────────────────────────────────────────

export const STATUS_LABELS: Record<RequestStatus, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  rejected: 'Rejected',
}

// ─── Premium Status Badge Colours (Tailwind classes) ──────────────────────────

export const STATUS_COLOURS: Record<RequestStatus, string> = {
  pending: 'bg-amber-500/10 text-amber-700 border border-amber-500/20 shadow-sm',
  in_progress: 'bg-indigo-500/10 text-indigo-700 border border-indigo-500/20 shadow-sm',
  resolved: 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 shadow-sm',
  rejected: 'bg-rose-500/10 text-rose-700 border border-rose-500/20 shadow-sm',
}
