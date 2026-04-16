import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const teacher = await prisma.teacher.findUnique({ where: { id } })
    if (!teacher) return NextResponse.json({ error: 'Teacher not found' }, { status: 404 })
    return NextResponse.json({ teacher })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch teacher' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const body = await req.json()
    const teacher = await prisma.teacher.update({
      where: { id },
      data: {
        name: body.name,
        designation: body.designation,
        subject: body.subject,
        qualification: body.qualification,
        joinDate: new Date(body.joinDate),
        photo: body.photo ?? undefined,
        phone: body.phone ?? '',
        email: body.email ?? null,
        isActive: body.isActive,
        order: body.order ?? 0,
      },
    })
    return NextResponse.json({ teacher })
  } catch {
    return NextResponse.json({ error: 'Failed to update teacher' }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    await prisma.teacher.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete teacher' }, { status: 500 })
  }
}
