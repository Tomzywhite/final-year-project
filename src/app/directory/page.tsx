'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { 
  ArrowLeft, 
  Search, 
  Mail, 
  Phone, 
  MapPin, 
  Copy, 
  Check, 
  BookOpen, 
  GraduationCap, 
  FolderPlus, 
  ShieldCheck, 
  Compass, 
  Bookmark 
} from 'lucide-react'

interface Contact {
  name: string
  role: string
  department: string
  category: 'registry' | 'bursary' | 'services' | 'faculties'
  email: string
  extension: string
  location: string
}

const CONTACTS: Contact[] = [
  {
    name: 'Transcript Request Unit',
    role: 'Registry Processing Desk',
    department: 'Academic Registry Office',
    category: 'registry',
    email: 'transcripts@calebuniversity.edu.ng',
    extension: 'Ext. 102',
    location: 'Ground Floor, Registry Building, Room 102'
  },
  {
    name: 'Student Clearance Desk',
    role: 'Final & Semester Clearances',
    department: 'Academic Registry Office',
    category: 'registry',
    email: 'clearance@calebuniversity.edu.ng',
    extension: 'Ext. 104',
    location: 'Ground Floor, Registry Building, Room 103'
  },
  {
    name: 'Certificate & Archive Office',
    role: 'Diploma & Degree Collections',
    department: 'Academic Registry Office',
    category: 'registry',
    email: 'registry.archives@calebuniversity.edu.ng',
    extension: 'Ext. 101',
    location: 'First Floor, Registry Building, Room 204'
  },
  {
    name: 'School Fees Verification',
    role: 'Payment Queries & Receivables',
    department: 'Bursary Department',
    category: 'bursary',
    email: 'fees.verify@calebuniversity.edu.ng',
    extension: 'Ext. 201',
    location: 'Ground Floor, Administrative Block'
  },
  {
    name: 'Portal Technical Support',
    role: 'Server Accounts & Billing Errors',
    department: 'Bursary & IT Services',
    category: 'bursary',
    email: 'portal.billing@calebuniversity.edu.ng',
    extension: 'Ext. 203',
    location: 'First Floor, IT Center, Room 12'
  },
  {
    name: 'Hostel Accommodation Office',
    role: 'Student Housing Allocations',
    department: 'Student Affairs Division',
    category: 'services',
    email: 'hostel.affairs@calebuniversity.edu.ng',
    extension: 'Ext. 305',
    location: 'Student Affairs Center, Main Hallway'
  },
  {
    name: 'Student ID Card Desk',
    role: 'Card Replacements & Registrations',
    department: 'Student Affairs Division',
    category: 'services',
    email: 'student.id@calebuniversity.edu.ng',
    extension: 'Ext. 302',
    location: 'Student Affairs Center, Desk 4'
  },
  {
    name: 'COPAS Department Coordinator',
    role: 'College of Pure & Applied Sciences',
    department: 'Faculty Coordinators',
    category: 'faculties',
    email: 'copas.coord@calebuniversity.edu.ng',
    extension: 'Ext. 401',
    location: 'Science Complex, block A, Room 105'
  },
  {
    name: 'CASMAS Department Coordinator',
    role: 'College of Arts & Social Sciences',
    department: 'Faculty Coordinators',
    category: 'faculties',
    email: 'casmas.coord@calebuniversity.edu.ng',
    extension: 'Ext. 402',
    location: 'Management Complex, block C, Room 201'
  },
  {
    name: 'COLENSS Department Coordinator',
    role: 'College of Environmental Sciences',
    department: 'Faculty Coordinators',
    category: 'faculties',
    email: 'colenss.coord@calebuniversity.edu.ng',
    extension: 'Ext. 403',
    location: 'Environmental Complex, block B, Room 112'
  }
]

