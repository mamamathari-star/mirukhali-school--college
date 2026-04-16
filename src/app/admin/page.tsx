import { prisma } from '@/lib/db'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import {
  Users,
  GraduationCap,
  Bell,
  ClipboardList,
  Award,
  Plus,
} from 'lucide-react'

async function getDashboardData() {
  const [
    teacherCount,
    studentCount,
    noticeCount,
    pendingAdmissions,
    certificateCount,
    recentAdmissions,
    recentNotices,
  ] = await Promise.all([
    prisma.teacher.count({ where: { isActive: true } }),
    prisma.student.count({ where: { isActive: true } }),
    prisma.notice.count({ where: { isPublished: true } }),
    prisma.admission.count({ where: { status: 'PENDING' } }),
    prisma.certificate.count(),
    prisma.admission.findMany({
      orderBy: { appliedAt: 'desc' },
      take: 5,
    }),
    prisma.notice.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { createdBy: { select: { name: true } } },
    }),
  ])

  return {
    teacherCount,
    studentCount,
    noticeCount,
    pendingAdmissions,
    certificateCount,
    recentAdmissions,
    recentNotices,
  }
}

export default async function AdminDashboard() {
  const data = await getDashboardData()

  const stats = [
    {
      label: 'Active Teachers',
      value: data.teacherCount,
      icon: Users,
      color: 'bg-blue-500',
      href: '/admin/teachers',
    },
    {
      label: 'Active Students',
      value: data.studentCount,
      icon: GraduationCap,
      color: 'bg-green-500',
      href: '/admin/students',
    },
    {
      label: 'Published Notices',
      value: data.noticeCount,
      icon: Bell,
      color: 'bg-yellow-500',
      href: '/admin/notices',
    },
    {
      label: 'Pending Admissions',
      value: data.pendingAdmissions,
      icon: ClipboardList,
      color: 'bg-red-500',
      href: '/admin/admissions',
    },
    {
      label: 'Certificates Issued',
      value: data.certificateCount,
      icon: Award,
      color: 'bg-purple-500',
      href: '/admin/certificates',
    },
  ]

  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">Welcome back, Admin</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-lg shadow p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div className={`${stat.color} p-3 rounded-full`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-5">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'Add Teacher', href: '/admin/teachers/new' },
            { label: 'Add Student', href: '/admin/students/new' },
            { label: 'New Notice', href: '/admin/notices/new' },
            { label: 'Add Result', href: '/admin/results/new' },
            { label: 'Issue Certificate', href: '/admin/certificates/new' },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Admissions */}
        <div className="bg-white rounded-lg shadow">
          <div className="flex items-center justify-between p-5 border-b">
            <h2 className="text-lg font-semibold text-gray-800">Recent Admissions</h2>
            <Link href="/admin/admissions" className="text-sm text-green-600 hover:underline">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Name</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Class</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Date</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.recentAdmissions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-gray-400">
                      No admissions yet
                    </td>
                  </tr>
                ) : (
                  data.recentAdmissions.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{a.applicantName}</td>
                      <td className="px-4 py-3 text-gray-600">{a.class}</td>
                      <td className="px-4 py-3 text-gray-600">{formatDate(a.appliedAt)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            statusColors[a.status] || 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Notices */}
        <div className="bg-white rounded-lg shadow">
          <div className="flex items-center justify-between p-5 border-b">
            <h2 className="text-lg font-semibold text-gray-800">Recent Notices</h2>
            <Link href="/admin/notices" className="text-sm text-green-600 hover:underline">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Title</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Category</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Date</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.recentNotices.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-gray-400">
                      No notices yet
                    </td>
                  </tr>
                ) : (
                  data.recentNotices.map((n) => (
                    <tr key={n.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900 max-w-[180px] truncate">
                        {n.title}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{n.category}</td>
                      <td className="px-4 py-3 text-gray-600">{formatDate(n.createdAt)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            n.isPublished
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {n.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
