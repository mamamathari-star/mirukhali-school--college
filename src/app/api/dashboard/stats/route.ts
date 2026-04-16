import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function GET() {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const [teachers, students, notices, admissions, certificates] = await Promise.all([
      prisma.teacher.count({ where: { isActive: true } }),
      prisma.student.count({ where: { isActive: true } }),
      prisma.notice.count({ where: { isPublished: true } }),
      prisma.admission.count({ where: { status: 'PENDING' } }),
      prisma.certificate.count(),
    ])

    return NextResponse.json({ teachers, students, notices, admissions, certificates })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
