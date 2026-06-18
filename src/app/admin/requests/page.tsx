import { createClient } from '@/lib/supabase/server'
import { getCurrentUserWithProfile } from '@/lib/auth'
import { getAllRequests } from '@/lib/requests'
import { RequestsTable } from '@/components/admin/RequestsTable'
import { FilterBar } from '@/components/admin/FilterBar'
import type { RequestStatus } from '@/types'

interface AdminRequestsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function AdminRequestsPage(props: AdminRequestsPageProps) {
  const searchParams = await props.searchParams;
  const statusFilter = typeof searchParams.status === 'string' ? searchParams.status : null
  const typeFilter = typeof searchParams.type === 'string' ? searchParams.type : null

  const supabase = await createClient()
  const result = await getCurrentUserWithProfile(supabase)
  if (!result) return null

  let requests = await getAllRequests()

  if (statusFilter && statusFilter !== 'all') {
    requests = requests.filter(req => req.status === statusFilter as RequestStatus)
  }
  
  if (typeFilter && typeFilter !== 'all') {
    requests = requests.filter(req => req.request_type === typeFilter)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Request Management</h1>
        <p className="mt-1 text-gray-600">Review, update, and manage all incoming student service requests.</p>
      </div>

      <FilterBar />

      <div className="border border-gray-200 bg-white shadow-sm">
        <RequestsTable requests={requests} compact={false} />
        
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
