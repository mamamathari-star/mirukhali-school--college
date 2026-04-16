import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import QRCode from 'qrcode'
import { generateCertificateNo } from '@/lib/utils'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const studentId = searchParams.get('studentId')
    const type = searchParams.get('type')

    const where: Record<string, unknown> = {}
    if (studentId) where.studentId = studentId
    if (type) where.type = type

    const certificates = await prisma.certificate.findMany({
      where,
      include: {
        student: { select: { name: true, admissionNo: true, class: true } },
        issuedBy: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ certificates })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch certificates' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()

    const certificateNo = generateCertificateNo(body.type)
    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify/${certificateNo}`
    const qrCode = await QRCode.toDataURL(verifyUrl)

    const certificate = await prisma.certificate.create({
      data: {
        type: body.type,
        studentId: body.studentId,
        issueDate: body.issueDate ? new Date(body.issueDate) : new Date(),
        certificateNo,
        qrCode,
        issuedById: session.user.id,
      },
      include: {
        student: { select: { name: true, admissionNo: true, class: true } },
      },
    })
    return NextResponse.json({ certificate }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create certificate' }, { status: 500 })
  }
}
