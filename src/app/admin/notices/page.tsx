'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { NOTICE_CATEGORIES } from '@/lib/constants'
import { formatDate } from '@/lib/utils'

interface Notice {
  id: string
  title: string
  category: string
  isPublished: boolean
  publishDate: string | null
  createdAt: string
  createdBy: { name: string }
}

export default function NoticesPage() {
  const router = useRouter()
  const [notices, setNotices] = useState<Notice[]>([])
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const fetchNotices = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (category) params.set('category', category)
      const res = await fetch(`/api/notices?${params}`)
      const data = await res.json()
      setNotices(data.notices)
    } catch {
      setError('Failed to load notices')
    } finally {
      setLoading(false)
    }
  }, [category])

  useEffect(() => {
    fetchNotices()
  }, [fetchNotices])

  async function handleTogglePublish(notice: Notice) {
    setTogglingId(notice.id)
    try {
      const res = await fetch(`/api/notices/${notice.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...notice, isPublished: !notice.isPublished }),
      })
      if (res.ok) {
        const { notice: updated } = await res.json()
        setNotices((prev) => prev.map((n) => (n.id === updated.id ? { ...n, isPublished: updated.isPublished } : n)))
      }
    } catch {
      setError('Failed to update notice')
    } finally {
      setTogglingId(null)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this notice?')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/notices/${id}`, { method: 'DELETE' })
      if (res.ok) setNotices((prev) => prev.filter((n) => n.id !== id))
      else setError('Failed to delete notice')
    } catch {
      setError('Failed to delete notice')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Notices</h1>
        <Link
          href="/admin/notices/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Notice
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">All Categories</option>
            {NOTICE_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Title</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Category</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Created By</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Date</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Status</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {notices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-400">No notices found</td>
                  </tr>
                ) : (
                  notices.map((notice) => (
                    <tr key={notice.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900 max-w-[280px] truncate">{notice.title}</td>
                      <td className="px-4 py-3 text-gray-600">{notice.category}</td>
                      <td className="px-4 py-3 text-gray-600">{notice.createdBy.name}</td>
                      <td className="px-4 py-3 text-gray-600">{formatDate(notice.createdAt)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${notice.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {notice.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleTogglePublish(notice)}
                            disabled={togglingId === notice.id}
                            className={`p-1.5 rounded ${notice.isPublished ? 'text-yellow-600 hover:bg-yellow-50' : 'text-green-600 hover:bg-green-50'}`}
                            title={notice.isPublished ? 'Unpublish' : 'Publish'}
                          >
                            {notice.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => router.push(`/admin/notices/${notice.id}/edit`)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(notice.id)}
                            disabled={deletingId === notice.id}
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
