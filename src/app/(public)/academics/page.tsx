import type { Metadata } from 'next'
import { SCHOOL_NAME } from '@/lib/constants'
import { BookOpen, GraduationCap, ClipboardList, Calendar } from 'lucide-react'

export const metadata: Metadata = {
  title: `Academics | ${SCHOOL_NAME}`,
  description:
    'Academic programs, curriculum, subjects, and examination system at Mirukhali School & College.',
}

const sscSubjects = {
  core: [
    'Bangla (1st & 2nd Paper)',
    'English (1st & 2nd Paper)',
    'Mathematics',
    'Religion & Moral Education',
    'Information & Communication Technology (ICT)',
    'Bangladesh & Global Studies',
    'Physical Education, Health & Sports',
    'Career Education',
  ],
  science: ['Physics', 'Chemistry', 'Biology / Higher Mathematics'],
  humanities: ['History of Bangladesh & World Civilization', 'Geography & Environment', 'Civics & Citizenship / Economics'],
  business: ['Accounting', 'Business Entrepreneurship', 'Finance & Banking / Economics'],
}

const hscSubjects = {
  core: [
    'Bangla (1st & 2nd Paper)',
    'English (1st & 2nd Paper)',
    'Information & Communication Technology (ICT)',
  ],
  science: ['Physics', 'Chemistry', 'Biology / Mathematics'],
  humanities: ['History', 'Islamic Studies / Logic', 'Geography / Civic Education / Economics'],
  business: ['Accounting', 'Finance, Banking & Insurance', 'Business Organization & Management'],
}

const grades = [
  { grade: 'A+', gpa: '5.00', marks: '80–100', label: 'Excellent' },
  { grade: 'A', gpa: '4.00', marks: '70–79', label: 'Very Good' },
  { grade: 'A–', gpa: '3.50', marks: '60–69', label: 'Good' },
  { grade: 'B', gpa: '3.00', marks: '50–59', label: 'Average' },
  { grade: 'C', gpa: '2.00', marks: '40–49', label: 'Below Average' },
  { grade: 'D', gpa: '1.00', marks: '33–39', label: 'Poor' },
  { grade: 'F', gpa: '0.00', marks: '0–32', label: 'Fail' },
]

const calendar = [
  { month: 'January', event: 'New academic year begins; class routine issued' },
  { month: 'February', event: 'First monthly test; Language Movement Day celebration' },
  { month: 'March', event: 'Second monthly test; Independence Day events' },
  { month: 'April–May', event: 'Half Yearly Examination' },
  { month: 'June', event: 'Result publication; summer recess' },
  { month: 'July', event: 'Classes resume; SSC Test Examination begins (Class X)' },
  { month: 'August–September', event: 'Annual Examination; class assessments' },
  { month: 'October', event: 'Result publication; HSC Test Examination (Class XII)' },
  { month: 'November', event: 'Annual Prize-Giving Ceremony; school sports' },
  { month: 'December', event: 'Victory Day celebration; winter recess' },
]

