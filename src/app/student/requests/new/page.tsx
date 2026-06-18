import { createClient } from '@/lib/supabase/server'
import { getCurrentUserWithProfile } from '@/lib/auth'
import { NewRequestForm } from '@/components/student/NewRequestForm'

export default async function NewRequestPage() {
  const supabase = await createClient()
  const result = await getCurrentUserWithProfile(supabase)
  if (!result) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Submit Request</h1>
        <p className="mt-1 text-gray-600">Please fill out the form below to submit a new service request.</p>
      </div>

      <NewRequestForm studentId={result.userId} />
    </div>
  )
}
