import type { Metadata } from 'next'
import Link from 'next/link'
import { SCHOOL_NAME } from '@/lib/constants'
import {
  ShieldCheck,
  ShieldX,
  ArrowLeft,
  Calendar,
  User,
  Award,
  Hash,
  AlertTriangle,
} from 'lucide-react'

interface Certificate {
  id: string
  certificateNo: string
  studentName: string
  type: string
  issueDate: string
  status: 'VALID' | 'REVOKED'
  class?: string
  year?: string
  details?: string
}

async function getCertificate(certNo: string): Promise<Certificate | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const res = await fetch(
      `${baseUrl}/api/verify/${encodeURIComponent(certNo)}`,
      { cache: 'no-store' }
    )
    if (!res.ok) return null
    const data = await res.json()
    return data.certificate || null
  } catch {
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: { certificateNo: string }
}): Promise<Metadata> {
  return {
    title: `Verify ${decodeURIComponent(params.certificateNo)} | ${SCHOOL_NAME}`,
    description: 'Certificate verification result from Mirukhali School & College.',
  }
}

export default async function VerifyCertificatePage({
  params,
}: {
  params: { certificateNo: string }
}) {
  const certNo = decodeURIComponent(params.certificateNo)
  const certificate = await getCertificate(certNo)
  const verifiedAt = new Date().toLocaleString('en-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <>
      {/* Hero */}
      <section
        className={`py-14 ${
          certificate && certificate.status === 'VALID'
            ? 'bg-gradient-to-br from-primary-800 to-primary-600'
            : certificate && certificate.status === 'REVOKED'
            ? 'bg-gradient-to-br from-orange-700 to-orange-500'
            : 'bg-gradient-to-br from-red-700 to-red-500'
        }`}
      >
        <div className="container">
          <Link
            href="/verify"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Verification
          </Link>
          <div className="flex items-center gap-4">
            {certificate ? (
              certificate.status === 'VALID' ? (
                <ShieldCheck className="h-14 w-14 text-white" />
              ) : (
                <AlertTriangle className="h-14 w-14 text-white" />
              )
            ) : (
              <ShieldX className="h-14 w-14 text-white" />
            )}
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
                {certificate
                  ? certificate.status === 'VALID'
                    ? 'Certificate Verified'
                    : 'Certificate Revoked'
                  : 'Certificate Not Found'}
              </h1>
              <p className="text-white/70 mt-1 text-sm">
                Certificate No: <strong className="text-white">{certNo}</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container max-w-3xl">
          {certificate ? (
            <>
              {/* Status Banner */}
              <div
                className={`rounded-2xl p-5 mb-6 flex items-center gap-4 ${
                  certificate.status === 'VALID'
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-orange-50 border border-orange-200'
                }`}
              >
                {certificate.status === 'VALID' ? (
                  <ShieldCheck className="h-8 w-8 text-green-600 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="h-8 w-8 text-orange-600 flex-shrink-0" />
                )}
                <div>
                  <h2
                    className={`text-lg font-bold ${
                      certificate.status === 'VALID' ? 'text-green-800' : 'text-orange-800'
                    }`}
                  >
                    {certificate.status === 'VALID'
                      ? '✓ This is a valid, authentic certificate'
                      : '⚠ This certificate has been revoked'}
                  </h2>
                  <p
                    className={`text-sm mt-0.5 ${
                      certificate.status === 'VALID' ? 'text-green-700' : 'text-orange-700'
                    }`}
                  >
                    {certificate.status === 'VALID'
                      ? 'This certificate was issued by Mirukhali School & College and is currently active.'
                      : 'This certificate has been revoked by the institution. Please contact the school office.'}
                  </p>
                </div>
              </div>

              {/* Certificate Details */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-primary-800 px-6 py-4">
                  <h3 className="text-white font-bold flex items-center gap-2">
                    <Award className="h-5 w-5 text-accent-300" />
                    Certificate Details
                  </h3>
                </div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: Hash, label: 'Certificate No', value: certificate.certificateNo },
                    { icon: User, label: 'Student Name', value: certificate.studentName },
                    { icon: Award, label: 'Certificate Type', value: certificate.type },
                    {
                      icon: Calendar,
                      label: 'Issue Date',
                      value: new Date(certificate.issueDate).toLocaleDateString('en-BD', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }),
                    },
                    ...(certificate.class
                      ? [{ icon: Award, label: 'Class', value: certificate.class }]
                      : []),
                    ...(certificate.year
                      ? [{ icon: Calendar, label: 'Year', value: certificate.year }]
                      : []),
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-4 w-4 text-primary-700" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                          {label}
                        </p>
                        <p className="text-sm font-semibold text-gray-800 mt-0.5">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {certificate.details && (
                  <div className="px-6 pb-6">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                      Additional Details
                    </p>
                    <p className="text-sm text-gray-700">{certificate.details}</p>
                  </div>
                )}
              </div>

              {/* Verification Timestamp */}
              <div className="mt-4 bg-white rounded-xl border border-gray-100 px-5 py-3 flex items-center gap-3 text-xs text-gray-500">
                <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                Verified on: <span className="font-medium text-gray-600">{verifiedAt}</span>
              </div>
            </>
          ) : (
            /* Not Found */
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <ShieldX className="h-10 w-10 text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-3">Certificate Not Found</h2>
              <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
                No certificate with number <strong>&ldquo;{certNo}&rdquo;</strong> was found in our
                records. Please double-check the number and try again.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800 text-left max-w-sm mx-auto mb-6">
                <p className="font-semibold mb-1">Possible Reasons:</p>
                <ul className="space-y-1 text-xs text-yellow-700">
                  <li>• The certificate number may be entered incorrectly</li>
                  <li>• The certificate may not yet be registered in the system</li>
                  <li>• The certificate may have been issued before digitalisation</li>
                </ul>
              </div>
              <Link href="/verify" className="btn-primary inline-flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Try Again
              </Link>
            </div>
          )}

          {/* Footer note */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              Verification powered by{' '}
              <span className="text-primary-700 font-semibold">MSC Digital Platform</span> &bull;
              EIIN 102726
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
