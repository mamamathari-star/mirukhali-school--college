import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const facility = await prisma.facility.findUnique({ where: { id: params.id } })
    if (!facility) return NextResponse.json({ error: 'Facility not found' }, { status: 404 })
    return NextResponse.json({ facility })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch facility' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const facility = await prisma.facility.update({
      where: { id: params.id },
      data: {
        name: body.name,
        description: body.description,
        icon: body.icon ?? null,
        imageUrl: body.imageUrl ?? null,
        order: body.order ?? 0,
        isActive: body.isActive ?? true,
      },
    })
    return NextResponse.json({ facility })
  } catch {
    return NextResponse.json({ error: 'Failed to update facility' }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await prisma.facility.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete facility' }, { status: 500 })
  }
}
