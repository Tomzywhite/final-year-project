import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUserWithProfile } from '@/lib/auth'
import { getNotifications } from '@/lib/notifications'
import { AdminSidebar } from '@/components/layout/AdminSidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const result = await getCurrentUserWithProfile(supabase)

  if (!result) {
    redirect('/login')
  }

  const { userId, profile } = result

  if (profile.role !== 'admin' && profile.role !== 'super_admin') {
    redirect('/unauthorized')
  }

  const notifications = await getNotifications(userId)

  return (
    <div className="flex h-screen flex-col md:flex-row overflow-hidden bg-caleb-bg-light">
      <AdminSidebar role={profile.role} userId={userId} initialNotifications={notifications} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
