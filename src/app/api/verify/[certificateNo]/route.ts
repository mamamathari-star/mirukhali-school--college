import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: { certificateNo: string } }
) {
  try {
    const cert = await prisma.certificate.findUnique({
      where: { certificateNo: params.certificateNo },
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
