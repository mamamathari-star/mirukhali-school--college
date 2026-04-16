'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Search } from 'lucide-react'
import { CLASSES, EXAM_TYPES } from '@/lib/constants'
import { calculateGrade } from '@/lib/utils'

interface Student {
  id: string
  name: string
  admissionNo: string
  class: string
}

interface FormData {
  studentId: string
  examName: string
  class: string
  section: string
  subject: string
  marksObtained: string
  totalMarks: string
  year: string
}

const currentYear = new Date().getFullYear().toString()

const initialForm: FormData = {
  studentId: '',
  examName: '',
  class: '',
  section: '',
  subject: '',
  marksObtained: '',
  totalMarks: '100',
  year: currentYear,
}

export default function NewResultPage() {
  const router = useRouter()
  const [form, setForm] = useState<FormData>(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [studentSearch, setStudentSearch] = useState('')
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [searchLoading, setSearchLoading] = useState(false)
  const [grade, setGrade] = useState('')

  useEffect(() => {
    if (form.marksObtained && form.totalMarks) {
      const m = parseFloat(form.marksObtained)
      const t = parseFloat(form.totalMarks)
      if (!isNaN(m) && !isNaN(t) && t > 0) {
        setGrade(calculateGrade(m, t))
      }
    }
  }, [form.marksObtained, form.totalMarks])

  async function searchStudents(q: string) {
    if (!q.trim()) { setStudents([]); return }
    setSearchLoading(true)
    try {
      const res = await fetch(`/api/students?search=${encodeURIComponent(q)}&limit=10`)
      const data = await res.json()
      setStudents(data.students)
    } catch {
      /* ignore */
    } finally {
      setSearchLoading(false)
    }
  }

  function selectStudent(student: Student) {
    setSelectedStudent(student)
    setForm((prev) => ({ ...prev, studentId: student.id, class: student.class }))
    setStudents([])
    setStudentSearch(student.name + ' (' + student.admissionNo + ')')
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!form.studentId || !form.examName || !form.subject || !form.marksObtained || !form.year) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to add result')
      } else {
        setSuccess('Result added successfully!')
        setTimeout(() => router.push('/admin/results'), 1000)
      }
    } catch {
      setError('Failed to add result')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/results" className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Add Result</h1>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">{success}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-5">
        {/* Student Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Student <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={studentSearch}
              onChange={(e) => {
                setStudentSearch(e.target.value)
                setSelectedStudent(null)
                setForm((prev) => ({ ...prev, studentId: '' }))
                searchStudents(e.target.value)
              }}
              placeholder="Search student by name or admission no..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {(students.length > 0 || searchLoading) && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-auto">
                {searchLoading ? (
                  <div className="px-4 py-3 text-sm text-gray-500">Searching...</div>
                ) : (
                  students.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => selectStudent(s)}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between"
                    >
                      <span>{s.name}</span>
                      <span className="text-gray-400 text-xs">{s.admissionNo} · Class {s.class}</span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
          {selectedStudent && (
            <p className="text-xs text-green-600 mt-1">✓ Selected: {selectedStudent.name}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Exam <span className="text-red-500">*</span></label>
            <select name="examName" value={form.examName} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="">Select Exam</option>
              {EXAM_TYPES.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class <span className="text-red-500">*</span></label>
            <select name="class" value={form.class} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="">Select Class</option>
              {CLASSES.map((c) => <option key={c} value={c}>Class {c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
            <input type="text" name="section" value={form.section} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject <span className="text-red-500">*</span></label>
            <input type="text" name="subject" value={form.subject} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Marks Obtained <span className="text-red-500">*</span></label>
            <input type="number" name="marksObtained" value={form.marksObtained} onChange={handleChange} required min="0" step="0.5" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Marks <span className="text-red-500">*</span></label>
            <input type="number" name="totalMarks" value={form.totalMarks} onChange={handleChange} required min="1" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year <span className="text-red-500">*</span></label>
            <input type="text" name="year" value={form.year} onChange={handleChange} required placeholder="2024" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          {grade && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Auto Grade</label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-green-700">{grade}</div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={loading} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors">
            {loading ? 'Saving...' : 'Save Result'}
          </button>
          <Link href="/admin/results" className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Cancel</Link>
        </div>
      </form>
    </div>
  )
}
