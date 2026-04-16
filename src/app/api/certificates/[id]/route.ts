import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const certificate = await prisma.certificate.findUnique({
      where: { id },
      include: {
        student: true,
        issuedBy: { select: { name: true } },
        verificationLogs: { orderBy: { verifiedAt: 'desc' }, take: 10 },
      },
    })
    if (!certificate) return NextResponse.json({ error: 'Certificate not found' }, { status: 404 })
    return NextResponse.json({ certificate })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch certificate' }, { status: 500 })
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
    const certificate = await prisma.certificate.update({
      where: { id },
      data: { isRevoked: body.isRevoked ?? true },
    })
    return NextResponse.json({ certificate })
  } catch {
    return NextResponse.json({ error: 'Failed to update certificate' }, { status: 500 })
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
    await prisma.certificate.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete certificate' }, { status: 500 })
  }
}
