'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Search, ToggleLeft, ToggleRight } from 'lucide-react'

interface Teacher {
  id: string
  name: string
  designation: string
  subject: string
  qualification: string
  phone: string
  email: string | null
  isActive: boolean
  order: number
  joinDate: string
}

export default function TeachersPage() {
  const router = useRouter()
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [filtered, setFiltered] = useState<Teacher[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const fetchTeachers = useCallback(async () => {
    try {
      const res = await fetch('/api/teachers')
      const data = await res.json()
      setTeachers(data.teachers)
      setFiltered(data.teachers)
    } catch {
      setError('Failed to load teachers')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTeachers()
  }, [fetchTeachers])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(teachers.filter((t) => t.name.toLowerCase().includes(q)))
  }, [search, teachers])

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this teacher?')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/teachers/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setTeachers((prev) => prev.filter((t) => t.id !== id))
      } else {
        setError('Failed to delete teacher')
      }
    } catch {
      setError('Failed to delete teacher')
    } finally {
      setDeletingId(null)
    }
  }

  async function handleToggleActive(teacher: Teacher) {
    setTogglingId(teacher.id)
    try {
      const res = await fetch(`/api/teachers/${teacher.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...teacher, isActive: !teacher.isActive }),
      })
      if (res.ok) {
        const { teacher: updated } = await res.json()
        setTeachers((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
      }
    } catch {
      setError('Failed to update teacher')
    } finally {
      setTogglingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Teachers</h1>
        <Link
          href="/admin/teachers/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New Teacher
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">#</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Name</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Designation</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Subject</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Phone</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Status</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                      No teachers found
                    </td>
                  </tr>
                ) : (
                  filtered.map((teacher, idx) => (
                    <tr key={teacher.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-500">{idx + 1}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{teacher.name}</td>
                      <td className="px-4 py-3 text-gray-600">{teacher.designation}</td>
                      <td className="px-4 py-3 text-gray-600">{teacher.subject}</td>
                      <td className="px-4 py-3 text-gray-600">{teacher.phone}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleActive(teacher)}
                          disabled={togglingId === teacher.id}
                          className="flex items-center gap-1 text-sm"
                          title="Toggle active status"
                        >
                          {teacher.isActive ? (
                            <ToggleRight className="w-5 h-5 text-green-500" />
                          ) : (
                            <ToggleLeft className="w-5 h-5 text-gray-400" />
                          )}
                          <span
                            className={teacher.isActive ? 'text-green-600' : 'text-gray-500'}
                          >
                            {teacher.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => router.push(`/admin/teachers/${teacher.id}/edit`)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(teacher.id)}
                            disabled={deletingId === teacher.id}
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
