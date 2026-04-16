import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const admission = await prisma.admission.findUnique({ where: { id: params.id } })
    if (!admission) return NextResponse.json({ error: 'Admission not found' }, { status: 404 })
    return NextResponse.json({ admission })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch admission' }, { status: 500 })
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
    const admission = await prisma.admission.update({
      where: { id: params.id },
      data: { status: body.status },
    })
    return NextResponse.json({ admission })
  } catch {
    return NextResponse.json({ error: 'Failed to update admission' }, { status: 500 })
  }
}
