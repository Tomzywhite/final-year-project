import { formatDate } from '@/lib/utils'
import type { RequestActivity } from '@/types'
import { CheckCircle2, Clock, UserCheck, UserMinus, MessageSquare, Inbox, Activity } from 'lucide-react'

interface ActivityTimelineProps {
  activities: RequestActivity[]
  submittedAt: string
}

function getActivityIcon(action: string) {
  const a = action.toLowerCase()
  if (a.includes('claimed')) return <UserCheck className="h-4 w-4" />
  if (a.includes('unclaimed')) return <UserMinus className="h-4 w-4" />
  if (a.includes('remark') || a.includes('comment')) return <MessageSquare className="h-4 w-4" />
  if (a.includes('resolved')) return <CheckCircle2 className="h-4 w-4" />
  if (a.includes('rejected')) return <Inbox className="h-4 w-4" />
  if (a.includes('in progress') || a.includes('in_progress')) return <Clock className="h-4 w-4" />
  return <Activity className="h-4 w-4" />
}

function getActivityColor(action: string) {
  const a = action.toLowerCase()
  if (a.includes('resolved')) return 'bg-emerald-600 text-white'
  if (a.includes('rejected')) return 'bg-red-600 text-white'
  if (a.includes('claimed')) return 'bg-indigo-600 text-white'
  if (a.includes('unclaimed')) return 'bg-gray-400 text-white'
  if (a.includes('in progress') || a.includes('in_progress')) return 'bg-blue-600 text-white'
  return 'bg-gray-500 text-white'
}

export function ActivityTimeline({ activities, submittedAt }: ActivityTimelineProps) {
  const allItems = [
    // Pinned submission event
    {
      id: '__submitted__',
      action: 'Request submitted',
      created_at: submittedAt,
      actor_name: null,
      isPinned: true,
    },
    ...activities.map(a => ({ ...a, isPinned: false })),
  ]

  return (
    <div className="bg-white border border-gray-200 p-8 shadow-sm">
      <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase border-b border-gray-100 pb-4 mb-6">
        Request Timeline
      </h3>
      <div className="space-y-0">
        {allItems.map((item, idx) => {
          const isLast = idx === allItems.length - 1
          const isPinned = 'isPinned' in item && item.isPinned

          return (
            <div key={item.id} className="flex gap-4">
              {/* Icon + connector line */}
              <div className="flex flex-col items-center">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  isPinned
                    ? 'bg-caleb-green text-white'
                    : getActivityColor(item.action)
                }`}>
                  {isPinned
                    ? <CheckCircle2 className="h-4 w-4" />
                    : getActivityIcon(item.action)
                  }
                </div>
                {!isLast && (
                  <div className="h-full w-px bg-gray-200 my-1 min-h-[24px]" />
                )}
              </div>

              {/* Content */}
              <div className={`pb-6 ${isLast ? 'pb-0' : ''} min-w-0`}>
                <p className="text-sm font-medium text-gray-900">{item.action}</p>
                <div className="flex flex-wrap items-center gap-2 mt-0.5">
                  {item.actor_name && (
                    <span className="text-xs text-gray-500">by {item.actor_name}</span>
                  )}
                  <span className="text-xs text-gray-400">{formatDate(item.created_at)}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
