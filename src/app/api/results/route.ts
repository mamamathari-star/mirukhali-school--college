import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { calculateGrade } from '@/lib/utils'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const studentId = searchParams.get('studentId')
    const admissionNo = searchParams.get('admissionNo')
    const examName = searchParams.get('examName')
    const cls = searchParams.get('class')
    const year = searchParams.get('year')

    const where: Record<string, unknown> = {}
    if (studentId) where.studentId = studentId
    if (examName) where.examName = examName
    if (cls) where.class = cls
    if (year) where.year = year
    if (admissionNo) {
      where.student = { admissionNo }
    }

    const results = await prisma.result.findMany({
      where,
      include: { student: { select: { name: true, admissionNo: true } } },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ results })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const grade = calculateGrade(body.marksObtained, body.totalMarks)

    const result = await prisma.result.create({
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
    return NextResponse.json({ result }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create result' }, { status: 500 })
  }
}
