'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Mail, CheckCircle2 } from 'lucide-react'

// Microsoft icon as inline SVG (no extra dependency)
function MicrosoftIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21" className="h-4 w-4" aria-hidden="true">
      <rect x="1" y="1" width="9" height="9" fill="#f25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
      <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
      <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
    </svg>
  )
}

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [ssoLoading, setSsoLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Login Mode State
  const [loginMode, setLoginMode] = useState<'password' | 'magic_link'>('password')
  const [magicLinkSent, setMagicLinkSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    
    if (loginMode === 'password') {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message || 'Failed to sign in. Please check your credentials.')
        setLoading(false)
        return
      }

      // Force a hard navigation to ensure cookies are read freshly by the proxy
      window.location.href = '/'
    } else {
      // Magic Link Login
      const { error: magicLinkError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          shouldCreateUser: false, // Prevents creating a user without full_name/matric_number
        },
      })

      if (magicLinkError) {
        setError(magicLinkError.message || 'Failed to send magic link. Please check your email and try again.')
        setLoading(false)
        return
      }

      setMagicLinkSent(true)
      setLoading(false)
    }
  }

  async function handleMicrosoftLogin() {
    setSsoLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        scopes: 'email',
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      setError(error.message || 'Microsoft sign-in failed.')
      setSsoLoading(false)
    }
    // On success, Supabase redirects the browser automatically
  }

  return (
    <div className="space-y-4">
      {/* Microsoft SSO Button */}
      <button
        type="button"
        onClick={handleMicrosoftLogin}
        disabled={ssoLoading}
        className="flex w-full items-center justify-center gap-3 rounded border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-70"
      >
        <MicrosoftIcon />
        {ssoLoading ? 'Redirecting...' : 'Sign in with Microsoft'}
      </button>

      {/* Divider */}
      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-3 text-gray-400 uppercase tracking-wider">or</span>
        </div>
      </div>

      {/* Login Mode Toggle */}
      <div className="flex bg-gray-100 p-1 rounded-md">
        <button
          type="button"
          onClick={() => {
            setLoginMode('password')
            setMagicLinkSent(false)
            setError(null)
          }}
          className={`flex-1 py-1.5 text-xs font-semibold rounded transition-all ${
            loginMode === 'password'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Password
        </button>
        <button
          type="button"
          onClick={() => {
            setLoginMode('magic_link')
            setError(null)
          }}
          className={`flex-1 py-1.5 text-xs font-semibold rounded transition-all ${
            loginMode === 'magic_link'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Magic Link
        </button>
      </div>

      {magicLinkSent && loginMode === 'magic_link' ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-5 text-center mt-4">
          <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-green-900 mb-1">Check your email</h3>
          <p className="text-xs text-green-700 mb-4">
            We sent a sign-in link to <strong>{email}</strong>
          </p>
          <button
            onClick={() => setMagicLinkSent(false)}
            className="text-xs font-medium text-caleb-green hover:underline"
          >
            Send another link
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div
              role="alert"
              className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm"
            >
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700" htmlFor="email">
              Email Address
            </label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@calebuniversity.edu.ng"
              className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-caleb-green focus:border-caleb-green rounded-md"
              required
              autoComplete="email"
            />
          </div>

          {loginMode === 'password' && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700" htmlFor="password">
                  Password
                </label>
              </div>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-caleb-green focus:border-caleb-green rounded-md"
                required
                autoComplete="current-password"
              />
              <div className="flex justify-end pt-1">
                <Link href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                  Forgot Password?
                </Link>
              </div>
            </div>
          )}
          
          <Button type="submit" loading={loading} className="w-full bg-caleb-green hover:bg-caleb-green-dark text-white rounded-md py-2.5 font-medium flex items-center justify-center gap-2 mt-2">
            {loginMode === 'password' ? (
              <>
                Sign In 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            ) : (
              <>
                <Mail className="w-4 h-4" />
                Send Magic Link
              </>
            )}
          </Button>

          <div className="text-center text-sm text-gray-600 mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-semibold text-gray-900 hover:underline">
              Register
            </Link>
          </div>
        </form>
      )}
    </div>
  )
}
