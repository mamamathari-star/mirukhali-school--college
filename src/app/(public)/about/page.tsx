import type { Metadata } from 'next'
import { SCHOOL_NAME } from '@/lib/constants'
import { Award, MapPin, Target, Eye, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: `About Us | ${SCHOOL_NAME}`,
  description:
    'Learn about the history, mission, vision, and achievements of Mirukhali School & College established in 1937.',
}

const timeline = [
  {
    year: '1937',
    title: 'M.E. School Founded',
    desc: 'Mirukhali School was established as an M.E. (Middle English) School on 1 January 1937, serving the local community of Mathbaria, Pirojpur.',
    color: 'bg-primary-800',
  },
  {
    year: '1962',
    title: 'Junior Secondary Recognition',
    desc: 'The institution received recognition as a Junior Secondary School, expanding its educational scope to Classes VI–VIII.',
    color: 'bg-primary-700',
  },
  {
    year: '1967',
    title: 'High School Status',
    desc: 'The school achieved Full High School status with recognition up to Class X, enabling students to appear in the SSC examination.',
    color: 'bg-accent-600',
  },
  {
    year: 'Present',
    title: 'School & College – Higher Secondary',
    desc: 'Now operating as a full School & College, offering education from Class VI through XII, covering both SSC and HSC programs under the national curriculum.',
    color: 'bg-primary-600',
  },
]

const achievements = [
  'MPO enlisted institution with government recognition',
  'Consistent SSC and HSC pass rates above district average',
  'Active sports teams with district-level tournament participation',
  'Fully operational science and computer laboratories',
  'Student scouting unit with national level participation',
  'Regular cultural events and inter-school competitions',
]

