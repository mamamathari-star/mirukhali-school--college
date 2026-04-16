'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck, Search, HelpCircle, QrCode, Info } from 'lucide-react'

export default function VerifyPage() {
  const [certNo, setCertNo] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = certNo.trim()
    if (!trimmed) {
      setError('Please enter a certificate number.')
      return
    }
    if (trimmed.length < 4) {
      setError('Certificate number appears too short. Please check and try again.')
      return
    }
    setError('')
    router.push(`/verify/${encodeURIComponent(trimmed)}`)
  }

  const steps = [
    {
      step: '1',
      title: 'Enter Certificate Number',
      desc: 'Type the unique certificate number printed on your certificate document.',
      icon: Search,
    },
    {
      step: '2',
      title: 'Submit & Verify',
      desc: 'Click the Verify button. Our system will instantly check the authenticity.',
      icon: ShieldCheck,
    },
    {
      step: '3',
      title: 'View Result',
      desc: 'See the certificate details and verification status — Valid or Revoked.',
      icon: Info,
    },
  ]

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-800 to-primary-600 py-16">
        <div className="container">
          <div className="max-w-3xl">
            <p className="text-accent-300 text-sm font-semibold uppercase tracking-widest mb-2">
              Authenticity Check
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
              Certificate Verification
            </h1>
            <p className="text-white/70 text-lg">
              Instantly verify the authenticity of any certificate issued by Mirukhali School &amp;
              College using the certificate number or QR code.
            </p>
          </div>
        </div>
      </section>

      <section className="py-14 bg-gray-50 min-h-[60vh]">
        <div className="container max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Search Form */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="h-6 w-6 text-primary-700" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">Verify Certificate</h2>
                  <p className="text-sm text-gray-500">Enter the certificate number below</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Certificate Number
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="e.g. MSC-2024-001"
                      value={certNo}
                      onChange={(e) => {
                        setCertNo(e.target.value)
                        setError('')
                      }}
                      className={`w-full pl-9 pr-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        error ? 'border-red-400 bg-red-50' : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
                </div>
                <button type="submit" className="w-full btn-primary py-3 flex items-center justify-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Verify Certificate
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-gray-100">
                <div className="flex items-start gap-3 text-sm text-gray-500">
                  <QrCode className="h-5 w-5 flex-shrink-0 text-accent-600 mt-0.5" />
                  <p>
                    <span className="font-semibold text-gray-700">Have a QR code?</span> Scan the
                    QR code on your certificate using your phone&apos;s camera — it will
                    automatically redirect to this verification page with the certificate number
                    pre-filled.
                  </p>
                </div>
              </div>
            </div>

            {/* How it works */}
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-accent-600" />
                How It Works
              </h2>
              <div className="space-y-4">
                {steps.map((s) => (
                  <div key={s.step} className="flex items-start gap-4 bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                    <div className="w-10 h-10 rounded-full bg-primary-800 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {s.step}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm">{s.title}</h3>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-accent-50 border border-accent-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-accent-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-accent-800 mb-1">Important Notice</p>
                    <p className="text-accent-700 leading-relaxed">
                      Only certificates issued directly by Mirukhali School &amp; College
                      (EIIN 102726) can be verified through this portal. For any discrepancies,
                      please contact the school office directly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
