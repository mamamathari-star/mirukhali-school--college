import type { Metadata } from 'next'
import { SCHOOL_NAME } from '@/lib/constants'
import { Users, Phone, Mail, User } from 'lucide-react'

export const metadata: Metadata = {
  title: `Governing Body | ${SCHOOL_NAME}`,
  description: 'Meet the Managing Committee and Governing Body of Mirukhali School & College.',
}

interface CommitteeMember {
  id: string
  name: string
  designation: string
  role: string
  phone: string | null
  email: string | null
  photo: string | null
  isActive: boolean
  order: number
}

async function getCommitteeMembers(): Promise<CommitteeMember[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/committee?active=true`, {
      next: { revalidate: 300 },
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.members || []
  } catch {
    return []
  }
}

const roleColors: Record<string, string> = {
  President: 'bg-primary-800 text-white',
  'Vice President': 'bg-primary-600 text-white',
  Secretary: 'bg-accent-600 text-white',
  'Joint Secretary': 'bg-accent-500 text-white',
  Treasurer: 'bg-blue-600 text-white',
  Member: 'bg-gray-200 text-gray-700',
  Teacher: 'bg-teal-100 text-teal-700',
}

const avatarColors = [
  'bg-primary-700',
  'bg-accent-600',
  'bg-blue-600',
  'bg-purple-600',
  'bg-teal-600',
  'bg-rose-600',
  'bg-indigo-600',
  'bg-emerald-600',
]

export default async function CommitteePage() {
  const members = await getCommitteeMembers()

  const sorted = [...members].sort((a, b) => a.order - b.order)

  const topMembers = sorted.filter((m) =>
    ['President', 'Vice President', 'Secretary', 'Joint Secretary', 'Treasurer'].includes(m.role)
  )
  const generalMembers = sorted.filter(
    (m) =>
      !['President', 'Vice President', 'Secretary', 'Joint Secretary', 'Treasurer'].includes(m.role)
  )

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-800 to-primary-600 py-16">
        <div className="container">
          <div className="max-w-3xl">
            <p className="text-accent-300 text-sm font-semibold uppercase tracking-widest mb-2">
              Leadership
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
              Governing Body
            </h1>
            <p className="text-white/70 text-lg">
              Meet the dedicated committee members who guide and govern Mirukhali School &amp;
              College.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50 min-h-[60vh]">
        <div className="container">
          {members.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
              <Users className="h-14 w-14 mx-auto mb-4 text-gray-200" />
              <h3 className="text-lg font-semibold text-gray-500 mb-2">No Members Found</h3>
              <p className="text-sm text-gray-400">
                Committee member profiles will appear here once added by the administration.
              </p>
            </div>
          ) : (
            <>
              {/* Executive Committee */}
              {topMembers.length > 0 && (
                <div className="mb-14">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="h-0.5 flex-1 bg-gray-200" />
                    <h2 className="text-lg font-bold text-gray-700 uppercase tracking-wider px-4">
                      Executive Committee
                    </h2>
                    <div className="h-0.5 flex-1 bg-gray-200" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {topMembers.map((member, idx) => (
                      <MemberCard key={member.id} member={member} idx={idx} />
                    ))}
                  </div>
                </div>
              )}

              {/* General Members */}
              {generalMembers.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="h-0.5 flex-1 bg-gray-200" />
                    <h2 className="text-lg font-bold text-gray-700 uppercase tracking-wider px-4">
                      Members
                    </h2>
                    <div className="h-0.5 flex-1 bg-gray-200" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {generalMembers.map((member, idx) => (
                      <MemberCard key={member.id} member={member} idx={idx} compact />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  )
}

function MemberCard({
  member,
  idx,
  compact = false,
}: {
  member: CommitteeMember
  idx: number
  compact?: boolean
}) {
  const initials = member.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
  const colorClass = avatarColors[idx % avatarColors.length]
  const roleClass = roleColors[member.role] ?? 'bg-gray-200 text-gray-700'

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Avatar */}
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 ${compact ? 'h-28' : 'h-36'}`}
      >
        {member.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={member.photo}
            alt={member.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className={`${compact ? 'w-16 h-16 text-xl' : 'w-20 h-20 text-2xl'} rounded-full ${colorClass} flex items-center justify-center text-white font-bold shadow-md`}
          >
            {initials || <User className="h-7 w-7" />}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${roleClass}`}>
          {member.role}
        </span>
        <h3 className="font-bold text-gray-800 mt-2 text-base leading-tight">{member.name}</h3>
        {member.designation && (
          <p className="text-xs text-gray-500 mt-0.5">{member.designation}</p>
        )}
        {(member.phone || member.email) && (
          <div className="mt-3 pt-3 border-t border-gray-100 space-y-1.5">
            {member.phone && (
              <a
                href={`tel:${member.phone}`}
                className="flex items-center gap-2 text-xs text-gray-500 hover:text-primary-700 transition-colors"
              >
                <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                {member.phone}
              </a>
            )}
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="flex items-center gap-2 text-xs text-gray-500 hover:text-primary-700 transition-colors"
              >
                <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate">{member.email}</span>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