export default function AboutPage() {
  return (
    <>
      {/* Page Hero */}
      <section className="bg-gradient-to-br from-primary-800 to-primary-600 py-16">
        <div className="container">
          <div className="max-w-3xl">
            <p className="text-accent-300 text-sm font-semibold uppercase tracking-widest mb-2">
              Our Story
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">About Us</h1>
            <p className="text-white/70 text-lg">
              Discover the rich history and enduring legacy of Mirukhali School &amp; College — a
              cornerstone of education in Mathbaria, Pirojpur since 1937.
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-accent-600 font-semibold text-sm uppercase tracking-wider mb-2">
                Who We Are
              </p>
              <h2 className="section-title">A Legacy of Excellence</h2>
              <div className="w-16 h-1 bg-accent-600 rounded mb-6" />
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Mirukhali School &amp; College (মিরুখালী স্কুল এন্ড কলেজ) is a distinguished
                  co-educational institution situated in Mirukhali village, Mathbaria Upazila,
                  Pirojpur District, Bangladesh. With EIIN 102726, the institution is MPO enlisted
                  and operates under the auspices of the Bangladesh national education system.
                </p>
                <p>
                  Founded on 1 January 1937, the institution began as a Middle English (M.E.)
                  School, gradually expanding its educational offerings over the decades. Today, it
                  serves 679 students from Class VI through Class XII under the guidance of 13
                  qualified teachers and 4 support staff.
                </p>
                <p>
                  The institution has long been a beacon of educational opportunity for the rural
                  communities of Mathbaria and surrounding areas, providing accessible, quality
                  education in a nurturing environment.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-primary-50 border border-primary-100 rounded-2xl p-6">
                <h3 className="font-bold text-primary-800 text-lg mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-accent-600" />
                  Quick Facts
                </h3>
                <dl className="space-y-3">
                  {[
                    { dt: 'Full Name', dd: 'Mirukhali School & College' },
                    { dt: 'Bengali Name', dd: 'মিরুখালী স্কুল এন্ড কলেজ' },
                    { dt: 'EIIN', dd: '102726' },
                    { dt: 'Established', dd: '1 January 1937' },
                    { dt: 'Location', dd: 'Mirukhali, Mathbaria, Pirojpur-8514' },
                    { dt: 'Institution Type', dd: 'Private MPO Enlisted' },
                    { dt: 'Education Type', dd: 'Co-Education' },
                    { dt: 'Programs', dd: 'Secondary (SSC) & Higher Secondary (HSC)' },
                    { dt: 'Total Teachers', dd: '13' },
                    { dt: 'Total Staff', dd: '4' },
                    { dt: 'Total Students', dd: '679' },
                  ].map(({ dt, dd }) => (
                    <div key={dt} className="flex justify-between text-sm border-b border-primary-100 pb-2 last:border-0 last:pb-0">
                      <dt className="text-gray-500 font-medium">{dt}</dt>
                      <dd className="text-primary-800 font-semibold text-right ml-4">{dd}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-accent-600 font-semibold text-sm uppercase tracking-wider mb-2">
              Our Journey
            </p>
            <h2 className="section-title">Recognition Timeline</h2>
            <div className="w-16 h-1 bg-accent-600 rounded mx-auto mb-4" />
            <p className="section-subtitle max-w-xl mx-auto">
              From a small village school to a full School &amp; College — a journey spanning over
              eight decades
            </p>
          </div>
          <div className="max-w-3xl mx-auto relative">
            {/* vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-primary-200 hidden sm:block" />
            <div className="space-y-8">
              {timeline.map((item, i) => (
                <div key={i} className="flex gap-6 relative">
                  <div
                    className={`w-12 h-12 rounded-full ${item.color} text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-md z-10`}
                  >
                    {item.year === 'Present' ? '★' : item.year.slice(2)}
                  </div>
                  <div className="flex-1 bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-gray-800 text-base">{item.title}</h3>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full text-white ${item.color}`}>
                        {item.year}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-accent-600 font-semibold text-sm uppercase tracking-wider mb-2">
              Our Purpose
            </p>
            <h2 className="section-title">Mission &amp; Vision</h2>
            <div className="w-16 h-1 bg-accent-600 rounded mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-primary-800 rounded-2xl p-8 text-white">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-5">
                <Target className="h-6 w-6 text-accent-300" />
              </div>
              <h3 className="text-xl font-bold mb-4">Our Mission</h3>
              <p className="text-white/80 leading-relaxed">
                To provide accessible, high-quality education to the students of Mirukhali and
                surrounding areas, fostering academic excellence, moral integrity, and a love for
                lifelong learning. We are committed to preparing students to become responsible
                citizens and productive members of society.
              </p>
            </div>
            <div className="bg-accent-600 rounded-2xl p-8 text-white">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-5">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Our Vision</h3>
              <p className="text-white/80 leading-relaxed">
                To be the premier educational institution of Mathbaria Upazila, renowned for
                academic achievement, character development, and community leadership. We envision
                a future where every student reaches their fullest potential, armed with knowledge,
                skills, and values to succeed in a changing world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-accent-600 font-semibold text-sm uppercase tracking-wider mb-2">
              Our Pride
            </p>
            <h2 className="section-title">Achievements &amp; Recognition</h2>
            <div className="w-16 h-1 bg-accent-600 rounded mx-auto" />
          </div>
          <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
            {achievements.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm border border-gray-100"
              >
                <CheckCircle2 className="h-5 w-5 text-primary-700 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-accent-600 font-semibold text-sm uppercase tracking-wider mb-2">
                Find Us
              </p>
              <h2 className="section-title">Our Location</h2>
              <div className="w-16 h-1 bg-accent-600 rounded mb-6" />
              <div className="space-y-4 text-gray-600">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary-700 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-800">Address</p>
                    <p className="text-sm">Mirukhali, Mathbaria, Pirojpur-8514, Bangladesh</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      মিরুখালী, মঠবাড়িয়া, পিরোজপুর-৮৫১৪, বাংলাদেশ
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-sm ml-8">
                  {[
                    { label: 'Village', val: 'Mirukhali' },
                    { label: 'Upazila', val: 'Mathbaria' },
                    { label: 'District', val: 'Pirojpur' },
                    { label: 'Division', val: 'Barisal' },
                    { label: 'Country', val: 'Bangladesh' },
                    { label: 'Post Code', val: '8514' },
                  ].map(({ label, val }) => (
                    <div key={label} className="flex gap-4">
                      <span className="w-20 text-gray-400">{label}</span>
                      <span className="text-gray-700 font-medium">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-gray-100 rounded-2xl overflow-hidden h-72 flex items-center justify-center border border-gray-200">
              <div className="text-center text-gray-400">
                <MapPin className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm font-medium">Mirukhali, Mathbaria, Pirojpur</p>
                <p className="text-xs mt-1">Bangladesh</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
