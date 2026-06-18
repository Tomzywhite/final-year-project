import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'
import type { ServiceRequest } from '@/types'

export function RequestCard({ request }: { request: ServiceRequest }) {
  return (
    <Link href={`/student/requests/${request.id}`} className="block w-full">
      <Card className="p-5 transition-colors hover:bg-slate-50">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-[#003B5C]">
                {request.request_number}
              </span>
              <Badge status={request.status} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 line-clamp-1">
              {request.subject}
            </h3>
            <p className="text-sm text-slate-500">
              {request.request_type} • {formatDate(request.created_at)}
            </p>
          </div>
          <div className="text-sm text-blue-600 font-medium whitespace-nowrap">
            View Details &rarr;
          </div>
        </div>
      </Card>
    </Link>
  )
}
