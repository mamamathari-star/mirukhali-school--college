import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function GET() {
  try {
    const settings = await prisma.setting.findMany()
    const obj: Record<string, string> = {}
    settings.forEach((s) => {
      obj[s.key] = s.value
    })
    return NextResponse.json(obj)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()

    const pairs: Array<{ key: string; value: string }> = body.settings
      ? Object.entries(body.settings as Record<string, string>).map(([key, value]) => ({
          key,
          value,
        }))
      : [{ key: body.key, value: body.value }]

    const upserts = pairs.map((pair) =>
      prisma.setting.upsert({
        where: { key: pair.key },
        update: { value: pair.value },
        create: { key: pair.key, value: pair.value },
      })
    )

    await Promise.all(upserts)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}
