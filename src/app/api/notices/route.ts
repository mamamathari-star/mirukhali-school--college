import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const published = searchParams.get('published')
    const category = searchParams.get('category')
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined

    const where: Record<string, unknown> = {}
    if (published === 'true') where.isPublished = true
    if (category) where.category = category

    const notices = await prisma.notice.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: { createdBy: { select: { name: true } } },
    })
    return NextResponse.json({ notices })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch notices' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const notice = await prisma.notice.create({
      data: {
        title: body.title,
        content: body.content,
        category: body.category,
        attachmentUrl: body.attachmentUrl || null,
        isPublished: body.isPublished ?? false,
        publishDate: body.publishDate ? new Date(body.publishDate) : null,
        createdById: session.user.id,
      },
    })
    return NextResponse.json({ notice }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create notice' }, { status: 500 })
  }
}
