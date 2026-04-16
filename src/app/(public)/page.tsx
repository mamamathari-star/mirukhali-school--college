import type { Metadata } from 'next'
import Link from 'next/link'
import {
  BookOpen,
  Users,
  GraduationCap,
  Award,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  Microscope,
  Monitor,
  Library,
  Building2,
  Church,
  Dumbbell,
} from 'lucide-react'
import {
  SCHOOL_NAME,
  SCHOOL_NAME_BN,
  SCHOOL_ADDRESS,
  SCHOOL_PHONE,
  SCHOOL_EMAIL,
  SCHOOL_EIIN,
} from '@/lib/constants'

export const metadata: Metadata = {
  title: `${SCHOOL_NAME} | Official Website`,
  description:
    'Official website of Mirukhali School & College, EIIN 102726, Mirukhali, Mathbaria, Pirojpur, Bangladesh. Established in 1937.',
}

interface Notice {
  id: string
  title: string
  category: string
  createdAt: string
}

async function getLatestNotices(): Promise<Notice[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/notices?published=true&limit=5`, {
      next: { revalidate: 300 },
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.notices || []
  } catch {
    return []
  }
}

const stats = [
  { label: 'Students', value: '679', icon: GraduationCap, color: 'text-primary-700' },
  { label: 'Teachers', value: '13', icon: Users, color: 'text-accent-600' },
  { label: 'Established', value: '1937', icon: Award, color: 'text-primary-700' },
  { label: 'EIIN', value: SCHOOL_EIIN, icon: BookOpen, color: 'text-accent-600' },
]

const features = [
  {
    title: 'Rich Heritage',
    desc: 'Over 87 years of academic excellence serving the Mathbaria community since 1937.',
    icon: Award,
  },
  {
    title: 'Quality Education',
    desc: 'Curriculum aligned with the National Curriculum & Textbook Board (NCTB) standards.',
    icon: BookOpen,
  },
  {
    title: 'Experienced Teachers',
    desc: '13 dedicated and qualified teachers committed to nurturing every student\'s potential.',
    icon: Users,
  },
  {
    title: 'Modern Facilities',
    desc: 'Computer lab with 15 PCs, science laboratory, multimedia classrooms, and a library.',
    icon: Monitor,
  },
  {
    title: 'Co-Education',
    desc: 'An inclusive co-educational environment fostering equal opportunities for all students.',
    icon: GraduationCap,
  },
  {
    title: 'Extra-Curriculars',
    desc: 'Sports, scouting, debating club, and cultural activities for holistic development.',
    icon: Dumbbell,
  },
]

const facilities = [
  { name: 'Sports Field', icon: Dumbbell, desc: 'Large playground for sports and recreation' },
  { name: 'Mosque', icon: Church, desc: 'On-campus mosque for prayers' },
  { name: 'Hostel', icon: Building2, desc: 'Residential accommodation for students' },
  { name: 'Library', icon: Library, desc: 'Well-stocked library with diverse collection' },
  { name: 'Science Lab', icon: Microscope, desc: 'Fully equipped science laboratory' },
  { name: 'Computer Lab', icon: Monitor, desc: '15 PC computer lab with internet access' },
]

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

export default async function HomePage() {
  const notices = await getLatestNotices()

  return (
    <>
      {/* ── Hero Section ─────────────────────────────────────── */}
      <section className="relative min-h-[560px] flex items-center bg-gradient-to-br from-primary-800 via-primary-700 to-primary-600 overflow-hidden">
        {/* decorative circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-white/5" />
          <div className="absolute bottom-0 -left-20 w-80 h-80 rounded-full bg-white/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/10" />
        </div>

        <div className="container relative z-10 py-20">
          <div className="max-w-3xl">
            <p className="text-accent-300 text-sm font-semibold uppercase tracking-widest mb-3">
              Welcome to
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-2">
              {SCHOOL_NAME}
            </h1>
            <p className="text-2xl sm:text-3xl font-bold text-accent-300 mb-4">{SCHOOL_NAME_BN}</p>
            <p className="text-xl sm:text-2xl italic text-white/80 mb-6 font-light">
              &ldquo;শিক্ষাই জাতির মেরুদণ্ড&rdquo;
            </p>
            <p className="text-white/70 text-base sm:text-lg mb-8 max-w-xl">
              A premier MPO enlisted co-educational institution in Mathbaria, Pirojpur, Bangladesh.
              Shaping minds and building futures since 1 January 1937.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 bg-white text-primary-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
              >
                Learn More
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                href="/admission"
                className="inline-flex items-center gap-2 bg-accent-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent-500 transition-colors shadow-lg"
              >
                Apply for Admission
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ────────────────────────────────────────── */}
      <section className="bg-white shadow-md relative z-10">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center py-6 px-4 text-center">
                <stat.icon className={`h-7 w-7 mb-2 ${stat.color}`} />
                <span className="text-3xl font-extrabold text-gray-800">{stat.value}</span>
                <span className="text-sm text-gray-500 font-medium mt-0.5">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Welcome / About ──────────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-accent-600 font-semibold text-sm uppercase tracking-wider mb-2">
                About Us
              </p>
              <h2 className="section-title">Welcome to {SCHOOL_NAME}</h2>
              <div className="w-16 h-1 bg-accent-600 rounded mb-6" />
              <p className="text-gray-600 leading-relaxed mb-4">
                Mirukhali School &amp; College is a distinguished educational institution located in
                Mirukhali, Mathbaria, Pirojpur, Bangladesh. Founded on 1 January 1937 as an M.E.
                School, it has grown through decades of academic progress — achieving Junior
                Secondary recognition in 1962, High School status in 1967, and currently operating
                as a full School &amp; College offering both Secondary (SSC) and Higher Secondary
                (HSC) education.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                With a dedicated team of 13 teachers and 4 staff members, we proudly educate 679
                students in a nurturing co-educational environment. Our institution is MPO enlisted
                and committed to the highest standards of academic achievement, character
                development, and community service.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-primary-700 font-semibold hover:text-primary-800 transition-colors group"
              >
                Read more about us
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-800 to-primary-600 rounded-2xl p-8 text-white shadow-xl">
                <h3 className="text-xl font-bold mb-6 border-b border-white/20 pb-4">
                  Institution at a Glance
                </h3>
                <ul className="space-y-4">
                  {[
                    { label: 'Established', val: '1 January 1937' },
                    { label: 'EIIN', val: '102726' },
                    { label: 'Type', val: 'Private MPO Enlisted' },
                    { label: 'Category', val: 'Co-Education' },
                    { label: 'Location', val: 'Mirukhali, Mathbaria, Pirojpur' },
                    { label: 'Teachers', val: '13 (+ 4 Staff)' },
                    { label: 'Total Students', val: '679' },
                  ].map(({ label, val }) => (
                    <li key={label} className="flex justify-between text-sm">
                      <span className="text-white/70">{label}</span>
                      <span className="font-semibold text-accent-300">{val}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent-600 rounded-full opacity-20" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Academic Programs ─────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-accent-600 font-semibold text-sm uppercase tracking-wider mb-2">
              Programs Offered
            </p>
            <h2 className="section-title">Academic Programs</h2>
            <div className="w-16 h-1 bg-accent-600 rounded mx-auto mb-4" />
            <p className="section-subtitle max-w-xl mx-auto">
              Comprehensive secondary and higher secondary education following the national
              curriculum
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* SSC */}
            <div className="card p-6 border border-primary-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-primary-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Secondary (SSC)</h3>
              <p className="text-sm text-gray-500 mb-4">Class VI – X | Grade 6 to Grade 10</p>
              <ul className="space-y-2 text-sm text-gray-600">
                {['Science Group', 'Humanities Group', 'Business Studies Group'].map((g) => (
                  <li key={g} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-500 flex-shrink-0" />
                    {g}
                  </li>
                ))}
              </ul>
              <Link
                href="/academics"
                className="mt-5 inline-flex items-center gap-1 text-sm text-primary-700 font-semibold hover:text-primary-800"
              >
                View curriculum <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            {/* HSC */}
            <div className="card p-6 border border-accent-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-accent-100 flex items-center justify-center mb-4">
                <GraduationCap className="h-6 w-6 text-accent-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Higher Secondary (HSC)</h3>
              <p className="text-sm text-gray-500 mb-4">Class XI – XII | Grade 11 to Grade 12</p>
              <ul className="space-y-2 text-sm text-gray-600">
                {['Science Group', 'Humanities Group', 'Business Studies Group'].map((g) => (
                  <li key={g} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-500 flex-shrink-0" />
                    {g}
                  </li>
                ))}
              </ul>
              <Link
                href="/academics"
                className="mt-5 inline-flex items-center gap-1 text-sm text-accent-700 font-semibold hover:text-accent-800"
              >
                View curriculum <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Notice Board ─────────────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-accent-600 font-semibold text-sm uppercase tracking-wider mb-1">
                Latest Updates
              </p>
              <h2 className="section-title mb-0">Notice Board</h2>
            </div>
            <Link
              href="/notices"
              className="inline-flex items-center gap-1 text-sm text-primary-700 font-semibold hover:text-primary-800 transition-colors group"
            >
              View All
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {notices.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
              <BookOpen className="h-10 w-10 mx-auto mb-3 text-gray-300" />
              <p>No notices published yet. Check back soon.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notices.map((notice) => (
                <Link
                  key={notice.id}
                  href={`/notices/${notice.id}`}
                  className="flex items-start sm:items-center gap-4 bg-white rounded-xl border border-gray-200 p-4 hover:border-primary-300 hover:shadow-sm transition-all group"
                >
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${
                      categoryColors[notice.category] ?? 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {notice.category}
                  </span>
                  <span className="flex-1 text-sm font-medium text-gray-800 group-hover:text-primary-700 transition-colors">
                    {notice.title}
                  </span>
                  <span className="text-xs text-gray-400 flex-shrink-0 hidden sm:block">
                    {new Date(notice.createdAt).toLocaleDateString('en-BD', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-primary-600 flex-shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Why Choose Us ────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-accent-600 font-semibold text-sm uppercase tracking-wider mb-2">
              Our Strengths
            </p>
            <h2 className="section-title">Why Choose Us?</h2>
            <div className="w-16 h-1 bg-accent-600 rounded mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="group p-6 rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all bg-gray-50 hover:bg-white"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-100 group-hover:bg-primary-800 flex items-center justify-center mb-4 transition-colors">
                  <f.icon className="h-6 w-6 text-primary-700 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-base font-bold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Facilities Section ───────────────────────────────── */}
      <section className="py-16 bg-gradient-to-br from-primary-800 to-primary-900">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-accent-300 font-semibold text-sm uppercase tracking-wider mb-2">
              Campus Life
            </p>
            <h2 className="text-3xl font-bold text-white mb-2">Our Facilities</h2>
            <div className="w-16 h-1 bg-accent-600 rounded mx-auto" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {facilities.map((f) => (
              <div
                key={f.name}
                className="flex flex-col items-center text-center p-5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors cursor-default"
              >
                <f.icon className="h-8 w-8 text-accent-300 mb-3" />
                <h3 className="text-sm font-semibold text-white">{f.name}</h3>
                <p className="text-xs text-white/60 mt-1 leading-tight">{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/facilities"
              className="inline-flex items-center gap-2 bg-accent-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent-500 transition-colors"
            >
              Explore All Facilities
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Contact CTA ──────────────────────────────────────── */}
      <section className="py-14 bg-white">
        <div className="container">
          <div className="bg-gradient-to-r from-accent-600 to-accent-500 rounded-2xl p-8 sm:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  Get in Touch With Us
                </h2>
                <p className="text-white/80 mb-6">
                  Have questions about admission or academics? We&apos;re here to help.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-white/90 text-sm">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span>{SCHOOL_ADDRESS}</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/90 text-sm">
                    <Phone className="h-4 w-4 flex-shrink-0" />
                    <a href={`tel:${SCHOOL_PHONE}`} className="hover:text-white">
                      {SCHOOL_PHONE}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-white/90 text-sm">
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <a href={`mailto:${SCHOOL_EMAIL}`} className="hover:text-white">
                      {SCHOOL_EMAIL}
                    </a>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 lg:justify-end">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-white text-accent-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow"
                >
                  Contact Us
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/admission"
                  className="inline-flex items-center gap-2 bg-primary-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow"
                >
                  Apply Now
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
