import type { Metadata } from 'next'
import Link from 'next/link'
import { SCHOOL_NAME, NOTICE_CATEGORIES } from '@/lib/constants'
import { Bell, ChevronRight, Calendar } from 'lucide-react'

export const metadata: Metadata = {
  title: `Notice Board | ${SCHOOL_NAME}`,
  description: 'Latest notices, announcements and updates from Mirukhali School & College.',
}

interface Notice {
  id: string
  title: string
  category: string
  content: string
  createdAt: string
  publishedAt: string | null
}

async function getNotices(category?: string): Promise<Notice[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const params = new URLSearchParams({ published: 'true', limit: '30' })
    if (category && category !== 'All') params.set('category', category)
    const res = await fetch(`${baseUrl}/api/notices?${params.toString()}`, {
      next: { revalidate: 120 },
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.notices || []
  } catch {
    return []
  }
}

const categoryColors: Record<string, string> = {
  Examination: 'bg-red-100 text-red-700 border-red-200',
  Admission: 'bg-blue-100 text-blue-700 border-blue-200',
  Holiday: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Result: 'bg-green-100 text-green-700 border-green-200',
  Event: 'bg-purple-100 text-purple-700 border-purple-200',
  General: 'bg-gray-100 text-gray-700 border-gray-200',
  Scholarship: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  Sports: 'bg-orange-100 text-orange-700 border-orange-200',
}

export default async function NoticesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const activeCategory = category || 'All'
  const notices = await getNotices(activeCategory)
  const categories = ['All', ...NOTICE_CATEGORIES]

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-800 to-primary-600 py-16">
        <div className="container">
          <div className="max-w-3xl">
            <p className="text-accent-300 text-sm font-semibold uppercase tracking-widest mb-2">
              Updates
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">Notice Board</h1>
            <p className="text-white/70 text-lg">
              Stay informed with the latest announcements, exam schedules, and important updates
              from Mirukhali School &amp; College.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50 min-h-[60vh]">
        <div className="container">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={cat === 'All' ? '/notices' : `/notices?category=${encodeURIComponent(cat)}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                  activeCategory === cat
                    ? 'bg-primary-800 text-white border-primary-800 shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:text-primary-700'
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>

          {notices.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
              <Bell className="h-12 w-12 mx-auto mb-4 text-gray-200" />
              <h3 className="text-lg font-semibold text-gray-500 mb-2">No Notices Found</h3>
              <p className="text-sm text-gray-400">
                {activeCategory === 'All'
                  ? 'No published notices yet.'
                  : `No notices in the "${activeCategory}" category.`}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notices.map((notice) => (
                <Link
                  key={notice.id}
                  href={`/notices/${notice.id}`}
                  className="flex items-start sm:items-center gap-4 bg-white rounded-xl border border-gray-200 p-4 hover:border-primary-300 hover:shadow-md transition-all group"
                >
                  {/* Category badge */}
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 border ${
                      categoryColors[notice.category] ?? 'bg-gray-100 text-gray-600 border-gray-200'
                    }`}
                  >
                    {notice.category}
                  </span>

                  {/* Title */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-800 group-hover:text-primary-700 transition-colors truncate">
                      {notice.title}
                    </h3>
                    {notice.content && (
                      <p className="text-xs text-gray-400 mt-0.5 truncate">{notice.content.slice(0, 80)}{notice.content.length > 80 ? '…' : ''}</p>
                    )}
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 flex-shrink-0 hidden sm:flex">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(notice.createdAt).toLocaleDateString('en-BD', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>

                  <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-primary-600 flex-shrink-0 transition-colors" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
