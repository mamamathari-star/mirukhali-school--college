import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const member = await prisma.committee.findUnique({ where: { id } })
    if (!member) return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    return NextResponse.json({ member })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch member' }, { status: 500 })
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
    const member = await prisma.committee.update({
      where: { id },
      data: {
        name: body.name,
        designation: body.designation,
        role: body.role,
        photo: body.photo ?? null,
        phone: body.phone ?? null,
        term: body.term ?? null,
        order: body.order ?? 0,
        isActive: body.isActive ?? true,
      },
    })
    return NextResponse.json({ member })
  } catch {
    return NextResponse.json({ error: 'Failed to update member' }, { status: 500 })
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
    await prisma.committee.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete member' }, { status: 500 })
  }
}
