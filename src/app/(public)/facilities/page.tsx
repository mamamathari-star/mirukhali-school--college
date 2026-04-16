import type { Metadata } from 'next'
import { SCHOOL_NAME } from '@/lib/constants'
import {
  Dumbbell,
  Library,
  Microscope,
  Monitor,
  Building2,
  Wind,
  BookOpen,
  Users,
  Wifi,
  Camera,
} from 'lucide-react'

export const metadata: Metadata = {
  title: `Facilities | ${SCHOOL_NAME}`,
  description:
    'Explore the campus facilities at Mirukhali School & College including science lab, computer lab, library, hostel, mosque and sports field.',
}

interface Facility {
  id: string
  name: string
  description: string
  icon: string | null
  image: string | null
  isActive: boolean
}

async function getFacilities(): Promise<Facility[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/facilities?active=true`, {
      next: { revalidate: 600 },
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.facilities || []
  } catch {
    return []
  }
}

const staticFacilities = [
  {
    name: 'Sports Field',
    desc: 'A large, well-maintained sports field for football, cricket, kabaddi, and athletics. The field hosts inter-school tournaments and annual sports days.',
    icon: Dumbbell,
    color: 'bg-green-100 text-green-700',
  },
  {
    name: 'Mosque',
    desc: 'An on-campus mosque where students and staff can perform their daily prayers. It fosters a sense of spiritual discipline and community.',
    icon: Wind,
    color: 'bg-teal-100 text-teal-700',
  },
  {
    name: 'Hostel',
    desc: 'Residential accommodation for students who come from distant areas, providing a safe and supervised living environment within the campus.',
    icon: Building2,
    color: 'bg-blue-100 text-blue-700',
  },
  {
    name: 'Library',
    desc: 'A well-stocked library with textbooks, reference books, periodicals, and Bengali literature. Open daily for students to read and borrow.',
    icon: Library,
    color: 'bg-purple-100 text-purple-700',
  },
  {
    name: 'Science Laboratory',
    desc: 'A fully equipped science laboratory supporting practical experiments in Physics, Chemistry, and Biology for SSC and HSC students.',
    icon: Microscope,
    color: 'bg-orange-100 text-orange-700',
  },
  {
    name: 'Computer Laboratory',
    desc: '15 desktop computers with internet access and ICT curriculum software. Students learn programming fundamentals, office applications, and digital literacy.',
    icon: Monitor,
    color: 'bg-primary-100 text-primary-700',
  },
  {
    name: 'Multimedia Classrooms',
    desc: 'Modern classrooms equipped with projectors and audio-visual aids, enabling interactive and engaging lessons for all subjects.',
    icon: Camera,
    color: 'bg-red-100 text-red-700',
  },
  {
    name: 'Reading Room',
    desc: 'A dedicated quiet reading room adjoining the library for students to study and prepare for examinations in a distraction-free environment.',
    icon: BookOpen,
    color: 'bg-yellow-100 text-yellow-700',
  },
  {
    name: 'Common Room',
    desc: 'A shared space for students to relax between classes, socialise, and participate in co-curricular activities and club meetings.',
    icon: Users,
    color: 'bg-pink-100 text-pink-700',
  },
  {
    name: 'Internet Access',
    desc: 'Broadband internet connectivity available in the computer lab and administrative offices, supporting digital learning initiatives.',
    icon: Wifi,
    color: 'bg-indigo-100 text-indigo-700',
  },
]

export default async function FacilitiesPage() {
  const dynamicFacilities = await getFacilities()

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-800 to-primary-600 py-16">
        <div className="container">
          <div className="max-w-3xl">
            <p className="text-accent-300 text-sm font-semibold uppercase tracking-widest mb-2">
              Campus Infrastructure
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
              Our Facilities
            </h1>
            <p className="text-white/70 text-lg">
              Mirukhali School &amp; College provides a range of modern facilities to support
              academic excellence and holistic student development.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-accent-600 font-semibold text-sm uppercase tracking-wider mb-2">
              Infrastructure
            </p>
            <h2 className="section-title">Campus Facilities</h2>
            <div className="w-16 h-1 bg-accent-600 rounded mx-auto mb-4" />
            <p className="section-subtitle max-w-xl mx-auto">
              Everything students need for a complete educational experience
            </p>
          </div>

          {dynamicFacilities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {dynamicFacilities.map((facility, idx) => {
                const StaticIcon = staticFacilities[idx % staticFacilities.length]
                return (
                  <div
                    key={facility.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group"
                  >
                    {facility.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={facility.image}
                        alt={facility.name}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <div className="p-5">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${StaticIcon.color}`}>
                        <StaticIcon.icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-bold text-gray-800 text-base mb-2">{facility.name}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{facility.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {staticFacilities.map((facility) => (
                <div
                  key={facility.name}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow group"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${facility.color} group-hover:scale-110 transition-transform`}>
                    <facility.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-gray-800 text-base mb-2">{facility.name}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{facility.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 bg-white">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { label: 'Computer Lab PCs', value: '15', icon: Monitor },
              { label: 'Science Lab', value: '1', icon: Microscope },
              { label: 'Library', value: '1', icon: Library },
              { label: 'Classrooms', value: '10+', icon: BookOpen },
            ].map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="text-center p-6 rounded-2xl bg-primary-50 border border-primary-100"
              >
                <Icon className="h-7 w-7 text-primary-700 mx-auto mb-3" />
                <div className="text-3xl font-extrabold text-primary-800 mb-1">{value}</div>
                <div className="text-sm text-gray-600 font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
