import { createClient } from '@/lib/supabase/server'
import { getCurrentUserWithProfile } from '@/lib/auth'
import { ProfileDetails } from '@/components/settings/ProfileDetails'

export default async function AdminSettingsPage() {
  const supabase = await createClient()
  const result = await getCurrentUserWithProfile(supabase)
  
  if (!result) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Profile Settings</h1>
        <p className="mt-1 text-gray-600">View and manage your administrator identity and system credentials.</p>
      </div>

      <ProfileDetails profile={result.profile} />
    </div>
  )
}
