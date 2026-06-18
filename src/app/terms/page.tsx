import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft, BookOpen, UserCheck, ShieldAlert, FileSignature, CheckCircle, Scale, AlertTriangle } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service | Caleb Student Services',
  description: 'Terms of Service for the Caleb University Student Service Portal',
}

export default async function TermsPage() {
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
    console.error('Failed to get session in terms page:', error)
  }

  const sections = [
    { id: 'acceptance', label: 'Acceptance of Terms' },
    { id: 'accounts', label: '1. User Accounts & Security' },
    { id: 'conduct', label: '2. Acceptable Use Policy' },
    { id: 'submissions', label: '3. Request Submissions' },
    { id: 'processing', label: '4. Service & Processing' },
    { id: 'intellectual', label: '5. Intellectual Property' },
    { id: 'liability', label: '6. Limitation of Liability' },
    { id: 'governing-law', label: '7. Governing Law' },
    { id: 'changes', label: '8. Changes to Terms' },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans">
      {/* Header */}
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
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
              <BookOpen className="h-3.5 w-3.5" />
              Last Updated June 11, 2026
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">Terms of Service</h1>
            <p className="mt-3 text-gray-500">
              Please read these Terms of Service carefully before registering or using the Caleb Student Service Request Portal.
            </p>
          </div>

          <div className="prose prose-slate max-w-none space-y-8 text-gray-600">
            {/* Acceptance */}
            <section id="acceptance" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900">Acceptance of Terms</h2>
              <p>
                By registering an account, logging in, or submitting any request on the Caleb Student Service Request Portal ("the Portal"), you agree to comply with and be bound by these Terms of Service. If you do not agree with any part of these terms, you must immediately cease using the Portal. These terms represent a binding agreement between you and Caleb University.
              </p>
            </section>

            {/* Section 1 */}
            <section id="accounts" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                <UserCheck className="h-5 w-5 text-caleb-gold" />
                <h2 className="text-xl font-bold text-gray-900">1. User Accounts & Security</h2>
              </div>
              <p>
                To access and submit requests on this Portal, you must be a registered student or staff member of Caleb University.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-gray-800">Account Accuracy:</strong> You agree to provide true, current, and complete details during registration. Impersonating another student or using an unauthorized matriculation number is strictly prohibited and subject to university disciplinary actions.
                </li>
                <li>
                  <strong className="text-gray-800">Security Credentials:</strong> You are responsible for keeping your login credentials confidential. You must notify portal administrators immediately if you suspect any unauthorized use of your account.
                </li>
                <li>
                  <strong className="text-gray-800">Responsibility:</strong> All actions and requests submitted through your authenticated account are deemed to have been made by you.
                </li>
              </ul>
            </section>

            {/* Section 2 */}
            <section id="conduct" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                <ShieldAlert className="h-5 w-5 text-caleb-gold" />
                <h2 className="text-xl font-bold text-gray-900">2. Acceptable Use Policy</h2>
              </div>
              <p>
                You agree to use this Portal strictly for legitimate university-related administrative requests. Prohibited actions include, but are not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Uploading forged documents, altered receipt scans, or counterfeit academic clearances.</li>
                <li>Submitting repetitive, spam, or malicious requests designed to overload registry queues.</li>
                <li>Attempting to bypass authentication or gain access to other users' profiles.</li>
                <li>Using automated scripts, bots, or scraping tools to extract portal data.</li>
                <li>Uploading files containing viruses, corrupted data, or harmful software.</li>
              </ul>
              <div className="my-4 rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-900">Academic Misconduct Warning</h4>
                    <p className="text-sm text-red-800 mt-1">
                      Submitting forged payment receipts, clearance forms, or transcripts is a serious academic offense. Any user caught doing so will be immediately reported to the University Disciplinary Committee, which can result in suspension or expulsion from the institution.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section id="submissions" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                <FileSignature className="h-5 w-5 text-caleb-gold" />
                <h2 className="text-xl font-bold text-gray-900">3. Request Submissions</h2>
              </div>
              <p>
                When submitting requests for registry clearances, academic transcripts, or related administrative documents:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You must ensure that all fields are filled accurately and the correct document types are attached.</li>
                <li>You acknowledge that submitted files will be inspected by administrative personnel for verification.</li>
                <li>You agree that the university may contact you to clarify request descriptions or request supplementary information.</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section id="processing" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                <CheckCircle className="h-5 w-5 text-caleb-gold" />
                <h2 className="text-xl font-bold text-gray-900">4. Service & Processing Times</h2>
              </div>
              <p>
                While we strive to process requests as quickly as possible:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Processing times vary depending on queue length, department verification timelines, and the complexity of the request.</li>
                <li>Submission of a request does not guarantee instant approval. Approval is contingent on fulfilling university academic, administrative, and bursary criteria.</li>
                <li>Estimated timelines provided on the portal are guidelines and not binding commitments.</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section id="intellectual" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900">5. Intellectual Property</h2>
              <p>
                All elements of this Portal, including the website layout, design, text, branding, graphics, and system software, are owned by Caleb University or licensing third parties. You may not copy, replicate, or exploit any portal design assets or reverse-engineer the codebase without prior written consent.
              </p>
            </section>

            {/* Section 6 */}
            <section id="liability" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                <Scale className="h-5 w-5 text-caleb-gold" />
                <h2 className="text-xl font-bold text-gray-900">6. Limitation of Liability</h2>
              </div>
              <p>
                Caleb University makes no representations about the reliability, availability, or timeliness of the Portal's services.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The Portal is provided "as is" and "as available" without warranties of any kind.</li>
                <li>We do not guarantee that access will be completely uninterrupted or error-free.</li>
                <li>In no event shall the university or portal operators be liable for any direct, indirect, or consequential damages resulting from portal downtime, loss of uploaded files, or delayed request processing.</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section id="governing-law" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900">7. Governing Law</h2>
              <p>
                These Terms of Service are governed by and construed in accordance with the laws of the Federal Republic of Nigeria, and any dispute arising from usage of the Portal shall be subject to the exclusive jurisdiction of the competent courts of Lagos State, Nigeria.
              </p>
            </section>

            {/* Section 8 */}
            <section id="changes" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900">8. Changes to Terms</h2>
              <p>
                The university reserves the right to amend these Terms of Service at any time to reflect portal upgrades, security updates, or policy adjustments. When updates are published, the revised date will be reflected at the top of the terms. Your continued use of the Portal following modifications indicates your acceptance of the new Terms of Service.
              </p>
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
