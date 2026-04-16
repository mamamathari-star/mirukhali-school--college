'use client'

import { useState } from 'react'
import {
  MapPin,
  Phone,
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  MessageSquare,
} from 'lucide-react'
import {
  SCHOOL_NAME,
  SCHOOL_ADDRESS,
  SCHOOL_PHONE,
  SCHOOL_EMAIL,
} from '@/lib/constants'

interface ContactForm {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

export default function ContactPage() {
  const [form, setForm] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Partial<ContactForm>>({})

  function validate(): boolean {
    const errs: Partial<ContactForm> = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email'
    if (!form.subject.trim()) errs.subject = 'Subject is required'
    if (!form.message.trim()) errs.message = 'Message is required'
    else if (form.message.trim().length < 10) errs.message = 'Message must be at least 10 characters'
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || 'Failed to send message.')
      }
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = (field: keyof ContactForm) =>
    `w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
      fieldErrors[field] ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'
    }`

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-800 to-primary-600 py-16">
        <div className="container">
          <div className="max-w-3xl">
            <p className="text-accent-300 text-sm font-semibold uppercase tracking-widest mb-2">
              Reach Out
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">Contact Us</h1>
            <p className="text-white/70 text-lg">
              Have a question or enquiry? We&apos;d love to hear from you. Fill in the form or use
              our contact details below.
            </p>
          </div>
        </div>
      </section>

      <section className="py-14 bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Contact Info */}
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Get in Touch</h2>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                <ContactInfoItem
                  icon={MapPin}
                  title="Address"
                  content={SCHOOL_ADDRESS}
                  link={null}
                />
                <ContactInfoItem
                  icon={Phone}
                  title="Phone"
                  content={SCHOOL_PHONE}
                  link={`tel:${SCHOOL_PHONE}`}
                />
                <ContactInfoItem
                  icon={Mail}
                  title="Email"
                  content={SCHOOL_EMAIL}
                  link={`mailto:${SCHOOL_EMAIL}`}
                />
                <ContactInfoItem
                  icon={Clock}
                  title="Office Hours"
                  content="Saturday – Thursday: 9:00 AM – 4:00 PM"
                  link={null}
                />
              </div>

              {/* Map placeholder */}
              <div className="bg-gray-100 rounded-2xl h-52 flex items-center justify-center border border-gray-200">
                <div className="text-center text-gray-400">
                  <MapPin className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm font-medium">Mirukhali, Mathbaria</p>
                  <p className="text-xs">Pirojpur, Bangladesh</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
                {success ? (
                  <div className="py-12 text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                      <CheckCircle2 className="h-10 w-10 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Message Sent!</h3>
                    <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
                      Thank you for reaching out. We&apos;ll get back to you as soon as possible.
                    </p>
                    <button
                      onClick={() => {
                        setSuccess(false)
                        setForm({ name: '', email: '', phone: '', subject: '', message: '' })
                      }}
                      className="btn-primary"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-primary-700" />
                      Send a Message
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                            Your Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Full name"
                            value={form.name}
                            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                            className={inputCls('name')}
                          />
                          {fieldErrors.name && <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>}
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                            Email Address <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                            className={inputCls('email')}
                          />
                          {fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                            Phone (Optional)
                          </label>
                          <input
                            type="tel"
                            placeholder="01XXXXXXXXX"
                            value={form.phone}
                            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                            className={inputCls('phone')}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                            Subject <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Brief subject"
                            value={form.subject}
                            onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                            className={inputCls('subject')}
                          />
                          {fieldErrors.subject && <p className="text-xs text-red-500 mt-1">{fieldErrors.subject}</p>}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                          Message <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          rows={5}
                          placeholder="Write your message here…"
                          value={form.message}
                          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                          className={`${inputCls('message')} resize-none`}
                        />
                        {fieldErrors.message && <p className="text-xs text-red-500 mt-1">{fieldErrors.message}</p>}
                      </div>

                      {error && (
                        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
                          <AlertCircle className="h-4 w-4 flex-shrink-0" />
                          {error}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary flex items-center gap-2 px-8 py-3 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <>
                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Sending…
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            Send Message
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function ContactInfoItem({
  icon: Icon,
  title,
  content,
  link,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  content: string
  link: string | null
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="h-4 w-4 text-primary-700" />
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{title}</p>
        {link ? (
          <a href={link} className="text-sm text-gray-800 hover:text-primary-700 transition-colors mt-0.5 block">
            {content}
          </a>
        ) : (
          <p className="text-sm text-gray-800 mt-0.5">{content}</p>
        )}
      </div>
    </div>
  )
}
