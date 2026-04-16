'use client'

import { useState, useEffect, useCallback } from 'react'
import { formatDate } from '@/lib/utils'

interface VerificationLog {
  id: string
  verifiedAt: string
  ipAddress: string | null
  userAgent: string | null
  certificate: {
    certificateNo: string
    type: string
    student: {
      name: string
      admissionNo: string
    }
  }
}

export default function VerificationLogsPage() {
  const [logs, setLogs] = useState<VerificationLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const LIMIT = 20

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(LIMIT) })
      const res = await fetch(`/api/verification-logs?${params}`)
      const data = await res.json()
      setLogs(data.logs)
      setTotal(data.total)
    } catch {
      setError('Failed to load verification logs')
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  const typeColors: Record<string, string> = {
    TESTIMONIAL: 'bg-blue-100 text-blue-700',
    TRANSFER: 'bg-purple-100 text-purple-700',
    CHARACTER: 'bg-green-100 text-green-700',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Certificate Verification Logs</h1>
        <div className="text-sm text-gray-500">Total: {total} verifications</div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-gray-600 font-medium">Certificate No</th>
                    <th className="px-4 py-3 text-left text-gray-600 font-medium">Type</th>
                    <th className="px-4 py-3 text-left text-gray-600 font-medium">Student</th>
                    <th className="px-4 py-3 text-left text-gray-600 font-medium">Adm. No</th>
                    <th className="px-4 py-3 text-left text-gray-600 font-medium">Verified At</th>
                    <th className="px-4 py-3 text-left text-gray-600 font-medium">IP Address</th>
                    <th className="px-4 py-3 text-left text-gray-600 font-medium">User Agent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                        No verification logs found
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-xs text-gray-700">
                          {log.certificate.certificateNo}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              typeColors[log.certificate.type] || 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {log.certificate.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {log.certificate.student.name}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-600">
                          {log.certificate.student.admissionNo}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {new Date(log.verifiedAt).toLocaleString('en-BD')}
                        </td>
                        <td className="px-4 py-3 text-gray-600 font-mono text-xs">
                          {log.ipAddress || '-'}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs max-w-[200px] truncate">
                          {log.userAgent || '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t flex items-center justify-between text-sm text-gray-600">
              <span>Page {page} of {Math.ceil(total / LIMIT) || 1}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 border rounded disabled:opacity-40 hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page * LIMIT >= total}
                  className="px-3 py-1 border rounded disabled:opacity-40 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
