import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const active = searchParams.get('active')

    const teachers = await prisma.teacher.findMany({
      where: active === 'true' ? { isActive: true } : undefined,
      orderBy: { order: 'asc' },
    })
    return NextResponse.json({ teachers })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch teachers' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const teacher = await prisma.teacher.create({
      data: {
        name: body.name,
        designation: body.designation,
        subject: body.subject,
        qualification: body.qualification,
        joinDate: new Date(body.joinDate),
        photo: body.photo || null,
        phone: body.phone || '',
        email: body.email || null,
        isActive: body.isActive ?? true,
        order: body.order ?? 0,
      },
    })
    return NextResponse.json({ teacher }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create teacher' }, { status: 500 })
  }
}