export default function DirectoryPage() {
  const [user, setUser] = useState<any>(null)
  const [dashboardUrl, setDashboardUrl] = useState('/')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null)

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
        console.error('Failed to get session client side in directory page:', error)
      }
    }
    checkAuth()
  }, [])

  const filteredContacts = CONTACTS.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      contact.role.toLowerCase().includes(searchQuery.toLowerCase()) || 
      contact.department.toLowerCase().includes(searchQuery.toLowerCase()) || 
      contact.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || contact.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  function copyToClipboard(email: string) {
    navigator.clipboard.writeText(email)
    setCopiedEmail(email)
    setTimeout(() => setCopiedEmail(null), 2000)
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

      {/* Hero Banner Section */}
      <section className="bg-caleb-green text-white py-16 px-6 text-center md:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-caleb-gold">
            <Compass className="h-4 w-4" />
            UNIVERSITY DEPARTMENTS DIRECTORY
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-5xl mb-6">
            Staff & Department Contacts
          </h1>
          
          {/* Search Box */}
          <div className="relative mx-auto max-w-xl text-gray-800">
            <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, role, department, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border-0 bg-white py-4 pl-12 pr-6 shadow-md focus:ring-2 focus:ring-caleb-gold outline-none text-base"
            />
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-6 py-12 md:flex-row md:px-12">
        
        {/* Left Side: Directory Listings */}
        <div className="flex-1 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Office Directory</h2>
            <p className="text-gray-500 text-sm">Direct extensions and verified communication channels for university units.</p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
            {[
              { id: 'all', label: 'All Contacts' },
              { id: 'registry', label: 'Registry & Clearance' },
              { id: 'bursary', label: 'Bursary & Payments' },
              { id: 'services', label: 'Student Services' },
              { id: 'faculties', label: 'College Coordinators' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
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

          {/* Directory Contact Grid */}
          <div className="grid gap-6 md:grid-cols-1">
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs hover:shadow-md hover:border-gray-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2.5">
                    <div>
                      <span className="inline-block rounded bg-slate-100 px-2.5 py-0.5 text-2xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        {contact.department}
                      </span>
                      <h3 className="text-lg font-bold text-gray-900">{contact.name}</h3>
                      <p className="text-sm text-gray-500 font-medium">{contact.role}</p>
                    </div>

                    <div className="flex flex-col gap-2 md:flex-row md:gap-6 text-xs text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Phone className="h-4 w-4 text-caleb-gold" />
                        <span>{contact.extension}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-caleb-gold" />
                        <span>{contact.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div className="flex items-center gap-2 self-start md:self-center">
                    <a
                      href={`mailto:${contact.email}`}
                      className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      Send Mail
                    </a>
                    
                    <button
                      onClick={() => copyToClipboard(contact.email)}
                      className={`flex items-center justify-center p-2 rounded-lg border transition-all cursor-pointer ${
                        copiedEmail === contact.email
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                          : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-black'
                      }`}
                      title="Copy Email Address"
                    >
                      {copiedEmail === contact.email ? (
                        <Check className="h-4 w-4 animate-scale" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed border-gray-300 bg-white">
                <Compass className="h-12 w-12 text-gray-300 mb-2" />
                <p className="text-gray-500 font-medium">No contacts match your query.</p>
                <button 
                  onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }} 
                  className="mt-2 text-xs font-semibold text-caleb-green-light hover:underline cursor-pointer"
                >
                  Reset directory filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side Info Widget */}
        <aside className="w-full md:w-80 shrink-0 space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm bg-gradient-to-br from-white to-slate-50/50">
            <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-1.5">
              <Bookmark className="h-4.5 w-4.5 text-caleb-gold" />
              Quick Reference
            </h3>
            <p className="text-gray-600 text-xs leading-relaxed mb-4">
              Use extension numbers when calling the university central line **+234 815 678 9000** to reach respective desk offices directly.
            </p>
            <div className="rounded-lg border border-yellow-100 bg-yellow-50/70 p-4 text-xs text-yellow-800">
              <span className="font-bold block mb-1">Important:</span>
              Official clearance or transcript inquiries must be logged through the Portal dashboards for audit tracking. Email or phone support is for advisory help only.
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-3">Office Hours</h3>
            <p className="text-gray-500 text-xs mb-3">All offices operate during standard administrative working hours:</p>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between border-b border-gray-100 pb-1.5">
                <span>Mon - Fri</span>
                <span className="font-semibold text-gray-800">8:00 AM - 4:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Weekends</span>
                <span className="text-gray-400">Closed</span>
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
