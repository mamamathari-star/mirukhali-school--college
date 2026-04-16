import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { calculateGrade } from '@/lib/utils'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const result = await prisma.result.findUnique({
      where: { id },
      include: { student: { select: { name: true, admissionNo: true } } },
    })
    if (!result) return NextResponse.json({ error: 'Result not found' }, { status: 404 })
    return NextResponse.json({ result })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch result' }, { status: 500 })
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
    const grade = calculateGrade(body.marksObtained, body.totalMarks)

    const result = await prisma.result.update({
      where: { id },
      data: {
        studentId: body.studentId,
        examName: body.examName,
        class: body.class,
        section: body.section || null,
        subject: body.subject,
        marksObtained: parseFloat(body.marksObtained),
        totalMarks: parseFloat(body.totalMarks),
        grade,
        year: body.year,
      },
    })
    return NextResponse.json({ result })
  } catch {
    return NextResponse.json({ error: 'Failed to update result' }, { status: 500 })
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
    await prisma.result.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete result' }, { status: 500 })
  }
}
