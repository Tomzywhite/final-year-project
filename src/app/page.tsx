import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowRight, UserPlus, FileText, Shield, Headset, GraduationCap, ClipboardCheck, Sparkles } from 'lucide-react'

export default async function HomePage() {
  const supabase = await createClient()

  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data?.user
  } catch (error) {
    console.error('Failed to get session on landing page:', error)
  }

  // If already authenticated, redirect to their dashboard. Let proxy handle the role-based auth redirect.
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
    <div className="flex min-h-screen flex-col bg-[#f8fafc] font-sans selection:bg-caleb-gold selection:text-caleb-green-dark">
      
      {/* Sticky Header with Glassmorphism */}
      <header className="sticky top-0 z-50 w-full bg-white/75 backdrop-blur-md border-b border-slate-200/50 px-6 py-4 transition-all duration-300 md:px-12">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-caleb-green to-caleb-green-light shadow-md transition-all group-hover:scale-110">
              <GraduationCap className="h-6 w-6 text-caleb-gold" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-800 tracking-wide text-sm md:text-base leading-none">CALEB UNIVERSITY</span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5">Student Service Portal</span>
            </div>
          </div>
          
          <nav className="hidden items-center gap-8 md:flex text-sm font-semibold text-slate-600">
            <Link href="/help" className="relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-caleb-gold after:transition-all hover:after:w-full hover:text-caleb-green transition-colors">Support</Link>
            <Link href="/directory" className="relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-caleb-gold after:transition-all hover:after:w-full hover:text-caleb-green transition-colors">Directory</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs md:text-sm font-bold text-slate-700 hover:text-caleb-green px-4 py-2 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-xs md:text-sm font-bold bg-caleb-green text-white hover:bg-caleb-green-dark px-5 py-2 rounded-lg shadow-sm hover:shadow-md transition-all hover:scale-102"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section with Dark Ambient Mesh Gradient */}
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-b from-caleb-green-dark via-caleb-green to-emerald-950 py-24 px-6 text-white md:py-36">
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:32px_32px]"></div>
          
          {/* Ambient Glowing Orbs */}
          <div className="absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-caleb-gold/15 blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 right-1/4 h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-3xl"></div>

          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-caleb-gold tracking-wide backdrop-blur-sm animate-fade-in shadow-inner">
              <Sparkles className="h-3 w-3 animate-spin duration-[4000ms]" />
              EXCELLENCE & SERVICE • PORTAL IS ACTIVE
            </div>
            
            <h1 className="mb-8 text-4xl font-extrabold tracking-tight md:text-6xl text-white">
              Caleb Student <br className="md:hidden" />
              <span className="text-gradient-gold font-serif italic">Service Portal</span>
            </h1>
            
            <p className="mx-auto mb-12 max-w-2xl text-base md:text-lg text-emerald-100/80 leading-relaxed font-normal">
              A refined digital hub enabling Caleb University students, faculty, and administrators to submit, review, and track service requests with speed, clarity, and precision.
            </p>
            
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row animate-slide-up">
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 w-full sm:w-auto rounded-xl bg-caleb-gold text-caleb-green-dark px-8 py-4 font-bold transition-all hover:bg-caleb-gold-hover hover:-translate-y-0.5 shadow-lg shadow-caleb-gold/20 hover:shadow-caleb-gold/30 hover:animate-pulse-gold"
              >
                Access Portal
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/register"
                className="flex items-center justify-center gap-2 w-full sm:w-auto rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 px-8 py-4 font-bold text-white transition-all hover:-translate-y-0.5 backdrop-blur-sm hover:border-white/40"
              >
                <UserPlus className="h-4 w-4 text-caleb-gold" />
                Register Account
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Strip */}
        <section className="relative z-20 -mt-8 mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-1 divide-y divide-slate-100 bg-white shadow-xl shadow-slate-200/50 rounded-2xl md:grid-cols-3 md:divide-y-0 md:divide-x border border-slate-150">
            <div className="p-8 text-center">
              <span className="block text-3xl font-extrabold text-slate-800">10,000+</span>
              <span className="text-xs font-bold text-slate-400 tracking-wider uppercase mt-1 block">Requests Processed</span>
            </div>
            <div className="p-8 text-center">
              <span className="block text-3xl font-extrabold text-slate-800">3-5 Days</span>
              <span className="text-xs font-bold text-slate-400 tracking-wider uppercase mt-1 block">Average Response Time</span>
            </div>
            <div className="p-8 text-center">
              <span className="block text-3xl font-extrabold text-slate-800">99.8%</span>
              <span className="text-xs font-bold text-slate-400 tracking-wider uppercase mt-1 block">Resolution Rate</span>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 md:text-4xl tracking-tight">University Registry Services</h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-500 text-sm md:text-base">
              Secure, digital request channels minimizing physical queues and administrative delays.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:gap-10">
            
            {/* Card 1 */}
            <div className="group relative rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-slate-200 hover:-translate-y-1">
              <div className="absolute top-0 left-0 h-1.5 w-full bg-caleb-green rounded-t-2xl transition-all group-hover:bg-caleb-gold"></div>
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-700 transition-all group-hover:bg-caleb-green group-hover:text-white shadow-sm border border-slate-100">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="mb-3 text-lg font-bold text-slate-800 group-hover:text-caleb-green transition-colors">Centralized Academic Records</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Request official academic transcripts, enrollment verification files, and clearance certificates securely. Your requests are automatically routed to the right administrative desks.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group relative rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-slate-200 hover:-translate-y-1">
              <div className="absolute top-0 left-0 h-1.5 w-full bg-caleb-green rounded-t-2xl transition-all group-hover:bg-caleb-gold"></div>
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-700 transition-all group-hover:bg-caleb-green group-hover:text-white shadow-sm border border-slate-100">
                <ClipboardCheck className="h-5 w-5" />
              </div>
              <h3 className="mb-3 text-lg font-bold text-slate-800 group-hover:text-caleb-green transition-colors">Real-Time Status Auditing</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Stay updated on the verification status of your file at every department node. Receive immediate notification alerts when queries are raised or resolutions are issued.
              </p>
            </div>

            {/* Card 3 */}
            <div className="group relative rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-slate-200 hover:-translate-y-1">
              <div className="absolute top-0 left-0 h-1.5 w-full bg-caleb-green rounded-t-2xl transition-all group-hover:bg-caleb-gold"></div>
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-700 transition-all group-hover:bg-caleb-green group-hover:text-white shadow-sm border border-slate-100">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="mb-3 text-lg font-bold text-slate-800 group-hover:text-caleb-green transition-colors">Secure Authentication Guards</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Protect sensitive personal and educational credentials. The platform uses multi-tenant security layers to restrict document downloads only to verified staff and students.
              </p>
            </div>

            {/* Card 4 */}
            <div className="group relative rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-slate-200 hover:-translate-y-1">
              <div className="absolute top-0 left-0 h-1.5 w-full bg-caleb-green rounded-t-2xl transition-all group-hover:bg-caleb-gold"></div>
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-700 transition-all group-hover:bg-caleb-green group-hover:text-white shadow-sm border border-slate-100">
                <Headset className="h-5 w-5" />
              </div>
              <h3 className="mb-3 text-lg font-bold text-slate-800 group-hover:text-caleb-green transition-colors">Direct Desk Messaging</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Communicate directly with specific registry reviewers via custom request chat logs. Clear payment validation holds or document quality questions within hours.
              </p>
            </div>

          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 text-sm text-slate-500">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between px-6 md:flex-row">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-caleb-green text-white">
              <span className="font-serif text-xs font-bold leading-none">C</span>
            </div>
            <span className="font-semibold text-slate-700">Caleb University Student Portal</span>
          </div>
          <p className="text-center md:text-left text-xs text-slate-400">© 2026 CALEB SERVICE REQUEST SYSTEM. All rights reserved.</p>
          <div className="mt-4 flex items-center gap-6 md:mt-0 font-medium">
            <Link href="/privacy" className="hover:text-caleb-green transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-caleb-green transition-colors">Terms of Service</Link>
            <Link href="/help" className="hover:text-caleb-green transition-colors">Help Center</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
