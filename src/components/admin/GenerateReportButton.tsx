'use client'

import * as React from 'react'
import { FileText } from 'lucide-react'
import type { ServiceRequestWithProfile } from '@/types'

interface GenerateReportButtonProps {
  requests: ServiceRequestWithProfile[]
}

export function GenerateReportButton({ requests }: GenerateReportButtonProps) {
  const handleGenerate = () => {
    if (requests.length === 0) return

    // CSV header
    const headers = [
      'Request ID',
      'Student Name',
      'Matric Number',
      'Email',
      'Request Type',
      'Subject',
      'Status',
      'Admin Remark',
      'Assigned To',
      'Date Submitted',
      'Last Updated',
    ]

    // CSV rows
    const rows = requests.map(req => [
      req.request_number || req.id.substring(0, 8),
      req.profiles?.full_name ?? '',
      req.profiles?.matric_number ?? 'N/A',
      req.profiles?.email ?? '',
      req.request_type,
      `"${(req.subject || '').replace(/"/g, '""')}"`,
      req.status,
      `"${(req.admin_remark || '').replace(/"/g, '""')}"`,
      req.assigned_admin?.full_name ?? 'Unassigned',
      new Date(req.created_at).toLocaleDateString('en-US'),
      new Date(req.updated_at).toLocaleDateString('en-US'),
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n')

    // Trigger file download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `caleb-service-requests-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={handleGenerate}
      disabled={requests.length === 0}
      className="inline-flex h-10 items-center justify-center gap-2 rounded bg-caleb-green px-4 text-sm font-medium text-white transition-colors hover:bg-caleb-green-dark disabled:opacity-50"
    >
      <FileText className="h-4 w-4" />
      Generate Report
    </button>
  )
}
