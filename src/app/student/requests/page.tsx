import { createClient } from '@/lib/supabase/server'
import { getCurrentUserWithProfile } from '@/lib/auth'
import { getStudentRequests } from '@/lib/requests'
import { RequestList } from '@/components/student/RequestList'
import { Search, Filter } from 'lucide-react'

export default async function StudentRequestsPage() {
  const supabase = await createClient()
  const result = await getCurrentUserWithProfile(supabase)
  if (!result) return null

  const requests = await getStudentRequests(result.userId)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Requests</h1>
        <p className="mt-1 text-gray-600">Track and manage all your active and past service requests.</p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-4 border border-gray-200 bg-white p-4 md:flex-row md:items-end shadow-sm">
        <div className="flex-1 space-y-1">
          <label className="text-xs font-semibold text-gray-500 tracking-wider uppercase">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by ID or Subject" 
              className="w-full rounded border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-caleb-green focus:outline-none focus:ring-1 focus:ring-caleb-green"
            />
          </div>
        </div>
        
        <div className="w-full md:w-48 space-y-1">
          <label className="text-xs font-semibold text-gray-500 tracking-wider uppercase">Status</label>
          <select className="w-full rounded border border-gray-300 bg-white py-2 px-3 text-sm focus:border-caleb-green focus:outline-none focus:ring-1 focus:ring-caleb-green">
            <option>All Statuses</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Resolved</option>
            <option>Rejected</option>
          </select>
        </div>

        <div className="w-full md:w-48 space-y-1">
          <label className="text-xs font-semibold text-gray-500 tracking-wider uppercase">Type</label>
          <select className="w-full rounded border border-gray-300 bg-white py-2 px-3 text-sm focus:border-caleb-green focus:outline-none focus:ring-1 focus:ring-caleb-green">
            <option>All Types</option>
            <option>Academic</option>
            <option>IT Support</option>
            <option>Facilities</option>
            <option>Financial</option>
          </select>
        </div>

        <button className="flex h-[38px] w-full items-center justify-center gap-2 rounded bg-caleb-green px-6 text-sm font-medium text-white transition-colors hover:bg-caleb-green-dark md:w-auto">
          <Filter className="h-4 w-4" />
          Filter
        </button>
      </div>

      <div className="border border-gray-200 bg-white shadow-sm">
        <RequestList requests={requests} compact={false} />
        
        {/* Pagination mock */}
        {requests.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
            <span className="text-sm text-gray-600">Showing 1 to {requests.length} requests</span>
            <div className="flex gap-2">
              <button className="flex h-8 w-8 items-center justify-center rounded border border-gray-200 bg-white text-gray-400 hover:bg-gray-50" disabled>
                &lsaquo;
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded border border-gray-200 bg-white text-gray-700 hover:bg-gray-50">
                &rsaquo;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
