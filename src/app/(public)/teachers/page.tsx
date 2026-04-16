import type { Metadata } from 'next'
import { SCHOOL_NAME } from '@/lib/constants'
import { Users, Mail, Phone, User } from 'lucide-react'

export const metadata: Metadata = {
  title: `Our Teachers | ${SCHOOL_NAME}`,
  description: 'Meet the dedicated teaching staff of Mirukhali School & College.',
}

interface Teacher {
  id: string
  name: string
  designation: string
  subject: string
  qualification: string
  photo: string | null
  email: string | null
  phone: string | null
}

async function getTeachers(): Promise<Teacher[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/teachers`, {
      cache: 'no-store',
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.teachers || []
  } catch {
    return []
  }
}

const avatarColors = [
  'bg-primary-700',
  'bg-accent-600',
  'bg-blue-600',
  'bg-purple-600',
  'bg-teal-600',
  'bg-rose-600',
]

export default async function TeachersPage() {
  const teachers = await getTeachers()

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-800 to-primary-600 py-16">
        <div className="container">
          <div className="max-w-3xl">
            <p className="text-accent-300 text-sm font-semibold uppercase tracking-widest mb-2">
              Our Team
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">Our Teachers</h1>
            <p className="text-white/70 text-lg">
              Meet the dedicated educators who inspire and guide our students every day.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title mb-0">Teaching Staff</h2>
              <p className="text-gray-500 text-sm mt-1">
                {teachers.length > 0
                  ? `${teachers.length} teacher${teachers.length !== 1 ? 's' : ''} on staff`
                  : 'Loading staff information…'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary-700" />
            </div>
          </div>

          {teachers.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Users className="h-10 w-10 text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Teachers Found</h3>
              <p className="text-gray-400 text-sm max-w-xs mx-auto">
                Teacher profiles will appear here once they are added by the administration.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {teachers.map((teacher, idx) => {
                const initials = teacher.name
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()
                const colorClass = avatarColors[idx % avatarColors.length]
                return (
                  <div
                    key={teacher.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group"
                  >
                    {/* Avatar / Photo */}
                    <div className="relative h-36 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
                      {teacher.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={teacher.photo}
                          alt={teacher.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div
                          className={`w-20 h-20 rounded-full ${colorClass} flex items-center justify-center text-white text-2xl font-bold shadow-md`}
                        >
                          {initials || <User className="h-8 w-8" />}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="font-bold text-gray-800 text-base leading-tight mb-0.5">
                        {teacher.name}
                      </h3>
                      <p className="text-xs font-semibold text-primary-700 mb-1">
                        {teacher.designation}
                      </p>
                      {teacher.subject && (
                        <p className="text-xs text-gray-500 mb-2">
                          <span className="font-medium text-gray-600">Subject:</span>{' '}
                          {teacher.subject}
                        </p>
                      )}
                      {teacher.qualification && (
                        <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                          <span className="font-medium text-gray-600">Qualification:</span>{' '}
                          {teacher.qualification}
                        </p>
                      )}
                      {(teacher.email || teacher.phone) && (
                        <div className="border-t border-gray-100 pt-3 space-y-1.5">
                          {teacher.email && (
                            <a
                              href={`mailto:${teacher.email}`}
                              className="flex items-center gap-2 text-xs text-gray-500 hover:text-primary-700 transition-colors"
                            >
                              <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                              <span className="truncate">{teacher.email}</span>
                            </a>
                          )}
                          {teacher.phone && (
                            <a
                              href={`tel:${teacher.phone}`}
                              className="flex items-center gap-2 text-xs text-gray-500 hover:text-primary-700 transition-colors"
                            >
                              <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                              <span>{teacher.phone}</span>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
