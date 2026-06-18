import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUserWithProfile } from '@/lib/auth'
import { LogoutButton } from '@/components/auth/LogoutButton'

export default async function PendingApprovalPage() {
  const supabase = await createClient()
  const result = await getCurrentUserWithProfile(supabase)

  if (!result) {
    redirect('/login')
  }

  const { profile } = result

  if (profile.role === 'admin' || profile.role === 'super_admin') {
    redirect('/admin/dashboard')
  }

  if (profile.role === 'student') {
    redirect('/student/dashboard')
  }

  return (
    <main className="min-h-screen bg-[#0B1120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>
      
      <div className="max-w-md w-full bg-slate-900/50 backdrop-blur-xl border border-slate-700 p-8 rounded-3xl shadow-2xl relative z-10 text-center space-y-6">
        <div className="w-20 h-20 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto ring-1 ring-amber-500/30 shadow-lg shadow-amber-500/10">
          <svg className="w-10 h-10 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Pending Approval</h1>
          <p className="text-slate-400 text-sm">
            You registered as a staff administrator. Your account is currently pending verification from the Super Admin. You cannot access the dashboard until approved.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-700/50">
          <LogoutButton variant="secondary" className="w-full bg-slate-800 text-white hover:bg-slate-700 border-none">
            Sign Out & Return to Login
          </LogoutButton>
        </div>
      </div>
    </main>
  )
}
