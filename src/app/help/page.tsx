'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { 
  ArrowLeft, 
  Search, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  BookOpen, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react'

interface FAQ {
  question: string
  answer: string
  category: 'academic' | 'account' | 'processing'
}

const FAQS: FAQ[] = [
  {
    category: 'academic',
    question: 'How do I request my official academic transcript?',
    answer: 'To request an official transcript, log into your student dashboard, navigate to the "New Request" section, select "Transcript Request" from the services dropdown, and upload the required proof of payment from the university bursary. Once verified by the registry, your transcript will be processed.'
  },
  {
    category: 'academic',
    question: 'How long does it take for a clearance request to be approved?',
    answer: 'Registry clearances are usually processed within 3 to 5 business days. The timeline depends on bursary confirmation and department review. You will receive an automated email notification as soon as the status of your request is updated.'
  },
  {
    category: 'academic',
    question: 'Can I edit or cancel a request after submission?',
    answer: 'Once a request is submitted, it enters the processing queue and cannot be edited directly to ensure data integrity. If you need to make changes or cancel the request, please add a message in the request feed or contact your department coordinator.'
  },
  {
    category: 'account',
    question: 'I forgot my portal password. How do I reset it?',
    answer: 'On the login page, click "Forgot Password" and enter your official university email address. A secure reset link will be emailed to you. If you do not receive the email within 10 minutes, check your spam folder or reach out to IT support.'
  },
  {
    category: 'account',
    question: 'What should I do if my admin account approval is pending?',
    answer: 'Administrative account registrations must be verified and approved by a system super-admin. This security protocol is usually completed within 24 hours. If your approval is pending longer, please contact the registry director office to verify your staff credentials.'
  },
  {
    category: 'processing',
    question: 'Why is my service request taking longer than expected?',
    answer: 'Delays are typically caused by missing supporting documents, unverified payment receipt details, or high submission volume during peak registry seasons (e.g., registration periods or graduations). Review your request activity feed to check for admin feedback comments.'
  },
  {
    category: 'processing',
    question: 'What is the "Pending Document" request status?',
    answer: 'This status indicates that the reviewing administrator found an issue with your uploads (e.g., low-resolution scan, missing bank receipt, or wrong document type). You can read their specific feedback comment in your dashboard and upload the corrected file directly.'
  }
]

export default function HelpPage() {
  const [user, setUser] = useState<any>(null)
  const [dashboardUrl, setDashboardUrl] = useState('/')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient()
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setUser(user)
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

          if (profile?.role === 'admin' || profile?.role === 'super_admin') {
            setDashboardUrl('/admin/dashboard')
          } else if (profile?.role === 'pending_admin') {
            setDashboardUrl('/pending-approval')
          } else {
            setDashboardUrl('/student/dashboard')
          }
        }
      } catch (error) {
        console.error('Failed to get session client side in help page:', error)
      }
    }
    checkAuth()
  }, [])

  const filteredFaqs = FAQS.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  function toggleFaq(index: number) {
    setOpenFaqIndex(openFaqIndex === index ? null : index)
  }

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

      {/* Hero Search Section */}
      <section className="bg-caleb-green text-white py-16 px-6 text-center md:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-caleb-gold">
            <HelpCircle className="h-4 w-4" />
            HELP CENTER & SUPPORT
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-5xl mb-6">
            How can we help you today?
          </h1>
          
          {/* Search Box */}
          <div className="relative mx-auto max-w-xl text-gray-800">
            <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search frequently asked questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border-0 bg-white py-4 pl-12 pr-6 shadow-md focus:ring-2 focus:ring-caleb-gold outline-none text-base"
            />
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-6 py-12 md:flex-row md:px-12">
        {/* Left Side: FAQs */}
        <div className="flex-1 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h2>
            <p className="text-gray-500 text-sm">Find answers to processing timelines, academic requests, and account configurations.</p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
            {[
              { id: 'all', label: 'All FAQs' },
              { id: 'academic', label: 'Academic Requests' },
              { id: 'account', label: 'Accounts & Security' },
              { id: 'processing', label: 'Processing Times' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setSelectedCategory(tab.id)
                  setOpenFaqIndex(null)
                }}
                className={`rounded-full px-4 py-2 text-xs font-medium transition-all cursor-pointer ${
                  selectedCategory === tab.id
                    ? 'bg-caleb-green text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => {
                const isOpen = openFaqIndex === index
                return (
                  <div
                    key={index}
                    className="overflow-hidden rounded-lg border border-gray-200 bg-white transition-all shadow-xs hover:border-gray-300"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="flex w-full items-center justify-between px-6 py-5 text-left font-medium text-gray-900 focus:outline-none cursor-pointer"
                    >
                      <span className="pr-4">{faq.question}</span>
                      {isOpen ? (
                        <ChevronUp className="h-5 w-5 text-caleb-gold shrink-0" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400 shrink-0" />
                      )}
                    </button>
                    
                    {/* Collapsible Content */}
                    <div
                      className={`transition-all duration-200 ease-in-out ${
                        isOpen ? 'max-h-[500px] border-t border-gray-100 bg-slate-50/50' : 'max-h-0'
                      } overflow-hidden`}
                    >
                      <div className="px-6 py-5 text-gray-600 text-sm leading-relaxed">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center rounded-lg border border-dashed border-gray-300 bg-white">
                <AlertCircle className="h-10 w-10 text-gray-300 mb-2" />
                <p className="text-gray-500 font-medium">No questions match your query.</p>
                <button 
                  onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }} 
                  className="mt-2 text-xs font-semibold text-caleb-green-light hover:underline cursor-pointer"
                >
                  Clear search filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Contact Cards */}
        <aside className="w-full md:w-80 shrink-0 space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Direct Contact</h3>
            <p className="text-gray-500 text-xs mb-6">Can't find the answer you need? Get in touch directly with our support desk.</p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 shrink-0">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase">Email Support</p>
                  <a href="mailto:support@calebuniversity.edu.ng" className="text-sm font-medium text-caleb-green-light hover:underline truncate block">
                    support@calebuniversity.edu.ng
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700 shrink-0">
                  <Phone className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase">Call Support</p>
                  <p className="text-sm font-medium text-gray-800">
                    +234 815 678 9012
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-700 shrink-0">
                  <MapPin className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase">Registry Desk</p>
                  <p className="text-sm text-gray-700 leading-normal">
                    Ground Floor, Administrative Block, Main Campus.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Operational Hours Card */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-1.5">
              <Clock className="h-4.5 w-4.5 text-caleb-gold" />
              Service Hours
            </h3>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between border-b border-gray-100 pb-1.5">
                <span>Monday - Friday</span>
                <span className="font-semibold text-gray-800">8:00 AM - 4:00 PM</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1.5">
                <span>Saturday</span>
                <span className="font-semibold text-gray-800">9:00 AM - 1:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday & Holidays</span>
                <span className="text-red-500 font-medium">Closed</span>
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8 text-sm text-gray-500 mt-auto">
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
