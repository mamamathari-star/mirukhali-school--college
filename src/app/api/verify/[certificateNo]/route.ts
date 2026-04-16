import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ certificateNo: string }> }
) {
  try {
    const { certificateNo } = await params
    const cert = await prisma.certificate.findUnique({
      where: { certificateNo },
      include: { student: true, issuedBy: { select: { name: true } } },
    })
    if (!cert) return NextResponse.json({ found: false }, { status: 404 })

    await prisma.verificationLog.create({
      data: {
        certificateId: cert.id,
        ipAddress:
          req.headers.get('x-forwarded-for') ||
          req.headers.get('x-real-ip') ||
          'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
      },
    })

    return NextResponse.json({ found: true, certificate: cert })
  } catch {
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
