import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function GET() {
  try {
    const members = await prisma.committee.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json({ members })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch committee' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const member = await prisma.committee.create({
      data: {
        name: body.name,
        designation: body.designation,
        role: body.role,
        photo: body.photo || null,
        phone: body.phone || null,
        term: body.term || null,
        order: body.order ?? 0,
        isActive: body.isActive ?? true,
      },
    })
    return NextResponse.json({ member }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create committee member' }, { status: 500 })
  }
}
