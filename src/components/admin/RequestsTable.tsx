import Link from 'next/link'
import { EmptyState } from '@/components/ui/EmptyState'
import type { ServiceRequestWithProfile } from '@/types'
import { ChevronRight } from 'lucide-react'

export function RequestsTable({ requests, compact = false }: { requests: ServiceRequestWithProfile[], compact?: boolean }) {
  if (requests.length === 0) {
    return <EmptyState message="No requests found matching the current filters." />
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center rounded-full bg-[#fde68a] px-2.5 py-0.5 text-xs font-semibold text-[#854d0e] uppercase tracking-wider">Pending</span>
      case 'in_progress':
        return <span className="inline-flex items-center rounded-full bg-[#e0e7ff] px-2.5 py-0.5 text-xs font-semibold text-[#3730a3] uppercase tracking-wider">In Progress</span>
      case 'resolved':
        return <span className="inline-flex items-center rounded-full bg-[#a7f3d0] px-2.5 py-0.5 text-xs font-semibold text-[#065f46] uppercase tracking-wider">Resolved</span>
      case 'rejected':
        return <span className="inline-flex items-center rounded-full bg-[#fecaca] px-2.5 py-0.5 text-xs font-semibold text-[#991b1b] uppercase tracking-wider">Rejected</span>
      default:
        return <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-800 uppercase tracking-wider">{status}</span>
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
            <th className="px-6 py-4">Student</th>
            <th className="px-6 py-4">{compact ? 'Type' : 'Request Type'}</th>
            {!compact && <th className="px-6 py-4">Subject</th>}
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4">Status</th>
            {!compact && <th className="px-6 py-4">Assigned To</th>}
            <th className="px-6 py-4 border-l border-transparent">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {requests.map((req) => (
            <tr key={req.id} className="hover:bg-gray-50 transition-colors group">
              <td className="px-6 py-4 font-medium text-gray-900">
                {req.request_number || req.id.substring(0, 8)}
              </td>
              <td className="px-6 py-4">
                <div className="font-medium text-gray-900">{req.profiles?.full_name}</div>
                {!compact && <div className="text-gray-500 text-xs mt-0.5">{req.profiles?.matric_number}</div>}
              </td>
              <td className="px-6 py-4 text-gray-600">
                {req.request_type}
              </td>
              {!compact && (
                <td className="px-6 py-4 text-gray-600 max-w-[200px] truncate" title={req.subject}>
                  {req.subject}
                </td>
              )}
              <td className="px-6 py-4 text-gray-500">
                {formatDate(req.created_at)}
              </td>
              <td className="px-6 py-4">
                {getStatusBadge(req.status)}
              </td>
              {!compact && (
                <td className="px-6 py-4 text-gray-600 text-sm">
                  {req.assigned_admin?.full_name ?? <span className="text-gray-300 italic">Unassigned</span>}
                </td>
              )}
              <td className="px-6 py-4">
                <Link 
                  href={`/admin/requests/${req.id}`}
                  className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-black transition-colors"
                >
                  {compact ? 'Review' : <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-black" />}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
