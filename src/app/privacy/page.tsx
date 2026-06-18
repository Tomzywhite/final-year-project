import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { GraduationCap, ArrowLeft, Shield, Lock, Eye, Clock, Database, HelpCircle } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy | Caleb Student Services',
  description: 'Privacy Policy for the Caleb University Student Service Portal',
}

export default async function PrivacyPage() {
  const supabase = await createClient()

  let user = null
  let dashboardUrl = '/'
  try {
    const { data } = await supabase.auth.getUser()
    user = data?.user
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role === 'admin' || profile?.role === 'super_admin') {
        dashboardUrl = '/admin/dashboard'
      } else if (profile?.role === 'pending_admin') {
        dashboardUrl = '/pending-approval'
      } else {
        dashboardUrl = '/student/dashboard'
      }
    }
  } catch (error) {
    console.error('Failed to get session in privacy page:', error)
  }

  const sections = [
    { id: 'introduction', label: 'Introduction' },
    { id: 'collection', label: '1. Information We Collect' },
    { id: 'usage', label: '2. How We Use Information' },
    { id: 'protection', label: '3. Data Security & Storage' },
    { id: 'sharing', label: '4. Sharing & Disclosure' },
    { id: 'retention', label: '5. Data Retention' },
    { id: 'rights', label: '6. Your Rights & Choices' },
    { id: 'changes', label: '7. Policy Changes' },
    { id: 'contact', label: '8. Contact Information' },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans">
      {/* Dynamic Header */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-gray-100 bg-white px-6 shadow-sm md:px-12">
        <div className="flex items-center gap-2">
          <Link href={dashboardUrl} className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-caleb-green text-white">
              <span className="font-serif text-lg font-bold leading-none">C</span>
            </div>
            <span className="font-semibold tracking-wide text-gray-900">Caleb Student Services</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href={dashboardUrl}
            className="flex items-center gap-1.5 text-sm font-medium text-caleb-green-light hover:text-caleb-green transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {user ? 'Back to Dashboard' : 'Back to Home'}
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-6 py-12 md:flex-row md:px-12">
        {/* Sticky Sidebar Navigation */}
        <aside className="md:sticky md:top-24 hidden h-fit w-64 flex-shrink-0 md:block">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-400">On this page</h3>
            <nav className="space-y-2.5">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block text-sm text-gray-600 hover:text-caleb-green transition-colors border-l-2 border-transparent hover:border-caleb-gold pl-3 py-0.5"
                >
                  {section.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Legal Text Content */}
        <main className="flex-1 rounded-xl border border-gray-200 bg-white p-8 shadow-sm md:p-10">
          <div className="mb-8 border-b border-gray-100 pb-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
              <Shield className="h-3.5 w-3.5" />
              Effective June 11, 2026
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">Privacy Policy</h1>
            <p className="mt-3 text-gray-500">
              This Privacy Policy explains how the Caleb Student Service Request Portal collects, uses, and safeguards your information when you access or submit requests on our platform.
            </p>
          </div>

          <div className="prose prose-slate max-w-none space-y-8 text-gray-600">
            {/* Introduction */}
            <section id="introduction" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900">Introduction</h2>
              <p>
                At Caleb University, we are committed to protecting the privacy and security of our student body and administrative staff. This Portal is designed to facilitate university-related service requests. We handle your personal and academic data in strict accordance with national data protection laws, including the Nigeria Data Protection Act (NDPA), as well as internal university regulations.
              </p>
            </section>

            {/* Section 1 */}
            <section id="collection" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                <Database className="h-5 w-5 text-caleb-gold" />
                <h2 className="text-xl font-bold text-gray-900">1. Information We Collect</h2>
              </div>
              <p>
                To process your requests, we collect personal and academic data directly from you or retrieve it from your institutional records. This includes:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-gray-800">Account Credentials:</strong> Full name, official university email address, matriculation number, department, study level, and account passwords.
                </li>
                <li>
                  <strong className="text-gray-800">Request Data:</strong> Documents uploaded to process requests (such as receipt scans, certificates, clearance forms, or academic records) and explanation messages submitted alongside requests.
                </li>
                <li>
                  <strong className="text-gray-800">Usage Data:</strong> Access logs, device info, browser type, and timestamps of actions taken on the Portal (submitting requests, login attempts, updates).
                </li>
              </ul>
            </section>

            {/* Section 2 */}
            <section id="usage" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                <Eye className="h-5 w-5 text-caleb-gold" />
                <h2 className="text-xl font-bold text-gray-900">2. How We Use Information</h2>
              </div>
              <p>
                We use the data we collect solely to facilitate and manage administrative university processes, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Verifying your student status and eligibility for requested services.</li>
                <li>Processing, tracking, and communicating the status of academic or administrative requests.</li>
                <li>Sending system-generated email notifications when requests are updated or resolved.</li>
                <li>Maintaining institutional transparency, auditing records, and identifying fraudulent requests.</li>
                <li>Improving the portal's stability, accessibility, and interface based on aggregated user logs.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section id="protection" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                <Lock className="h-5 w-5 text-caleb-gold" />
                <h2 className="text-xl font-bold text-gray-900">3. Data Security & Storage</h2>
              </div>
              <p>
                Your data security is our top priority. We use various security practices to protect your information, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-gray-800">Encryption:</strong> All data transmitted to and from the platform is encrypted using industry-standard Secure Socket Layer (SSL) protocols. Personal details and files are stored securely.
                </li>
                <li>
                  <strong className="text-gray-800">Access Control:</strong> Only authorized administrative personnel and registry coordinators with validated university profiles have access to process or review your submissions.
                </li>
                <li>
                  <strong className="text-gray-800">Infrastructure Security:</strong> Database servers are hosted in a secure, monitored data cloud infrastructure with multi-factor authentication, firewalls, and regular vulnerability scanning.
                </li>
              </ul>
            </section>

            {/* Section 4 */}
            <section id="sharing" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                <HelpCircle className="h-5 w-5 text-caleb-gold" />
                <h2 className="text-xl font-bold text-gray-900">4. Sharing & Disclosure</h2>
              </div>
              <p>
                We do not sell, trade, or share your data with external third parties. Information is shared strictly within the university ecosystem to process your requests:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-gray-800">University Departments:</strong> Relevant personnel in registry, student affairs, academic departments, or bursary will access requests only as needed to process approvals.
                </li>
                <li>
                  <strong className="text-gray-800">Legal Compliance:</strong> We may disclose data if required by law, court order, or formal regulatory investigations.
                </li>
              </ul>
            </section>

            {/* Section 5 */}
            <section id="retention" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                <Clock className="h-5 w-5 text-caleb-gold" />
                <h2 className="text-xl font-bold text-gray-900">5. Data Retention</h2>
              </div>
              <p>
                We retain your personal information as long as your account remains active or as required by the university's academic archiving policy. Official transcripts, registry logs, and clearance history are retained indefinitely as part of the official university record, but files submitted alongside temporal inquiries may be purged periodically to optimize system storage.
              </p>
            </section>

            {/* Section 6 */}
            <section id="rights" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                <Shield className="h-5 w-5 text-caleb-gold" />
                <h2 className="text-xl font-bold text-gray-900">6. Your Rights & Choices</h2>
              </div>
              <p>
                As a student or staff member of Caleb University, you have rights regarding your personal information, which include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Accessing your account settings to view details stored in your profile.</li>
                <li>Requesting corrections to incorrect information (contact the Registry Desk directly for official student record changes).</li>
                <li>Withdrawing pending requests, which halts further data processing.</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section id="changes" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900">7. Policy Changes</h2>
              <p>
                We may revise this Privacy Policy from time to time. When changes occur, we will update the "Effective Date" at the top of this page. We encourage you to review this policy periodically to stay informed about how we are protecting your data.
              </p>
            </section>

            {/* Section 8 */}
            <section id="contact" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                <GraduationCap className="h-5 w-5 text-caleb-gold" />
                <h2 className="text-xl font-bold text-gray-900">8. Contact Information</h2>
              </div>
              <p>
                If you have any questions or concerns regarding this Privacy Policy or how your requests are managed, please reach out to the university registry office:
              </p>
              <div className="mt-4 rounded-lg bg-gray-50 p-5 border border-gray-200">
                <p className="font-semibold text-gray-900">Caleb University Registry & Student Affairs</p>
                <p className="text-sm text-gray-600 mt-1">KM 15 Ikorodu-Itoikin Road, Imota, Lagos, Nigeria</p>
                <p className="text-sm text-gray-600">Email: <a href="mailto:support@calebuniversity.edu.ng" className="text-caleb-green-light font-medium hover:underline">support@calebuniversity.edu.ng</a></p>
              </div>
            </section>
          </div>
        </main>
      </div>

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
