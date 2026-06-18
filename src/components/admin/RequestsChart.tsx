'use client'

import * as React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from 'recharts'
import type { ServiceRequestWithProfile } from '@/types'

interface RequestsChartProps {
  requests: ServiceRequestWithProfile[]
}

// ─── Colour palette ───────────────────────────────────────────────────────────

const STATUS_COLOURS: Record<string, string> = {
  pending: '#FBBF24',      // amber
  in_progress: '#6366F1',  // indigo
  resolved: '#10B981',     // emerald (caleb-green family)
  rejected: '#F87171',     // rose
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  rejected: 'Rejected',
}

const TYPE_COLOUR = '#1A5C38' // caleb-green

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg text-xs">
      <p className="font-semibold text-gray-800 mb-1">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.name} style={{ color: entry.fill ?? entry.color }}>
          {entry.name}: <span className="font-bold">{entry.value}</span>
        </p>
      ))}
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export function RequestsChart({ requests }: RequestsChartProps) {
  // Status breakdown
  const statusData = React.useMemo(() => {
    const counts: Record<string, number> = { pending: 0, in_progress: 0, resolved: 0, rejected: 0 }
    requests.forEach(r => { if (r.status in counts) counts[r.status]++ })
    return Object.entries(counts).map(([status, count]) => ({
      name: STATUS_LABELS[status] ?? status,
      value: count,
      status,
    }))
  }, [requests])

  // Request type breakdown (top 8)
  const typeData = React.useMemo(() => {
    const counts: Record<string, number> = {}
    requests.forEach(r => {
      counts[r.request_type] = (counts[r.request_type] ?? 0) + 1
    })
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([type, count]) => ({
        name: type.length > 22 ? type.slice(0, 20) + '…' : type,
        fullName: type,
        count,
      }))
  }, [requests])

  const total = requests.length

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* ── Status Breakdown ── */}
      <div className="bg-white border border-gray-200 shadow-sm">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="text-sm font-semibold text-gray-900">Requests by Status</h2>
          <p className="text-xs text-gray-400 mt-0.5">{total} total requests</p>
        </div>
        <div className="px-6 py-6">
          {/* Mini stat pills */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            {statusData.map(d => (
              <div
                key={d.status}
                className="flex items-center justify-between rounded px-3 py-2"
                style={{ backgroundColor: STATUS_COLOURS[d.status] + '18' }}
              >
                <span className="text-xs font-medium text-gray-600">{d.name}</span>
                <span
                  className="text-sm font-bold"
                  style={{ color: STATUS_COLOURS[d.status] }}
                >
                  {d.value}
                </span>
              </div>
            ))}
          </div>

          {/* Pie chart */}
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                nameKey="name"
              >
                {statusData.map(d => (
                  <Cell key={d.status} fill={STATUS_COLOURS[d.status]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span className="text-xs text-gray-600">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Request Type Breakdown ── */}
      <div className="bg-white border border-gray-200 shadow-sm">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="text-sm font-semibold text-gray-900">Requests by Type</h2>
          <p className="text-xs text-gray-400 mt-0.5">Top {typeData.length} categories</p>
        </div>
        <div className="px-2 py-6">
          {typeData.length === 0 ? (
            <div className="flex h-48 items-center justify-center text-sm text-gray-400">
              No data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={typeData}
                layout="vertical"
                margin={{ top: 0, right: 24, bottom: 0, left: 8 }}
                barCategoryGap="30%"
              >
                <XAxis
                  type="number"
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: '#9CA3AF' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={110}
                  tick={{ fontSize: 11, fill: '#6B7280' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null
                    const d = payload[0].payload
                    return (
                      <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg text-xs">
                        <p className="font-semibold text-gray-800 mb-0.5">{d.fullName}</p>
                        <p className="text-caleb-green font-bold">{d.count} request{d.count !== 1 ? 's' : ''}</p>
                      </div>
                    )
                  }}
                />
                <Bar dataKey="count" name="Requests" radius={[0, 4, 4, 0]} fill={TYPE_COLOUR} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}
