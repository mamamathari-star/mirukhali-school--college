'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Search } from 'lucide-react'
import { generateCertificateNo } from '@/lib/utils'

interface Student {
  id: string
  name: string
  admissionNo: string
  class: string
}

interface FormData {
  type: string
  studentId: string
  issueDate: string
}

export default function NewCertificatePage() {
  const router = useRouter()
  const [form, setForm] = useState<FormData>({
    type: 'TESTIMONIAL',
    studentId: '',
    issueDate: new Date().toISOString().split('T')[0],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [studentSearch, setStudentSearch] = useState('')
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [searchLoading, setSearchLoading] = useState(false)

  const previewNo = generateCertificateNo(form.type)

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
    setForm((prev) => ({ ...prev, studentId: student.id }))
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

    if (!form.studentId || !form.type) {
      setError('Please select a student and certificate type')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to issue certificate')
      } else {
        setSuccess(`Certificate issued! No: ${data.certificate.certificateNo}`)
        setTimeout(() => router.push('/admin/certificates'), 1500)
      }
    } catch {
      setError('Failed to issue certificate')
    } finally {
      setLoading(false)
    }
  }

  const typeLabels: Record<string, string> = {
    TESTIMONIAL: 'Testimonial Certificate',
    TRANSFER: 'Transfer Certificate',
    CHARACTER: 'Character Certificate',
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/certificates" className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Issue Certificate</h1>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">{success}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Certificate Type <span className="text-red-500">*</span>
          </label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="TESTIMONIAL">Testimonial</option>
            <option value="TRANSFER">Transfer</option>
            <option value="CHARACTER">Character</option>
          </select>
        </div>

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
            <p className="text-xs text-green-600 mt-1">✓ Selected: {selectedStudent.name} ({selectedStudent.admissionNo})</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
          <input
            type="date"
            name="issueDate"
            value={form.issueDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 mb-1">Certificate Preview</p>
          <p className="font-semibold text-gray-800">{typeLabels[form.type]}</p>
          <p className="text-sm text-gray-600 mt-1">
            Certificate No: <span className="font-mono text-green-700">{previewNo}</span>
            <span className="text-xs text-gray-400 ml-2">(actual number will differ)</span>
          </p>
          {selectedStudent && (
            <p className="text-sm text-gray-600">Student: {selectedStudent.name} — Class {selectedStudent.class}</p>
          )}
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading || !form.studentId}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Issuing...' : 'Issue Certificate'}
          </button>
          <Link href="/admin/certificates" className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
