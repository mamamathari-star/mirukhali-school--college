import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')

    const images = await prisma.gallery.findMany({
      where: category ? { category } : undefined,
      orderBy: { uploadedAt: 'desc' },
    })
    return NextResponse.json({ images })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const image = await prisma.gallery.create({
      data: {
        title: body.title,
        caption: body.caption || null,
        imageUrl: body.imageUrl,
        category: body.category || 'General',
      },
    })
    return NextResponse.json({ image }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to add image' }, { status: 500 })
  }
}
