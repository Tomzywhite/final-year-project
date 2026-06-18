'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { REQUEST_STATUSES, REQUEST_TYPES, STATUS_LABELS } from '@/lib/constants'
import { Search, Filter } from 'lucide-react'

export function FilterBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentStatus = searchParams.get('status') || 'all'
  const currentType = searchParams.get('type') || 'all'

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value === 'all') {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  const statusOptions = [
    { label: 'All Statuses', value: 'all' },
    ...REQUEST_STATUSES.map(s => ({ label: STATUS_LABELS[s], value: s }))
  ]

  const typeOptions = [
    { label: 'All Types', value: 'all' },
    ...REQUEST_TYPES.map(t => ({ label: t, value: t }))
  ]

  return (
    <div className="flex flex-col gap-4 border border-gray-200 bg-white p-4 md:flex-row md:items-end shadow-sm">
      <div className="flex-1 space-y-1">
        <label className="text-xs font-semibold text-gray-500 tracking-wider uppercase">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by ID or Name" 
            className="w-full rounded border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-caleb-green focus:outline-none focus:ring-1 focus:ring-caleb-green"
          />
        </div>
      </div>
      
      <div className="w-full md:w-48 space-y-1">
        <label className="text-xs font-semibold text-gray-500 tracking-wider uppercase">Status</label>
        <select
          value={currentStatus}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="w-full rounded border border-gray-300 bg-white py-2 px-3 text-sm focus:border-caleb-green focus:outline-none focus:ring-1 focus:ring-caleb-green"
        >
          {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>

      <div className="w-full md:w-48 space-y-1">
        <label className="text-xs font-semibold text-gray-500 tracking-wider uppercase">Type</label>
        <select
          value={currentType}
          onChange={(e) => handleFilterChange('type', e.target.value)}
          className="w-full rounded border border-gray-300 bg-white py-2 px-3 text-sm focus:border-caleb-green focus:outline-none focus:ring-1 focus:ring-caleb-green"
        >
          {typeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>

      <button className="flex h-[38px] w-full items-center justify-center gap-2 rounded bg-caleb-green px-6 text-sm font-medium text-white transition-colors hover:bg-caleb-green-dark md:w-auto">
        <Filter className="h-4 w-4" />
        Filter
      </button>
    </div>
  )
}
