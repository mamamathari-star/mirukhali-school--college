import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const [logs, total] = await Promise.all([
      prisma.verificationLog.findMany({
        orderBy: { verifiedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          certificate: {
            select: {
              certificateNo: true,
              type: true,
              student: { select: { name: true, admissionNo: true } },
            },
          },
        },
      }),
      prisma.verificationLog.count(),
    ])

    return NextResponse.json({ logs, total, page, limit })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 })
  }
}
