'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import { updateUserRole } from '@/lib/requests'

export function StaffActionButtons({ userId }: { userId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleAction(action: 'approve' | 'reject') {
    setLoading(true)
    setError(null)
    
    // Accept them as admin, or push them back to student status.
    // If you want to outright delete, you'd need the edge function, but downgrading is safer.
    const newRole = action === 'approve' ? 'admin' : 'student'
    
    const success = await updateUserRole(userId, newRole)
    if (!success) {
      setError(`Failed to ${action}.`)
      setLoading(false)
      return
    }

    router.refresh()
  }

  if (error) {
    return <span className="text-xs text-red-600 mr-2">{error}</span>
  }

  return (
    <div className="flex justify-end gap-2">
      <Button 
        variant="secondary" 
        className="px-3 h-8 text-xs bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
        onClick={() => handleAction('reject')}
        disabled={loading}
      >
        Reject
      </Button>
      <Button 
        variant="primary" 
        className="px-3 h-8 text-xs border border-green-600 bg-green-600 hover:bg-green-700"
        onClick={() => handleAction('approve')}
        loading={loading}
      >
        Approve
      </Button>
    </div>
  )
}
