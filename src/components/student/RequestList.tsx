import { EmptyState } from '@/components/ui/EmptyState'
import type { ServiceRequest } from '@/types'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export function RequestList({ requests, compact = false }: { requests: ServiceRequest[], compact?: boolean }) {
  if (requests.length === 0) {
    return (
      <EmptyState message="You haven't submitted any service requests yet." />
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center rounded-full bg-[#fde68a] px-2.5 py-0.5 text-xs font-semibold text-[#854d0e]">Pending</span>
      case 'in_progress':
        return <span className="inline-flex items-center rounded-full bg-[#e0e7ff] px-2.5 py-0.5 text-xs font-semibold text-[#3730a3]">In Progress</span>
      case 'resolved':
        return <span className="inline-flex items-center rounded-full bg-[#a7f3d0] px-2.5 py-0.5 text-xs font-semibold text-[#065f46]">Resolved</span>
      case 'rejected':
        return <span className="inline-flex items-center rounded-full bg-[#fecaca] px-2.5 py-0.5 text-xs font-semibold text-[#991b1b]">Rejected</span>
      default:
        return <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-800">{status}</span>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-gray-50/50 text-xs font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-100">
          <tr>
            <th className="px-6 py-4">Request ID</th>
            <th className="px-6 py-4">{compact ? 'Type' : 'Request Type'}</th>
            {!compact && <th className="px-6 py-4">Subject</th>}
            <th className="px-6 py-4">Date Submitted</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 border-l border-transparent">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {requests.map((request) => (
            <tr key={request.id} className="hover:bg-gray-50 transition-colors group">
              <td className="px-6 py-4 font-medium text-gray-900">{request.request_number || request.id.substring(0, 8)}</td>
              <td className="px-6 py-4 text-gray-600">{request.request_type}</td>
              {!compact && (
                <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                  {request.subject}
                </td>
              )}
              <td className="px-6 py-4 text-gray-500">{formatDate(request.created_at)}</td>
              <td className="px-6 py-4">{getStatusBadge(request.status)}</td>
              <td className="px-6 py-4">
                <Link
                  href={`/student/requests/${request.id}`}
                  className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-black transition-colors"
                >
                  {compact ? 'View' : <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-black" />}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
