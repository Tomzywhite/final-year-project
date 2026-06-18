import { createClient } from '@/lib/supabase/server'
import { getCurrentUserWithProfile } from '@/lib/auth'
import { getStudentRequests } from '@/lib/requests'
import { RequestList } from '@/components/student/RequestList'
import { EmptyState } from '@/components/ui/EmptyState'
import Link from 'next/link'
import { Plus, GraduationCap } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Academic Records | Caleb Student Services',
  description: 'View and track your academic-related service requests.',
}

// Request types that fall under "Academic Records"
const ACADEMIC_TYPES = [
  'Course Registration Issue',
  'Result Complaint',
  'Transcript Request',
  'Clearance Issue',
]

export default async function AcademicRecordsPage() {
  const supabase = await createClient()
  const result = await getCurrentUserWithProfile(supabase)
  if (!result) return null

  const allRequests = await getStudentRequests(result.userId)
  const academicRequests = allRequests.filter(r =>
    ACADEMIC_TYPES.includes(r.request_type)
  )

  const stats = {
    total: academicRequests.length,
    pending: academicRequests.filter(r => r.status === 'pending').length,
    resolved: academicRequests.filter(r => r.status === 'resolved').length,
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-caleb-green/10 mt-1">
            <GraduationCap className="h-6 w-6 text-caleb-green" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Academic Records</h1>
            <p className="mt-1 text-gray-600">
              Track your transcript requests, result complaints, course registration issues, and clearance matters.
            </p>
          </div>
        </div>
        <Link
          href="/student/requests/new"
          className="inline-flex h-10 items-center justify-center gap-2 rounded bg-caleb-green px-4 text-sm font-medium text-white transition-colors hover:bg-caleb-green-dark"
        >
          <Plus className="h-4 w-4" />
          New Request
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 grid-cols-3">
        <div className="bg-white border border-gray-200 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Total</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white border border-gray-200 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Pending</p>
          <p className="mt-2 text-2xl font-bold text-amber-600">{stats.pending}</p>
        </div>
        <div className="bg-white border border-gray-200 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Resolved</p>
          <p className="mt-2 text-2xl font-bold text-emerald-600">{stats.resolved}</p>
        </div>
      </div>

      {/* Requests Table */}
      <div className="border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900">Academic Requests</h2>
        </div>
        {academicRequests.length > 0 ? (
          <RequestList requests={academicRequests} />
        ) : (
          <EmptyState message="You don't have any academic-related requests yet. Submit a transcript request, result complaint, or course registration issue to see it here." />
        )}
      </div>
    </div>
  )
}
