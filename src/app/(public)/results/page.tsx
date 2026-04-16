'use client'

import type { Metadata } from 'next'
import { useState } from 'react'
import { SCHOOL_NAME, CLASSES, EXAM_TYPES } from '@/lib/constants'
import { Search, FileText, User, Hash, BookOpen, Calendar } from 'lucide-react'

// Metadata can't be used in client components — declared here for reference:
// export const metadata: Metadata = { title: `Exam Results | ${SCHOOL_NAME}` }

interface ResultRow {
  id: string
  studentName: string
  admissionNo: string
  className: string
  examName: string
  year: string
  subjects: Array<{ subject: string; marks: number; grade: string }>
  totalMarks: number
  gpa: number
  grade: string
  position: number | null
}

interface SearchState {
  studentName: string
  admissionNo: string
  examName: string
  className: string
  year: string
}

export default function ResultsPage() {
  const [form, setForm] = useState<SearchState>({
    studentName: '',
    admissionNo: '',
    examName: '',
    className: '',
    year: new Date().getFullYear().toString(),
  })
  const [results, setResults] = useState<ResultRow[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState('')

  const years = Array.from({ length: 10 }, (_, i) =>
    (new Date().getFullYear() - i).toString()
  )

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!form.admissionNo && !form.studentName) {
      setError('Please enter a Student Name or Admission Number to search.')
      return
    }
    setError('')
    setLoading(true)
    setSearched(false)
    try {
      const params = new URLSearchParams()
      if (form.admissionNo) params.set('admissionNo', form.admissionNo)
      if (form.studentName) params.set('studentName', form.studentName)
      if (form.examName) params.set('examName', form.examName)
      if (form.className) params.set('className', form.className)
      if (form.year) params.set('year', form.year)

      const res = await fetch(`/api/results?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch results')
      const data = await res.json()
      setResults(data.results || [])
    } catch {
      setError('Failed to fetch results. Please try again.')
      setResults([])
    } finally {
      setLoading(false)
      setSearched(true)
    }
  }

  const gradeColor = (g: string) => {
    if (g === 'A+') return 'text-green-700 bg-green-100'
    if (g === 'A') return 'text-teal-700 bg-teal-100'
    if (g === 'A-') return 'text-blue-700 bg-blue-100'
    if (g === 'B') return 'text-indigo-700 bg-indigo-100'
    if (g === 'C') return 'text-yellow-700 bg-yellow-100'
    if (g === 'D') return 'text-orange-700 bg-orange-100'
    return 'text-red-700 bg-red-100'
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-800 to-primary-600 py-16">
        <div className="container">
          <div className="max-w-3xl">
            <p className="text-accent-300 text-sm font-semibold uppercase tracking-widest mb-2">
              Academic Performance
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">Exam Results</h1>
            <p className="text-white/70 text-lg">
              Search for examination results using your admission number or name.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50 min-h-[60vh]">
        <div className="container max-w-3xl">
          {/* Search Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
              <Search className="h-5 w-5 text-primary-700" />
              Search Results
            </h2>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Admission No */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Admission Number
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="e.g. 20231001"
                      value={form.admissionNo}
                      onChange={(e) => setForm((f) => ({ ...f, admissionNo: e.target.value }))}
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Student Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Student Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Full name"
                      value={form.studentName}
                      onChange={(e) => setForm((f) => ({ ...f, studentName: e.target.value }))}
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Exam Type */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Examination Type
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <select
                      value={form.examName}
                      onChange={(e) => setForm((f) => ({ ...f, examName: e.target.value }))}
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white appearance-none"
                    >
                      <option value="">All Exams</option>
                      {EXAM_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Class */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Class
                  </label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <select
                      value={form.className}
                      onChange={(e) => setForm((f) => ({ ...f, className: e.target.value }))}
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white appearance-none"
                    >
                      <option value="">All Classes</option>
                      {CLASSES.map((c) => (
                        <option key={c} value={c}>Class {c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Year */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Year
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <select
                      value={form.year}
                      onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white appearance-none"
                    >
                      {years.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto btn-primary flex items-center justify-center gap-2 px-8 py-3 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Searching…
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    Search Results
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results */}
          {!searched && !loading && (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
              <FileText className="h-14 w-14 mx-auto mb-4 text-gray-200" />
              <h3 className="text-lg font-semibold text-gray-500 mb-2">Search for Results</h3>
              <p className="text-sm text-gray-400">
                Enter your admission number or name above to view your results.
              </p>
            </div>
          )}

          {searched && results.length === 0 && !loading && (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
              <Search className="h-14 w-14 mx-auto mb-4 text-gray-200" />
              <h3 className="text-lg font-semibold text-gray-500 mb-2">No Results Found</h3>
              <p className="text-sm text-gray-400">
                No records matched your search criteria. Please verify your details and try again.
              </p>
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-6">
              {results.map((result) => (
                <div
                  key={result.id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
                >
                  {/* Result header */}
                  <div className="bg-primary-800 px-6 py-4 text-white flex flex-wrap gap-4 justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold">{result.studentName}</h3>
                      <p className="text-white/70 text-sm">
                        Admission No: {result.admissionNo} &bull; Class {result.className}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/70 text-xs">{result.examName} – {result.year}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-sm font-bold px-3 py-0.5 rounded-full ${gradeColor(result.grade)}`}>
                          {result.grade}
                        </span>
                        <span className="text-white font-bold text-sm">GPA: {result.gpa.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Subject table */}
                  {result.subjects && result.subjects.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Subject</th>
                            <th className="px-4 py-2.5 text-center text-xs font-semibold text-gray-500 uppercase">Marks</th>
                            <th className="px-4 py-2.5 text-center text-xs font-semibold text-gray-500 uppercase">Grade</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.subjects.map((sub, i) => (
                            <tr key={i} className={i % 2 === 0 ? '' : 'bg-gray-50'}>
                              <td className="px-4 py-2.5 text-gray-700">{sub.subject}</td>
                              <td className="px-4 py-2.5 text-center text-gray-600">{sub.marks}</td>
                              <td className="px-4 py-2.5 text-center">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${gradeColor(sub.grade)}`}>
                                  {sub.grade}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="border-t border-gray-200 font-semibold">
                            <td className="px-4 py-2.5 text-gray-700">Total</td>
                            <td className="px-4 py-2.5 text-center text-primary-700">{result.totalMarks}</td>
                            <td className="px-4 py-2.5 text-center">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${gradeColor(result.grade)}`}>
                                {result.grade}
                              </span>
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}

                  {result.position && (
                    <div className="px-6 py-3 bg-accent-50 border-t border-accent-100 text-sm text-accent-700 font-medium">
                      🏆 Position in Class: #{result.position}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
