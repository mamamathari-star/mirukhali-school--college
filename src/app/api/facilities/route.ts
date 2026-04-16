import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function GET() {
  try {
    const facilities = await prisma.facility.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json({ facilities })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch facilities' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const facility = await prisma.facility.create({
      data: {
        name: body.name,
        description: body.description,
        icon: body.icon || null,
        imageUrl: body.imageUrl || null,
        order: body.order ?? 0,
        isActive: body.isActive ?? true,
      },
    })
    return NextResponse.json({ facility }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create facility' }, { status: 500 })
  }
}
