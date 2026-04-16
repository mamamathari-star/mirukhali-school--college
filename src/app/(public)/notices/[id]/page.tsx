import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SCHOOL_NAME } from '@/lib/constants'
import { ArrowLeft, Calendar, Tag, Paperclip } from 'lucide-react'

interface Notice {
  id: string
  title: string
  category: string
  content: string
  attachments: string[]
  createdAt: string
  publishedAt: string | null
  isPublished: boolean
}

async function getNotice(id: string): Promise<Notice | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/notices/${id}`, {
      next: { revalidate: 120 },
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.notice || null
  } catch {
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  const notice = await getNotice(params.id)
  return {
    title: notice ? `${notice.title} | ${SCHOOL_NAME}` : `Notice | ${SCHOOL_NAME}`,
    description: notice?.content?.slice(0, 160) ?? 'Notice from Mirukhali School & College.',
  }
}

const categoryColors: Record<string, string> = {
  Examination: 'bg-red-100 text-red-700',
  Admission: 'bg-blue-100 text-blue-700',
  Holiday: 'bg-yellow-100 text-yellow-700',
  Result: 'bg-green-100 text-green-700',
  Event: 'bg-purple-100 text-purple-700',
  General: 'bg-gray-100 text-gray-700',
  Scholarship: 'bg-indigo-100 text-indigo-700',
  Sports: 'bg-orange-100 text-orange-700',
}

export default async function NoticeDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const notice = await getNotice(params.id)

  if (!notice || !notice.isPublished) {
    notFound()
  }

  const attachments: string[] = Array.isArray(notice.attachments) ? notice.attachments : []

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-800 to-primary-600 py-12">
        <div className="container">
          <Link
            href="/notices"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Notice Board
          </Link>
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  categoryColors[notice.category] ?? 'bg-white/20 text-white'
                }`}
              >
                {notice.category}
              </span>
              <span className="flex items-center gap-1.5 text-white/60 text-xs">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(notice.createdAt).toLocaleDateString('en-BD', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              {notice.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 bg-gray-50">
        <div className="container max-w-4xl">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Meta bar */}
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 flex flex-wrap items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5" />
                Category: <strong className="text-gray-700">{notice.category}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Published:{' '}
                <strong className="text-gray-700">
                  {new Date(notice.publishedAt || notice.createdAt).toLocaleDateString('en-BD', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </strong>
              </span>
            </div>

            {/* Body */}
            <div className="p-6 sm:p-8">
              <div className="prose prose-sm sm:prose max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                {notice.content}
              </div>
            </div>

            {/* Attachments */}
            {attachments.length > 0 && (
              <div className="px-6 pb-6 sm:px-8 sm:pb-8 border-t border-gray-100 pt-5 mt-2">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Paperclip className="h-4 w-4 text-accent-600" />
                  Attachments
                </h3>
                <ul className="space-y-2">
                  {attachments.map((url, i) => (
                    <li key={i}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-primary-700 hover:text-primary-800 hover:underline transition-colors"
                      >
                        <Paperclip className="h-3.5 w-3.5" />
                        Attachment {i + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Back link */}
          <div className="mt-6">
            <Link
              href="/notices"
              className="inline-flex items-center gap-2 text-sm text-primary-700 font-semibold hover:text-primary-800 transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to all notices
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