export default function AcademicsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-800 to-primary-600 py-16">
        <div className="container">
          <div className="max-w-3xl">
            <p className="text-accent-300 text-sm font-semibold uppercase tracking-widest mb-2">
              Curriculum
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
              Academic Programs
            </h1>
            <p className="text-white/70 text-lg">
              A comprehensive education from Class VI to Class XII following the National Curriculum
              &amp; Textbook Board (NCTB) guidelines.
            </p>
          </div>
        </div>
      </section>

      {/* Programs Overview */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-accent-600 font-semibold text-sm uppercase tracking-wider mb-2">
              What We Offer
            </p>
            <h2 className="section-title">Programs Offered</h2>
            <div className="w-16 h-1 bg-accent-600 rounded mx-auto" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* SSC Card */}
            <div className="card border border-primary-100 p-0 overflow-hidden">
              <div className="bg-primary-800 p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen className="h-7 w-7 text-accent-300" />
                  <h3 className="text-xl font-bold">Secondary Education (SSC)</h3>
                </div>
                <p className="text-white/70 text-sm">Class VI – X &nbsp;|&nbsp; Grade 6 to Grade 10</p>
              </div>
              <div className="p-6 space-y-4">
                <SubjectGroup title="Compulsory Subjects" items={sscSubjects.core} color="primary" />
                <SubjectGroup title="Science Group" items={sscSubjects.science} color="blue" />
                <SubjectGroup title="Humanities Group" items={sscSubjects.humanities} color="purple" />
                <SubjectGroup title="Business Studies Group" items={sscSubjects.business} color="orange" />
              </div>
            </div>

            {/* HSC Card */}
            <div className="card border border-accent-100 p-0 overflow-hidden">
              <div className="bg-accent-600 p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <GraduationCap className="h-7 w-7 text-white" />
                  <h3 className="text-xl font-bold">Higher Secondary Education (HSC)</h3>
                </div>
                <p className="text-white/80 text-sm">Class XI – XII &nbsp;|&nbsp; Grade 11 to Grade 12</p>
              </div>
              <div className="p-6 space-y-4">
                <SubjectGroup title="Compulsory Subjects" items={hscSubjects.core} color="accent" />
                <SubjectGroup title="Science Group" items={hscSubjects.science} color="blue" />
                <SubjectGroup title="Humanities Group" items={hscSubjects.humanities} color="purple" />
                <SubjectGroup title="Business Studies Group" items={hscSubjects.business} color="orange" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Examination System */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-accent-600 font-semibold text-sm uppercase tracking-wider mb-2">
              Assessment
            </p>
            <h2 className="section-title">Examination System</h2>
            <div className="w-16 h-1 bg-accent-600 rounded mx-auto mb-4" />
            <p className="section-subtitle max-w-xl mx-auto">
              Students are assessed through a combination of continuous assessment and formal
              examinations
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { title: 'Monthly Tests', icon: ClipboardList, desc: 'Short periodic tests held every month to track continuous progress.', color: 'text-primary-700 bg-primary-100' },
              { title: 'Half Yearly Exam', icon: ClipboardList, desc: 'Mid-year formal examination covering the first half of the syllabus.', color: 'text-accent-700 bg-accent-100' },
              { title: 'Annual Examination', icon: ClipboardList, desc: 'Comprehensive year-end examination covering the full academic syllabus.', color: 'text-blue-700 bg-blue-100' },
              { title: 'Test Examination', icon: ClipboardList, desc: 'Pre-board test exam for SSC and HSC candidates in preparation for public exams.', color: 'text-purple-700 bg-purple-100' },
              { title: 'SSC Examination', icon: GraduationCap, desc: 'Bangladesh Secondary School Certificate – national public exam for Class X.', color: 'text-primary-700 bg-primary-100' },
              { title: 'HSC Examination', icon: GraduationCap, desc: 'Bangladesh Higher Secondary Certificate – national public exam for Class XII.', color: 'text-accent-700 bg-accent-100' },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${item.color}`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grading System */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-accent-600 font-semibold text-sm uppercase tracking-wider mb-2">
              Evaluation
            </p>
            <h2 className="section-title">Grading System</h2>
            <div className="w-16 h-1 bg-accent-600 rounded mx-auto mb-4" />
            <p className="section-subtitle">Bangladesh National Grading System (GPA)</p>
          </div>
          <div className="max-w-2xl mx-auto overflow-hidden rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-primary-800 text-white">
                  <th className="px-4 py-3 text-left font-semibold">Grade</th>
                  <th className="px-4 py-3 text-left font-semibold">GPA</th>
                  <th className="px-4 py-3 text-left font-semibold">Marks Range</th>
                  <th className="px-4 py-3 text-left font-semibold">Performance</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((g, i) => (
                  <tr key={g.grade} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3">
                      <span className="font-bold text-primary-700">{g.grade}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{g.gpa}</td>
                    <td className="px-4 py-3 text-gray-600">{g.marks}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          g.grade === 'A+' ? 'bg-green-100 text-green-700'
                          : g.grade === 'A' ? 'bg-teal-100 text-teal-700'
                          : g.grade === 'A–' ? 'bg-blue-100 text-blue-700'
                          : g.grade === 'B' ? 'bg-indigo-100 text-indigo-700'
                          : g.grade === 'C' ? 'bg-yellow-100 text-yellow-700'
                          : g.grade === 'D' ? 'bg-orange-100 text-orange-700'
                          : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {g.label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Academic Calendar */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-accent-600 font-semibold text-sm uppercase tracking-wider mb-2">
              Schedule
            </p>
            <h2 className="section-title">Academic Calendar</h2>
            <div className="w-16 h-1 bg-accent-600 rounded mx-auto mb-4" />
            <p className="section-subtitle">Overview of key academic events throughout the year</p>
          </div>
          <div className="max-w-3xl mx-auto space-y-3">
            {calendar.map((item) => (
              <div
                key={item.month}
                className="flex items-start sm:items-center gap-4 bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2 min-w-[120px]">
                  <Calendar className="h-4 w-4 text-accent-600 flex-shrink-0" />
                  <span className="text-sm font-semibold text-primary-700">{item.month}</span>
                </div>
                <p className="text-sm text-gray-600">{item.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function SubjectGroup({
  title,
  items,
  color,
}: {
  title: string
  items: string[]
  color: 'primary' | 'accent' | 'blue' | 'purple' | 'orange'
}) {
  const colorMap = {
    primary: 'bg-primary-50 text-primary-700 border-primary-200',
    accent: 'bg-accent-50 text-accent-700 border-accent-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
  }
  const dotMap = {
    primary: 'bg-primary-500',
    accent: 'bg-accent-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  }
  return (
    <div className={`rounded-lg border p-3 ${colorMap[color]}`}>
      <h4 className="text-xs font-bold uppercase tracking-wider mb-2">{title}</h4>
      <ul className="space-y-1">
        {items.map((s) => (
          <li key={s} className="flex items-center gap-2 text-sm text-gray-700">
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotMap[color]}`} />
            {s}
          </li>
        ))}
      </ul>
    </div>
  )
}
