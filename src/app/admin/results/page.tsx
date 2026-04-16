'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { CLASSES, EXAM_TYPES } from '@/lib/constants'

interface Result {
  id: string
  examName: string
  class: string
  section: string | null
  subject: string
  marksObtained: number
  totalMarks: number
  grade: string | null
  year: string
  student: { name: string; admissionNo: string }
}

export default function ResultsPage() {
  const router = useRouter()
  const [results, setResults] = useState<Result[]>([])
  const [classFilter, setClassFilter] = useState('')
  const [examFilter, setExamFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchResults = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (classFilter) params.set('class', classFilter)
      if (examFilter) params.set('examName', examFilter)
      const res = await fetch(`/api/results?${params}`)
      const data = await res.json()
      setResults(data.results)
    } catch {
      setError('Failed to load results')
    } finally {
      setLoading(false)
    }
  }, [classFilter, examFilter])

  useEffect(() => {
    fetchResults()
  }, [fetchResults])

  async function handleDelete(id: string) {
    if (!confirm('Delete this result?')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/results/${id}`, { method: 'DELETE' })
      if (res.ok) setResults((prev) => prev.filter((r) => r.id !== id))
      else setError('Failed to delete result')
    } catch {
      setError('Failed to delete result')
    } finally {
      setDeletingId(null)
    }
  }

  const gradeColors: Record<string, string> = {
    'A+': 'bg-green-100 text-green-800',
    A: 'bg-blue-100 text-blue-800',
    'A-': 'bg-cyan-100 text-cyan-800',
    B: 'bg-yellow-100 text-yellow-800',
    C: 'bg-orange-100 text-orange-800',
    D: 'bg-red-100 text-red-800',
    F: 'bg-red-200 text-red-900',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Results</h1>
        <Link
          href="/admin/results/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Result
        </Link>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b flex flex-wrap gap-3">
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">All Classes</option>
            {CLASSES.map((c) => <option key={c} value={c}>Class {c}</option>)}
          </select>
          <select
            value={examFilter}
            onChange={(e) => setExamFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">All Exams</option>
            {EXAM_TYPES.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Student</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Adm. No</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Exam</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Class</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Subject</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Marks</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Grade</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Year</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {results.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-gray-400">No results found</td>
                  </tr>
                ) : (
                  results.map((result) => (
                    <tr key={result.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{result.student.name}</td>
                      <td className="px-4 py-3 font-mono text-gray-600">{result.student.admissionNo}</td>
                      <td className="px-4 py-3 text-gray-600">{result.examName}</td>
                      <td className="px-4 py-3 text-gray-600">{result.class}</td>
                      <td className="px-4 py-3 text-gray-600">{result.subject}</td>
                      <td className="px-4 py-3 text-gray-600">{result.marksObtained}/{result.totalMarks}</td>
                      <td className="px-4 py-3">
                        {result.grade && (
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${gradeColors[result.grade] || 'bg-gray-100 text-gray-700'}`}>
                            {result.grade}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{result.year}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => router.push(`/admin/results/${result.id}/edit`)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(result.id)}
                            disabled={deletingId === result.id}
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
