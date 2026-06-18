import { createClient } from '@/lib/supabase/server'
import { getCurrentUserWithProfile } from '@/lib/auth'
import { getAllRequestStats, getAllRequests } from '@/lib/requests'
import { StatsRow } from '@/components/admin/StatsRow'
import { RequestsTable } from '@/components/admin/RequestsTable'
import { GenerateReportButton } from '@/components/admin/GenerateReportButton'
import { RequestsChart } from '@/components/admin/RequestsChart'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const result = await getCurrentUserWithProfile(supabase)
  if (!result) return null

  const stats = await getAllRequestStats()
  const allRequests = await getAllRequests()
  const recentRequests = allRequests.slice(0, 5)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Admin Dashboard</h1>
          <p className="mt-1 text-gray-600">Overview of all student service requests and system metrics.</p>
        </div>
        <GenerateReportButton requests={allRequests} />
      </div>

      <StatsRow stats={stats} />

      <RequestsChart requests={allRequests} />

      <div className="border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900">Recent System Activity</h2>
        </div>
        <RequestsTable requests={recentRequests} compact={true} />
        {recentRequests.length > 0 && (
          <div className="border-t border-gray-100 bg-gray-50 px-6 py-3 text-center">
            <Link
              href="/admin/requests"
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
