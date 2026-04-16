'use client'

import { useState, useEffect, useCallback } from 'react'
import { formatDate } from '@/lib/utils'
import { Check, X } from 'lucide-react'

interface Admission {
  id: string
  applicantName: string
  fatherName: string
  class: string
  gender: string
  phone: string
  status: string
  appliedAt: string
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
}

export default function AdminAdmissionsPage() {
  const [admissions, setAdmissions] = useState<Admission[]>([])
  const [statusFilter, setStatusFilter] = useState('')
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const fetchAdmissions = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' })
      if (statusFilter) params.set('status', statusFilter)
      const res = await fetch(`/api/admissions?${params}`)
      const data = await res.json()
      setAdmissions(data.admissions)
      setTotal(data.total)
    } catch {
      setError('Failed to load admissions')
    } finally {
      setLoading(false)
    }
  }, [statusFilter, page])

  useEffect(() => {
    fetchAdmissions()
  }, [fetchAdmissions])

  async function updateStatus(id: string, status: string) {
    setUpdatingId(id)
    try {
      const res = await fetch(`/api/admissions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        setAdmissions((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status } : a))
        )
      }
    } catch {
      setError('Failed to update status')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Admissions</h1>
        <div className="text-sm text-gray-500">Total: {total}</div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b flex gap-3">
          {['', 'PENDING', 'APPROVED', 'REJECTED'].map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1) }}
              className={`px-4 py-1.5 text-sm rounded-full border transition-colors ${statusFilter === s ? 'bg-green-600 text-white border-green-600' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
            >
              {s || 'All'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-gray-600 font-medium">Applicant</th>
                    <th className="px-4 py-3 text-left text-gray-600 font-medium">Father&apos;s Name</th>
                    <th className="px-4 py-3 text-left text-gray-600 font-medium">Class</th>
                    <th className="px-4 py-3 text-left text-gray-600 font-medium">Gender</th>
                    <th className="px-4 py-3 text-left text-gray-600 font-medium">Phone</th>
                    <th className="px-4 py-3 text-left text-gray-600 font-medium">Applied</th>
                    <th className="px-4 py-3 text-left text-gray-600 font-medium">Status</th>
                    <th className="px-4 py-3 text-left text-gray-600 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {admissions.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-gray-400">No admissions found</td>
                    </tr>
                  ) : (
                    admissions.map((admission) => (
                      <tr key={admission.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{admission.applicantName}</td>
                        <td className="px-4 py-3 text-gray-600">{admission.fatherName}</td>
                        <td className="px-4 py-3 text-gray-600">{admission.class}</td>
                        <td className="px-4 py-3 text-gray-600">{admission.gender}</td>
                        <td className="px-4 py-3 text-gray-600">{admission.phone}</td>
                        <td className="px-4 py-3 text-gray-600">{formatDate(admission.appliedAt)}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[admission.status] || 'bg-gray-100 text-gray-600'}`}>
                            {admission.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {admission.status === 'PENDING' && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateStatus(admission.id, 'APPROVED')}
                                disabled={updatingId === admission.id}
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                                title="Approve"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => updateStatus(admission.id, 'REJECTED')}
                                disabled={updatingId === admission.id}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                title="Reject"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                          {admission.status !== 'PENDING' && (
                            <button
                              onClick={() => updateStatus(admission.id, 'PENDING')}
                              disabled={updatingId === admission.id}
                              className="text-xs text-gray-500 hover:underline"
                            >
                              Reset
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t flex items-center justify-between text-sm text-gray-600">
              <span>Showing page {page}</span>
              <div className="flex gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 border rounded disabled:opacity-40 hover:bg-gray-50">Previous</button>
                <button onClick={() => setPage((p) => p + 1)} disabled={page * 20 >= total} className="px-3 py-1 border rounded disabled:opacity-40 hover:bg-gray-50">Next</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
