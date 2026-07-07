'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface FormData {
  full_name: string
  matric_number: string
  email: string
  password: string
  confirmPassword: string
}

interface FormErrors {
  full_name?: string
  matric_number?: string
  email?: string
  password?: string
  confirmPassword?: string
}

export default function RegisterForm() {
  const router = useRouter()

  const [registerMode, setRegisterMode] = useState<'student' | 'admin'>('student')

  const [formData, setFormData] = useState<FormData>({
    full_name: '',
    matric_number: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // ── Validation ──────────────────────────────────────────────────────────────

  function validate(): boolean {
    const newErrors: FormErrors = {}

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required.'
    }

    if (registerMode === 'student' && !formData.matric_number.trim()) {
      newErrors.matric_number = 'Matriculation number is required.'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.'
    }

    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ── Field change handler ────────────────────────────────────────────────────

  function handleChange(field: keyof FormData) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }))
      // Clear the field-level error as the user types
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }))
      }
    }
  }

  // ── Submit ──────────────────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setServerError(null)

    if (!validate()) return

    setLoading(true)

    const supabase = createClient()

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        // These values are picked up by the handle_new_user DB trigger
        data: {
          full_name: formData.full_name,
          matric_number: registerMode === 'student' ? formData.matric_number : null,
          role: registerMode === 'admin' ? 'pending_admin' : 'student',
        },
      },
    })

    if (error) {
      const msg = error.message.toLowerCase()
      if (msg.includes('already registered') || msg.includes('already exists')) {
        setServerError(
          'An account with this email already exists. Please sign in instead.'
        )
      } else {
        setServerError(`Registration failed: ${error.message}`)
      }
      setLoading(false)
      return
    }

    if (data?.session) {
      // If email confirmation is disabled, we get an active session immediately.
      // Redirect to home/dashboard page.
      window.location.href = '/'
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  // ── Success state ───────────────────────────────────────────────────────────

  if (success) {
    return (
      <div className="text-center space-y-4 py-4">
        <div className="w-16 h-16 bg-caleb-green/10 rounded-full flex items-center justify-center mx-auto">
          <svg
            className="w-8 h-8 text-caleb-green"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Check Your Email
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          We&apos;ve sent a confirmation link to{' '}
          <span className="font-semibold text-gray-900">{formData.email}</span>.
          <br />
          Please click the link in your email to verify your account before signing in.
        </p>
        <div className="pt-2 border-t border-gray-100 mt-4">
          <p className="text-xs text-gray-400">
            Didn&apos;t receive an email? Check your spam folder or{' '}
            <button
              onClick={() => setSuccess(false)}
              className="text-caleb-green font-medium hover:underline"
            >
              try again
            </button>.
          </p>
        </div>
      </div>
    )
  }

  // ── Form ────────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Role Toggle (Subtle) */}
      <div className="flex bg-gray-100 p-1 rounded-md">
        <button
          type="button"
          onClick={() => setRegisterMode('student')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded transition-all ${
            registerMode === 'student'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Student
        </button>
        <button
          type="button"
          onClick={() => setRegisterMode('admin')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded transition-all ${
            registerMode === 'admin'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Staff / Admin
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700" htmlFor="full_name">
            Full Name
          </label>
          <Input
            type="text"
            id="full_name"
            value={formData.full_name}
            onChange={handleChange('full_name')}
            placeholder="John Doe"
            error={errors.full_name}
            required
            autoComplete="name"
            className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-caleb-green focus:border-caleb-green rounded-md"
          />
        </div>

        {registerMode === 'student' && (
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700" htmlFor="matric_number">
              Matriculation Number
            </label>
            <Input
              type="text"
              id="matric_number"
              value={formData.matric_number}
              onChange={handleChange('matric_number')}
              placeholder="e.g. 18/1234"
              error={errors.matric_number}
              required
              className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-caleb-green focus:border-caleb-green rounded-md"
            />
          </div>
        )}

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700" htmlFor="email">
            University Email
          </label>
          <Input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange('email')}
            placeholder="john.doe@student.calebuniversity.edu.ng"
            error={errors.email}
            required
            autoComplete="email"
            className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-caleb-green focus:border-caleb-green rounded-md"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700" htmlFor="password">
            Password
          </label>
          <Input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange('password')}
            placeholder="••••••••"
            error={errors.password}
            required
            autoComplete="new-password"
            className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-caleb-green focus:border-caleb-green rounded-md"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700" htmlFor="confirm_password">
            Confirm Password
          </label>
          <Input
            type="password"
            id="confirm_password"
            value={formData.confirmPassword}
            onChange={handleChange('confirmPassword')}
            placeholder="••••••••"
            error={errors.confirmPassword}
            required
            autoComplete="new-password"
            className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-caleb-green focus:border-caleb-green rounded-md"
          />
        </div>

        {serverError && (
          <div
            role="alert"
            className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm"
          >
            {serverError}
          </div>
        )}

        <Button type="submit" loading={loading} className="w-full bg-caleb-green hover:bg-caleb-green-dark text-white rounded-md py-2.5 mt-2 font-medium">
          Register
        </Button>

        <div className="text-center text-sm text-gray-600 mt-6 pt-2 border-t border-transparent">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-gray-900 hover:underline">
            Log in
          </Link>
        </div>
      </form>
    </div>
  )
}
