import { createClient } from '@/lib/supabase/server'
import { getCurrentUserWithProfile } from '@/lib/auth'
import { getStudentStats, getStudentRequests } from '@/lib/requests'
import { StatsRow } from '@/components/student/StatsRow'
import { RequestList } from '@/components/student/RequestList'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default async function StudentDashboard() {
  const supabase = await createClient()
  const result = await getCurrentUserWithProfile(supabase)
  if (!result) return null

  const stats = await getStudentStats(result.userId)
  const allRequests = await getStudentRequests(result.userId)
  const recentRequests = allRequests.slice(0, 5)

  const firstName = result.profile.full_name.split(' ')[0]

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Welcome, {firstName}</h1>
          <p className="mt-1 text-gray-600">Here is an overview of your current academic requests and standing.</p>
        </div>
        <Link
          href="/student/requests/new"
          className="inline-flex h-10 items-center justify-center gap-2 rounded bg-caleb-green px-4 text-sm font-medium text-white transition-colors hover:bg-caleb-green-dark"
        >
          <Plus className="h-4 w-4" />
          Submit New Request
        </Link>
      </div>

      <StatsRow stats={stats} />

      <div className="border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Recent Requests</h2>
        </div>
        <RequestList requests={recentRequests} compact={true} />
        {recentRequests.length > 0 && (
          <div className="border-t border-gray-100 bg-gray-50 px-6 py-3 text-center">
            <Link
              href="/student/requests"
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              View All Requests
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
