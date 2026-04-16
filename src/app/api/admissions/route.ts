import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: Record<string, unknown> = {}
    if (status) where.status = status

    const [admissions, total] = await Promise.all([
      prisma.admission.findMany({
        where,
        orderBy: { appliedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.admission.count({ where }),
    ])

    return NextResponse.json({ admissions, total, page, limit })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch admissions' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const admission = await prisma.admission.create({
      data: {
        applicantName: body.applicantName,
        fatherName: body.fatherName,
        motherName: body.motherName,
        dob: new Date(body.dob),
        gender: body.gender,
        class: body.class,
        phone: body.phone,
        address: body.address,
        photo: body.photo || null,
        status: 'PENDING',
      },
    })
    return NextResponse.json({ admission }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to submit admission' }, { status: 500 })
  }
}
