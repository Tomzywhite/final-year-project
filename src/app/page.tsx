import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowRight, UserPlus, FileText, CheckCircle, Shield, Headset } from 'lucide-react'

export default async function HomePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If already authenticated, redirect to their dashboard, otherwise render landing page Let middleware handle the role-based auth redirect
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role === 'admin' || profile?.role === 'super_admin') {
      redirect('/admin/dashboard')
    } else if (profile?.role === 'pending_admin') {
      redirect('/pending-approval')
    } else {
      redirect('/student/dashboard')
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-caleb-bg-light">
      {/* Navbar */}
      <header className="flex h-16 items-center justify-between bg-caleb-green px-6 text-white md:px-12">
        <div className="flex items-center gap-2">
          {/* Mock Logo / Icon */}
          <div className="flex h-8 w-8 items-center justify-center rounded bg-white/10">
            <span className="font-serif text-lg font-bold leading-none">C</span>
          </div>
          <span className="font-semibold tracking-wide">Caleb Student Services</span>
        </div>
        <nav className="hidden items-center gap-8 md:flex text-sm font-medium">
          <Link href="/help" className="hover:text-caleb-gold transition-colors">Support</Link>
          <Link href="/directory" className="hover:text-caleb-gold transition-colors">Directory</Link>
        </nav>
        <div className="flex items-center gap-4">
          {/* Placeholder for notification and help icons */}
          <div className="h-4 w-4 rounded-full bg-white/20"></div>
          <div className="h-4 w-4 rounded-full bg-white/20"></div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center md:py-28">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-600 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
            SERVICE PORTAL LIVE
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 md:text-6xl">
            Caleb Student Service Portal
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600">
            Streamlined academic services for students, faculty, and administrative staff. Submit, track, and manage your university requests within a unified digital environment.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/login"
              className="flex items-center gap-2 rounded bg-caleb-green px-8 py-3 font-medium text-white transition-all hover:bg-caleb-green-dark"
            >
              <ArrowRight className="h-5 w-5" />
              Login
            </Link>
            <Link
              href="/register"
              className="flex items-center gap-2 rounded border border-gray-300 bg-white px-8 py-3 font-medium text-gray-700 transition-all hover:bg-gray-50 hover:text-black"
            >
              <UserPlus className="h-5 w-5" />
              Register
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mx-auto max-w-6xl px-6 pb-24">
          <div className="grid gap-6 md:grid-cols-2">

            <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100/80 text-gray-700">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">Centralized Academic Records</h3>
              <p className="text-gray-600">
                Request official transcripts, enrollment verification, and clearance documents securely. Our integrated system ensures your requests reach the appropriate departments instantly.
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-50 text-yellow-700">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">Real-time Tracking</h3>
              <p className="text-gray-600">
                Monitor the progress of your submissions through every administrative stage. Get notified when your requests are updated or resolved.
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">Secure & Private</h3>
              <p className="text-gray-600">
                Institutional-grade security protocols to protect your sensitive academic data. Access is strictly controlled through your official university credentials.
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                <Headset className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">Administrative Support</h3>
              <p className="text-gray-600">
                Direct communication channels with department coordinators and registry staff to resolve complex inquiries swiftly.
              </p>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8 text-sm text-gray-500">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between px-6 md:flex-row">
          <p>© 2026 CALEB SERVICE REQUEST SYSTEM. All rights reserved.</p>
          <div className="mt-4 flex items-center gap-6 md:mt-0">
            <Link href="/privacy" className="hover:text-gray-800 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-800 transition-colors">Terms of Service</Link>
            <Link href="/help" className="hover:text-gray-800 transition-colors">Help Center</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
