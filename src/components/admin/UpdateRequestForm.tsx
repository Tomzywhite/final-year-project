'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { REQUEST_STATUSES, STATUS_LABELS } from '@/lib/constants'
import { updateRequestStatus, claimRequest, unclaimRequest } from '@/lib/requests'
import type { RequestStatus, ServiceRequestWithProfile, Role } from '@/types'

interface UpdateRequestFormProps {
  request: ServiceRequestWithProfile
  currentAdminId: string
  currentAdminRole: Role
}

export function UpdateRequestForm({ request, currentAdminId, currentAdminRole }: UpdateRequestFormProps) {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [success, setSuccess] = React.useState('')
  const [selectedStatus, setSelectedStatus] = React.useState<RequestStatus>(request.status)

  const isSuperAdmin = currentAdminRole === 'super_admin'
  const isAssignedToMe = request.assigned_to === currentAdminId
  const isAssignedToSomeoneElse = request.assigned_to !== null && !isAssignedToMe
  const isUnassigned = request.assigned_to === null
  const canEdit = isAssignedToMe || isSuperAdmin

  // Remark is required when the admin closes a request
  const remarkRequired = selectedStatus === 'resolved' || selectedStatus === 'rejected'

  const statusOptions = REQUEST_STATUSES.map(status => ({
    label: STATUS_LABELS[status],
    value: status,
  }))

  async function handleClaim() {
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const result = await claimRequest(request.id, currentAdminId)
      if (!result.success) {
        setError(result.message)
      } else {
        router.refresh()
      }
    } catch {
      setError('Something went wrong while claiming. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleUnclaim() {
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const result = await unclaimRequest(request.id, currentAdminId, currentAdminRole)
      if (!result.success) {
        setError(result.message)
      } else {
        router.refresh()
      }
    } catch {
      setError('Something went wrong while unclaiming. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const formData = new FormData(e.currentTarget)
      const admin_remark = (formData.get('admin_remark') as string).trim()

      // Client-side guard (HTML required handles it, but belt-and-braces)
      if (remarkRequired && !admin_remark) {
        setError('A remark is required when resolving or rejecting a request.')
        setLoading(false)
        return
      }

      const result = await updateRequestStatus(request.id, {
        status: selectedStatus,
        admin_remark: admin_remark || undefined,
      })

      if (!result) {
        setError('Failed to update request status.')
        return
      }

      setSuccess('Request updated successfully.')
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border border-gray-200 p-8 shadow-sm">
      <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase border-b border-gray-100 pb-4 mb-6">
        Official Admin Actions
      </h3>

      {error && (
        <div className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-600 mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-600 mb-4">
          {success}
        </div>
      )}

      {/* ── Unassigned: show Claim button ── */}
      {isUnassigned && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            This request is unclaimed. Claim it to take ownership before making any updates.
          </p>
          <button
            onClick={handleClaim}
            disabled={loading}
            className="rounded bg-caleb-green px-6 py-2.5 text-sm font-medium text-white hover:bg-caleb-green-dark transition-colors disabled:opacity-70"
          >
            {loading ? 'Claiming...' : 'Claim & Handle'}
          </button>
        </div>
      )}

      {/* ── Claimed by someone else & not super_admin: read-only banner ── */}
      {isAssignedToSomeoneElse && !isSuperAdmin && (
        <div className="rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          ⚠️ This request is currently being handled by{' '}
          <span className="font-semibold">
            {request.assigned_admin?.full_name ?? 'another admin'}
          </span>
          . Only they can update it.
        </div>
      )}

      {/* ── Can edit (assigned to me OR super_admin): full form ── */}
      {canEdit && (
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* super_admin override banner when viewing someone else's claimed request */}
          {isAssignedToSomeoneElse && isSuperAdmin && (
            <div className="rounded border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 flex items-center justify-between gap-4">
              <span>
                ⚠️ Claimed by{' '}
                <span className="font-semibold">
                  {request.assigned_admin?.full_name ?? 'another admin'}
                </span>
                . You are overriding as Super Admin.
              </span>
              <button
                type="button"
                onClick={handleUnclaim}
                disabled={loading}
                className="shrink-0 text-xs font-medium text-amber-700 underline hover:text-amber-900 disabled:opacity-50"
              >
                Release Claim
              </button>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Update Status</label>
            <select
              name="status"
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value as RequestStatus)}
              required
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-caleb-green focus:outline-none focus:ring-1 focus:ring-caleb-green"
            >
              {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center justify-between text-sm font-medium text-gray-700">
              Admin Remark
              {remarkRequired ? (
                <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">Required</span>
              ) : (
                <span className="text-xs font-normal text-gray-400">Optional</span>
              )}
            </label>
            <textarea
              name="admin_remark"
              defaultValue={request.admin_remark || ''}
              required={remarkRequired}
              placeholder={remarkRequired
                ? 'Explain your decision to the student — this is required...'
                : 'Leave a public remark for the student here...'
              }
              className="w-full min-h-[120px] rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-caleb-green focus:outline-none focus:ring-1 focus:ring-caleb-green"
            />
            {remarkRequired && (
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2">
                ⚠️ A remark is mandatory when resolving or rejecting. The student will see this message.
              </p>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            {isAssignedToMe && (
              <button
                type="button"
                onClick={handleUnclaim}
                disabled={loading}
                className="text-sm font-medium text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
              >
                Unclaim Request
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="ml-auto rounded bg-caleb-green px-6 py-2.5 text-sm font-medium text-white hover:bg-caleb-green-dark transition-colors disabled:opacity-70"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
