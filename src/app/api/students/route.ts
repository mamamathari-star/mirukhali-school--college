import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const cls = searchParams.get('class')
    const section = searchParams.get('section')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: Record<string, unknown> = {}
    if (cls) where.class = cls
    if (section) where.section = section
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { admissionNo: { contains: search } },
      ]
    }

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        orderBy: { admissionNo: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.student.count({ where }),
    ])

    return NextResponse.json({ students, total, page, limit })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const student = await prisma.student.create({
      data: {
        admissionNo: body.admissionNo,
        name: body.name,
        class: body.class,
        section: body.section || null,
        roll: body.roll || null,
        fatherName: body.fatherName,
        motherName: body.motherName,
        phone: body.phone || null,
        address: body.address,
        photo: body.photo || null,
        admissionDate: new Date(body.admissionDate),
        isActive: body.isActive ?? true,
      },
    })
    return NextResponse.json({ student }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create student' }, { status: 500 })
  }
}
