import type { Metadata } from 'next'
import LoginForm from '@/components/auth/LoginForm'
import Link from 'next/link'
import { GraduationCap, ArrowLeft, CheckCircle2, ShieldCheck, HeartHandshake } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Login | Caleb Student Services',
  description: 'Sign in to the Caleb University Student Service Portal',
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-slate-50 font-sans overflow-hidden">
      
      {/* Left Banner Side - Desktop Only */}
      <div className="relative hidden md:flex md:w-1/2 lg:w-3/5 bg-gradient-to-br from-caleb-green-dark via-caleb-green to-caleb-green-light p-12 lg:p-20 text-white flex-col justify-between overflow-hidden">
        {/* Decorative Grid and Glowing Orbs */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-caleb-gold/20 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-emerald-500/15 blur-3xl"></div>

        {/* Top Branding Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-md border border-white/20 shadow-md">
            <GraduationCap className="h-6 w-6 text-caleb-gold" />
          </div>
          <div>
            <h2 className="font-bold tracking-wide text-lg leading-none">CALEB UNIVERSITY</h2>
            <span className="text-2xs text-white/60 tracking-widest uppercase">Student Services Portal</span>
          </div>
        </div>

        {/* Center Banner Messaging */}
        <div className="relative z-10 my-auto max-w-lg space-y-8 animate-fade-in">
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Your Gateway to <br />
              <span className="text-caleb-gold bg-clip-text">Seamless Services</span>
            </h1>
            <p className="text-base lg:text-lg text-white/80 leading-relaxed">
              Submit, review, and track transcript requests, registry clearances, and student files within a unified, modern workspace.
            </p>
          </div>

          {/* Core Portal Highlights */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-start gap-3.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-caleb-gold/20 text-caleb-gold shrink-0 mt-0.5">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-semibold text-sm lg:text-base text-white">Centralized Academic Requests</h4>
                <p className="text-xs lg:text-sm text-white/70">Request transcripts and clearances securely from any location.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-caleb-gold/20 text-caleb-gold shrink-0 mt-0.5">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-semibold text-sm lg:text-base text-white">Secure Identity Guards</h4>
                <p className="text-xs lg:text-sm text-white/70">Institutional-grade encryption ensures personal details stay private.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-caleb-gold/20 text-caleb-gold shrink-0 mt-0.5">
                <HeartHandshake className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-semibold text-sm lg:text-base text-white">Direct Advisory Support</h4>
                <p className="text-xs lg:text-sm text-white/70">Get instant feedback updates and messages from registry reviews.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="relative z-10 text-xs text-white/40 flex items-center justify-between">
          <span>© 2026 Caleb University Registry</span>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>

      {/* Right Form Side */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16 bg-white relative">
        
        {/* Navigation Arrow Left - Back to Home */}
        <div className="absolute top-8 left-6 md:left-12 lg:left-16">
          <Link
            href="/"
            className="group flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-caleb-green transition-colors border border-gray-150 rounded-full px-3 py-1.5 bg-slate-50 hover:bg-slate-100"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to Home
          </Link>
        </div>

        {/* Centered Login Card */}
        <div className="mx-auto w-full max-w-[400px] mt-10 md:mt-0">
          <div className="flex flex-col items-center mb-8 text-center md:items-start md:text-left">
            
            {/* Logo Display on Mobile */}
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-caleb-green text-white md:hidden shadow-md">
              <GraduationCap className="h-7 w-7 text-caleb-gold" />
            </div>

            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-gray-900">
              Welcome back
            </h1>
            <p className="text-sm text-gray-500 mt-1.5">
              Sign in to manage your university service requests
            </p>
          </div>

          <LoginForm />
        </div>
      </div>

    </main>
  )
}
