import type { RequestStats } from '@/types'
import { Folder, Clock, RefreshCcw, CheckCircle2 } from 'lucide-react'

export function StatsRow({ stats }: { stats: RequestStats }) {
  const statItems = [
    { 
      label: 'Total Requests', 
      value: stats.total, 
      icon: <Folder className="h-5 w-5 text-emerald-600" />,
      iconBg: 'bg-emerald-50 border-emerald-100 text-emerald-600',
      accentBar: 'bg-emerald-500'
    },
    { 
      label: 'Pending Review', 
      value: stats.pending, 
      icon: <Clock className="h-5 w-5 text-amber-600 animate-pulse" />,
      iconBg: 'bg-amber-50 border-amber-100 text-amber-600',
      accentBar: 'bg-amber-500'
    },
    { 
      label: 'In Progress', 
      value: stats.in_progress, 
      icon: <RefreshCcw className="h-5 w-5 text-blue-600" />,
      iconBg: 'bg-blue-50 border-blue-100 text-blue-600',
      accentBar: 'bg-blue-500'
    },
    { 
      label: 'Resolved Requests', 
      value: stats.resolved, 
      icon: <CheckCircle2 className="h-5 w-5 text-caleb-gold" />,
      iconBg: 'bg-emerald-50/70 border-emerald-100/50 text-caleb-green-light',
      accentBar: 'bg-caleb-gold'
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item) => (
        <div 
          key={item.label} 
          className="relative overflow-hidden flex flex-col bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group cursor-default"
        >
          {/* Left vertical accent indicator */}
          <div className={`absolute top-0 left-0 h-full w-[4px] ${item.accentBar}`}></div>
          
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">{item.label}</h3>
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-300 group-hover:scale-110 ${item.iconBg}`}>
              {item.icon}
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-800 tracking-tight leading-none">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  )
}
