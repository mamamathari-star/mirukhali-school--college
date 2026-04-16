import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const notice = await prisma.notice.findUnique({
      where: { id },
      include: { createdBy: { select: { name: true } } },
    })
    if (!notice) return NextResponse.json({ error: 'Notice not found' }, { status: 404 })
    return NextResponse.json({ notice })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch notice' }, { status: 500 })
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
    const notice = await prisma.notice.update({
      where: { id },
      data: {
        title: body.title,
        content: body.content,
        category: body.category,
        attachmentUrl: body.attachmentUrl || null,
        isPublished: body.isPublished ?? false,
        publishDate: body.publishDate ? new Date(body.publishDate) : null,
      },
    })
    return NextResponse.json({ notice })
  } catch {
    return NextResponse.json({ error: 'Failed to update notice' }, { status: 500 })
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
    await prisma.notice.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete notice' }, { status: 500 })
  }
}
