'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types'
import { User, Mail, Hash, ShieldCheck, CheckCircle2 } from 'lucide-react'

interface ProfileDetailsProps {
  profile: Profile
}

export function ProfileDetails({ profile }: ProfileDetailsProps) {
  const router = useRouter()
  const supabase = createClient()
  
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Form states
  const [fullName, setFullName] = useState(profile.full_name)
  const [matricNumber, setMatricNumber] = useState(profile.matric_number || '')

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const updates = {
      full_name: fullName.trim(),
      matric_number: profile.role === 'student' ? matricNumber.trim() : null,
      updated_at: new Date().toISOString()
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', profile.id)

    if (updateError) {
      setError(updateError.message || 'Failed to update profile.')
      setLoading(false)
      return
    }

    setSuccess('Profile updated successfully.')
    setLoading(false)
    setIsEditing(false)
    router.refresh()
  }

  const getRoleBadge = (role: string) => {
    if (role === 'super_admin') {
      return <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-800 uppercase tracking-wider"><ShieldCheck className="h-3 w-3" /> Super Admin</span>
    }
    if (role === 'admin') {
      return <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 uppercase tracking-wider"><ShieldCheck className="h-3 w-3" /> Admin</span>
    }
    return <span className="inline-flex items-center gap-1 rounded-full bg-caleb-green/10 px-3 py-1 text-xs font-semibold text-caleb-green uppercase tracking-wider"><User className="h-3 w-3" /> Student</span>
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2 space-y-6">
        <div className="bg-white border border-gray-200 p-8 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
            <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase">Personal Information</h3>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm font-medium text-caleb-green hover:text-caleb-green-dark transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>

          {error && (
            <div className="mb-6 rounded border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 flex flex-row items-center gap-2 rounded border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
              {success}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-caleb-green focus:outline-none focus:ring-1 focus:ring-caleb-green"
                  />
                ) : (
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-transparent rounded text-sm text-gray-900">
                    <User className="h-4 w-4 text-gray-400" />
                    {profile.full_name}
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-transparent rounded text-sm text-gray-900 cursor-not-allowed opacity-80">
                  <Mail className="h-4 w-4 text-gray-400" />
                  {profile.email}
                </div>
                {isEditing && <p className="text-xs text-gray-400 bg-transparent">Email cannot be changed directly.</p>}
              </div>

              {profile.role === 'student' && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Matriculation Number</label>
                  {isEditing ? (
                    <input
                      type="text"
                      required
                      value={matricNumber}
                      onChange={(e) => setMatricNumber(e.target.value)}
                      className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-caleb-green focus:outline-none focus:ring-1 focus:ring-caleb-green"
                    />
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-transparent rounded text-sm text-gray-900">
                      <Hash className="h-4 w-4 text-gray-400" />
                      {profile.matric_number || 'Not Provided'}
                    </div>
                  )}
                </div>
              )}
            </div>

            {isEditing && (
              <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false)
                    setFullName(profile.full_name)
                    setMatricNumber(profile.matric_number || '')
                    setError('')
                    setSuccess('')
                  }}
                  disabled={loading}
                  className="rounded border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="rounded bg-caleb-green px-6 py-2 text-sm font-medium text-white hover:bg-caleb-green-dark transition-colors disabled:opacity-70"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white border border-gray-200 p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase">System Identity</h3>
          
          <div className="pt-2 flex flex-col items-start gap-4">
            <div className="flex items-center justify-center h-16 w-16 bg-gray-100 rounded-full text-gray-400 ring-4 ring-white border border-gray-200 shrink-0">
              <User className="h-8 w-8" />
            </div>
            
            <div className="w-full space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">System Role</p>
                <div>{getRoleBadge(profile.role)}</div>
              </div>
              
              <div>
                <p className="text-xs text-gray-500 mb-1">Account Created</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(profile.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
