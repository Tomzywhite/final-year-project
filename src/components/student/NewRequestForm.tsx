'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { UploadCloud, Info, FileText, X } from 'lucide-react'
import { REQUEST_TYPES } from '@/lib/constants'

const MAX_FILE_SIZE_MB = 5
const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']

export function NewRequestForm({ studentId }: { studentId: string }) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [fileError, setFileError] = React.useState('')

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    setFileError('')
    if (!file) { setSelectedFile(null); return }

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setFileError('Unsupported file type. Please upload a PDF, image, or Word document.')
      e.target.value = ''
      return
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setFileError(`File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`)
      e.target.value = ''
      return
    }
    setSelectedFile(file)
  }

  function removeFile() {
    setSelectedFile(null)
    setFileError('')
    const input = document.getElementById('file-upload') as HTMLInputElement
    if (input) input.value = ''
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (fileError) return
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const request_type = formData.get('request_type') as string
    const subject = formData.get('subject') as string
    const description = formData.get('description') as string

    if (!request_type || !subject || !description) {
      setError('All fields are required.')
      setLoading(false)
      return
    }

    // Upload attachment if present
    let attachment_url: string | null = null
    if (selectedFile) {
      const ext = selectedFile.name.split('.').pop()
      const path = `${studentId}/${crypto.randomUUID()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('request-attachments')
        .upload(path, selectedFile, { upsert: false })

      if (uploadError) {
        setError('Failed to upload attachment: ' + uploadError.message)
        setLoading(false)
        return
      }
      attachment_url = path
    }

    const { error: insertError } = await supabase
      .from('service_requests')
      .insert({
        student_id: studentId,
        request_type,
        subject,
        description,
        status: 'pending',
        attachment_url,
      })

    if (insertError) {
      setError(insertError.message || 'Failed to submit request.')
      setLoading(false)
      return
    }

    router.push('/student/requests')
    router.refresh()
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="bg-white border border-gray-200 p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Request Type</label>
              <select
                name="request_type"
                required
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-caleb-green focus:outline-none focus:ring-1 focus:ring-caleb-green"
              >
                <option value="">Select a category</option>
                {REQUEST_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Subject</label>
              <input
                type="text"
                name="subject"
                required
                placeholder="Brief summary of your request"
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-caleb-green focus:outline-none focus:ring-1 focus:ring-caleb-green"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                required
                placeholder="Provide more details about your request..."
                rows={6}
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-caleb-green focus:outline-none focus:ring-1 focus:ring-caleb-green"
              />
            </div>

            {/* File Attachment */}
            <div className="space-y-1.5">
              <label className="flex justify-between text-sm font-medium text-gray-700">
                Supporting Document
                <span className="text-gray-400 font-normal">Optional</span>
              </label>

              {selectedFile ? (
                <div className="flex items-center gap-3 rounded-lg border border-caleb-green/30 bg-caleb-green/5 px-4 py-3">
                  <FileText className="h-5 w-5 shrink-0 text-caleb-green" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button type="button" onClick={removeFile} className="shrink-0 text-gray-400 hover:text-red-500 transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="file-upload"
                  className="mt-1 flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 px-6 py-10 hover:border-caleb-green transition-colors bg-gray-50/50"
                >
                  <UploadCloud className="mx-auto h-10 w-10 text-gray-400" aria-hidden="true" />
                  <div className="mt-3 flex text-sm leading-6 text-gray-600 justify-center">
                    <span className="font-semibold text-caleb-green hover:text-caleb-green-dark">Click to upload</span>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-500 mt-1">PDF, JPG, PNG, or DOCX · Max {MAX_FILE_SIZE_MB}MB</p>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
                    onChange={handleFileChange}
                  />
                </label>
              )}

              {fileError && (
                <p className="text-xs text-red-600">{fileError}</p>
              )}
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => router.back()}
                disabled={loading}
                className="rounded border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !!fileError}
                className="rounded bg-caleb-green px-6 py-2.5 text-sm font-medium text-white hover:bg-caleb-green-dark transition-colors disabled:opacity-70"
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div>
        <div className="bg-blue-50 border border-blue-100 p-6 rounded text-blue-900">
          <div className="flex items-center gap-3 mb-3">
            <Info className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold">Need Help?</h3>
          </div>
          <p className="text-sm text-blue-800 leading-relaxed mb-4">
            If you are unsure about which category to select, or if you encounter issues submitting your request, please contact the support desk directly or visit the student affairs office.
          </p>
          <div className="text-sm font-medium">
            support@calebuniversity.edu.ng
          </div>
        </div>
      </div>
    </div>
  )
}
