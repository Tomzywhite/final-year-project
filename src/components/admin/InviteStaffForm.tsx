'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserPlus, Send, CheckCircle2, XCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

type Status = 'idle' | 'loading' | 'success' | 'error'

export function InviteStaffForm() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setMessage(null)

    try {
      const res = await fetch('/api/invite-staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, full_name: fullName }),
      })

      const json = await res.json()

      if (!res.ok) {
        setStatus('error')
        setMessage(json.error || 'Failed to send invitation.')
        return
      }

      setStatus('success')
      setMessage(`Invitation sent to ${email}. They will receive an email to set up their account.`)
      setFullName('')
      setEmail('')
      // Refresh the page to pick up any new pending entries
      router.refresh()
    } catch {
      setStatus('error')
      setMessage('An unexpected error occurred. Please try again.')
    }
  }

  function reset() {
    setStatus('idle')
    setMessage(null)
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
      {/* Header / Toggle */}
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-caleb-green/10 rounded-full flex items-center justify-center">
            <UserPlus className="w-4 h-4 text-caleb-green" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Invite Staff Member</p>
            <p className="text-xs text-slate-500">Send a one-time invite link to a new admin</p>
          </div>
        </div>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Collapsible Body */}
      {isOpen && (
        <div className="px-6 pb-6 pt-2 border-t border-slate-100">
          {status === 'success' ? (
            <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-4 mt-4">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800">Invitation sent!</p>
                <p className="text-xs text-green-700 mt-0.5">{message}</p>
                <button
                  onClick={reset}
                  className="mt-3 text-xs font-semibold text-green-700 hover:text-green-900 underline"
                >
                  Send another invite
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {status === 'error' && message && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                  <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{message}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700" htmlFor="invite-full-name">
                    Full Name
                  </label>
                  <Input
                    type="text"
                    id="invite-full-name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Dr. Adebayo Okafor"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700" htmlFor="invite-email">
                    Staff Email Address
                  </label>
                  <Input
                    type="email"
                    id="invite-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="staff@calebuniversity.edu.ng"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  loading={status === 'loading'}
                  className="flex items-center gap-2 bg-caleb-green hover:bg-caleb-green-dark text-white px-5 py-2 text-sm font-medium rounded-md"
                >
                  <Send className="w-4 h-4" />
                  Send Invite Link
                </Button>
              </div>

              <p className="text-xs text-slate-400">
                The invited person will receive an email with a one-time link to set up their
                account. They'll be registered as a{' '}
                <span className="font-semibold text-slate-500">pending admin</span> and will need
                your approval below before gaining access.
              </p>
            </form>
          )}
        </div>
      )}
    </div>
  )
}
