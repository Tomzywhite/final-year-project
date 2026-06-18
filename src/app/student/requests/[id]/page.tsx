import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUserWithProfile } from '@/lib/auth'
import { getRequestById, getSignedAttachmentUrl } from '@/lib/requests'
import { getRequestActivity } from '@/lib/activity'
import { ActivityTimeline } from '@/components/ui/ActivityTimeline'
import { MessageSquare, Paperclip } from 'lucide-react'

interface SingleRequestPageProps {
  params: Promise<{ id: string }>
}

export default async function SingleRequestPage(props: SingleRequestPageProps) {
  const params = await props.params
  const supabase = await createClient()
  const result = await getCurrentUserWithProfile(supabase)
  if (!result) return null

  const request = await getRequestById(params.id)

  if (!request || request.student_id !== result.userId) {
    notFound()
  }

  const [activity, attachmentUrl] = await Promise.all([
    getRequestActivity(params.id),
    request.attachment_url ? getSignedAttachmentUrl(request.attachment_url) : Promise.resolve(null),
  ])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center rounded-full bg-[#fde68a] px-3 py-1 text-xs font-semibold text-[#854d0e] uppercase tracking-wider">Pending</span>
      case 'in_progress':
        return <span className="inline-flex items-center rounded-full bg-[#e0e7ff] px-3 py-1 text-xs font-semibold text-[#3730a3] uppercase tracking-wider">In Progress</span>
      case 'resolved':
        return <span className="inline-flex items-center rounded-full bg-[#a7f3d0] px-3 py-1 text-xs font-semibold text-[#065f46] uppercase tracking-wider">Resolved</span>
      case 'rejected':
        return <span className="inline-flex items-center rounded-full bg-[#fecaca] px-3 py-1 text-xs font-semibold text-[#991b1b] uppercase tracking-wider">Rejected</span>
      default:
        return <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-800 uppercase tracking-wider">{status}</span>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <Link href="/student/requests" className="text-sm font-medium text-gray-500 hover:text-black transition-colors flex items-center gap-1">
          &larr; Back to Requests
        </Link>
      </div>
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {request.subject}
          </h1>
          <p className="mt-1 text-gray-500">
            Request ID: <span className="font-mono text-gray-800 bg-gray-100 px-1 py-0.5 rounded">{request.request_number || request.id.substring(0, 8)}</span>
          </p>
        </div>
        <div className="mt-2 sm:mt-0">
          {getStatusBadge(request.status)}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 p-8 shadow-sm">
            <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase border-b border-gray-100 pb-4 mb-4">Request Description</h3>
            <div className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">
              {request.description}
            </div>
          </div>

          <ActivityTimeline activities={activity} submittedAt={request.created_at} />
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-200 p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase">Details</h3>
            
            <div className="space-y-4 pt-2">
              <div>
                <p className="text-xs text-gray-500 mb-1">Type</p>
                <p className="text-sm font-medium text-gray-900">{request.request_type}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Date Submitted</p>
                <p className="text-sm font-medium text-gray-900">{formatDate(request.created_at)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Last Updated</p>
                <p className="text-sm font-medium text-gray-900">{formatDate(request.updated_at)}</p>
              </div>
            </div>
          </div>

          {attachmentUrl && (
            <div className="bg-white border border-gray-200 p-6 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <Paperclip className="h-4 w-4 text-gray-500" />
                <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase">Attachment</h3>
              </div>
              <a
                href={attachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium text-caleb-green hover:underline"
              >
                <Paperclip className="h-4 w-4" />
                View / Download Document
              </a>
            </div>
          )}

          {(request.admin_remark) && (
            <div className="bg-blue-50 border border-blue-200 p-6 shadow-sm rounded">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="h-4 w-4 text-blue-600" />
                <h3 className="text-xs font-semibold tracking-wider text-blue-800 uppercase">Admin Remark</h3>
              </div>
              <div className="text-sm text-blue-900 whitespace-pre-wrap leading-relaxed">
                {request.admin_remark}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
