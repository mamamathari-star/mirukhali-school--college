'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Trash2, ShieldOff, ShieldCheck } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Certificate {
  id: string
  certificateNo: string
  type: string
  issueDate: string
  isRevoked: boolean
  student: { name: string; admissionNo: string; class: string }
  issuedBy: { name: string }
}

export default function CertificatesPage() {
  const router = useRouter()
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [typeFilter, setTypeFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [revokingId, setRevokingId] = useState<string | null>(null)

  const fetchCerts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (typeFilter) params.set('type', typeFilter)
      const res = await fetch(`/api/certificates?${params}`)
      const data = await res.json()
      setCertificates(data.certificates)
    } catch {
      setError('Failed to load certificates')
    } finally {
      setLoading(false)
    }
  }, [typeFilter])

  useEffect(() => {
    fetchCerts()
  }, [fetchCerts])

  async function handleRevoke(cert: Certificate) {
    const action = cert.isRevoked ? 'reinstate' : 'revoke'
    if (!confirm(`Are you sure you want to ${action} this certificate?`)) return
    setRevokingId(cert.id)
    try {
      const res = await fetch(`/api/certificates/${cert.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRevoked: !cert.isRevoked }),
      })
      if (res.ok) {
        setCertificates((prev) =>
          prev.map((c) => (c.id === cert.id ? { ...c, isRevoked: !c.isRevoked } : c))
        )
      }
    } catch {
      setError('Failed to update certificate')
    } finally {
      setRevokingId(null)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this certificate permanently?')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/certificates/${id}`, { method: 'DELETE' })
      if (res.ok) setCertificates((prev) => prev.filter((c) => c.id !== id))
      else setError('Failed to delete certificate')
    } catch {
      setError('Failed to delete certificate')
    } finally {
      setDeletingId(null)
    }
  }

  const typeColors: Record<string, string> = {
    TESTIMONIAL: 'bg-blue-100 text-blue-700',
    TRANSFER: 'bg-purple-100 text-purple-700',
    CHARACTER: 'bg-green-100 text-green-700',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Certificates</h1>
        <Link
          href="/admin/certificates/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Issue Certificate
        </Link>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">All Types</option>
            <option value="TESTIMONIAL">Testimonial</option>
            <option value="TRANSFER">Transfer</option>
            <option value="CHARACTER">Character</option>
          </select>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Cert No</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Type</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Student</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Class</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Issue Date</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Issued By</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Status</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {certificates.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-400">No certificates found</td>
                  </tr>
                ) : (
                  certificates.map((cert) => (
                    <tr key={cert.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs text-gray-700">{cert.certificateNo}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[cert.type] || 'bg-gray-100 text-gray-700'}`}>
                          {cert.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">{cert.student.name}</td>
                      <td className="px-4 py-3 text-gray-600">{cert.student.class}</td>
                      <td className="px-4 py-3 text-gray-600">{formatDate(cert.issueDate)}</td>
                      <td className="px-4 py-3 text-gray-600">{cert.issuedBy.name}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${cert.isRevoked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {cert.isRevoked ? 'Revoked' : 'Valid'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleRevoke(cert)}
                            disabled={revokingId === cert.id}
                            className={`p-1.5 rounded ${cert.isRevoked ? 'text-green-600 hover:bg-green-50' : 'text-orange-600 hover:bg-orange-50'}`}
                            title={cert.isRevoked ? 'Reinstate' : 'Revoke'}
                          >
                            {cert.isRevoked ? <ShieldCheck className="w-4 h-4" /> : <ShieldOff className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleDelete(cert.id)}
                            disabled={deletingId === cert.id}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
