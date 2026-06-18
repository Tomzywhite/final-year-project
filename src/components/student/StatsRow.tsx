import type { RequestStats } from '@/types'
import { Folder, Clock, RefreshCcw, CheckCircle2 } from 'lucide-react'

export function StatsRow({ stats }: { stats: RequestStats }) {
  const statItems = [
    { 
      label: 'TOTAL REQUESTS', 
      value: stats.total, 
      icon: <Folder className="h-4 w-4 text-emerald-800" />,
      iconBg: 'bg-emerald-100'
    },
    { 
      label: 'PENDING', 
      value: stats.pending, 
      icon: <Clock className="h-4 w-4 text-yellow-800" />,
      iconBg: 'bg-yellow-100'
    },
    { 
      label: 'IN PROGRESS', 
      value: stats.in_progress, 
      icon: <RefreshCcw className="h-4 w-4 text-blue-800" />,
      iconBg: 'bg-blue-100'
    },
    { 
      label: 'RESOLVED', 
      value: stats.resolved, 
      icon: <CheckCircle2 className="h-4 w-4 text-gray-800" />,
      iconBg: 'bg-gray-200'
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item) => (
        <div key={item.label} className="flex flex-col bg-white border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase">{item.label}</h3>
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${item.iconBg}`}>
              {item.icon}
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 leading-none">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  )
}
