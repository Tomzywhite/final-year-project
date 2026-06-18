import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUserWithProfile } from '@/lib/auth'
import { getPendingAdmins } from '@/lib/requests'
import { EmptyState } from '@/components/ui/EmptyState'
import { Card } from '@/components/ui/Card'
import { formatDate } from '@/lib/utils'
import { StaffActionButtons } from '@/components/admin/StaffActionButtons'
import { InviteStaffForm } from '@/components/admin/InviteStaffForm'

export default async function StaffManagementPage() {
  const supabase = await createClient()
  const result = await getCurrentUserWithProfile(supabase)

  if (!result || result.profile.role !== 'super_admin') {
    redirect('/unauthorized')
  }

  const pendingAdmins = await getPendingAdmins()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Staff Management</h1>
        <p className="text-slate-500">
          Invite staff by email or approve self-registered admin accounts.
        </p>
      </div>

      {/* ── Invite Staff ─────────────────────────────────────────────────────── */}
      <InviteStaffForm />

      {/* ── Pending Registrations ────────────────────────────────────────────── */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold text-slate-800">Pending Registrations</h2>
        <Card className="overflow-hidden">
          {pendingAdmins.length === 0 ? (
            <EmptyState message="There are no pending staff registrations." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs uppercase text-slate-700">
                  <tr>
                    <th scope="col" className="px-6 py-4 font-medium">Full Name</th>
                    <th scope="col" className="px-6 py-4 font-medium">Email Address</th>
                    <th scope="col" className="px-6 py-4 font-medium">Registration Date</th>
                    <th scope="col" className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pendingAdmins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {admin.full_name}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        <a href={`mailto:${admin.email}`} className="text-blue-600 hover:underline">
                          {admin.email}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatDate(admin.created_at)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <StaffActionButtons userId={admin.id} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
