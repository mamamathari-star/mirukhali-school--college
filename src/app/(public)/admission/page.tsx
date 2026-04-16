'use client'

import { useState, useRef } from 'react'
import { CLASSES } from '@/lib/constants'
import {
  User,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Camera,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
} from 'lucide-react'

interface AdmissionForm {
  nameBn: string
  nameEn: string
  fatherName: string
  motherName: string
  dateOfBirth: string
  gender: string
  classApplying: string
  phone: string
  address: string
  photo: File | null
}

export default function AdmissionPage() {
  const [form, setForm] = useState<AdmissionForm>({
    nameBn: '',
    nameEn: '',
    fatherName: '',
    motherName: '',
    dateOfBirth: '',
    gender: '',
    classApplying: '',
    phone: '',
    address: '',
    photo: null,
  })
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof AdmissionForm, string>>>({})
  const fileRef = useRef<HTMLInputElement>(null)

  function validate(): boolean {
    const errs: Partial<Record<keyof AdmissionForm, string>> = {}
    if (!form.nameEn.trim()) errs.nameEn = 'English name is required'
    if (!form.fatherName.trim()) errs.fatherName = "Father's name is required"
    if (!form.motherName.trim()) errs.motherName = "Mother's name is required"
    if (!form.dateOfBirth) errs.dateOfBirth = 'Date of birth is required'
    if (!form.gender) errs.gender = 'Please select gender'
    if (!form.classApplying) errs.classApplying = 'Please select a class'
    if (!form.phone.trim()) errs.phone = 'Phone number is required'
    else if (!/^(\+?880|0)?1[3-9]\d{8}$/.test(form.phone.replace(/\s/g, '')))
      errs.phone = 'Enter a valid Bangladesh mobile number'
    if (!form.address.trim()) errs.address = 'Address is required'
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      Object.entries(form).forEach(([k, v]) => {
        if (v !== null && k !== 'photo') formData.append(k, v as string)
      })
      if (form.photo) formData.append('photo', form.photo)

      const res = await fetch('/api/admissions', { method: 'POST', body: formData })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || 'Submission failed. Please try again.')
      }
      const data = await res.json()
      setSuccess(data.applicationNo || 'SUCCESS')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      setFieldErrors((fe) => ({ ...fe, photo: 'Photo must be under 2MB' }))
      return
    }
    setForm((f) => ({ ...f, photo: file }))
    setPhotoPreview(URL.createObjectURL(file))
    setFieldErrors((fe) => ({ ...fe, photo: undefined }))
  }

  const inputCls = (field: keyof AdmissionForm) =>
    `w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
      fieldErrors[field] ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'
    }`

  if (success) {
    return (
      <>
        <section className="bg-gradient-to-br from-primary-800 to-primary-600 py-16">
          <div className="container">
            <h1 className="text-4xl font-extrabold text-white mb-4">Admission Application</h1>
          </div>
        </section>
        <section className="py-16 bg-gray-50">
          <div className="container max-w-lg">
            <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center shadow-sm">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Application Submitted!</h2>
              <p className="text-gray-600 mb-4">
                Your admission application has been received successfully. The administration will
                review your application and contact you soon.
              </p>
              {success !== 'SUCCESS' && (
                <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 mb-6">
                  <p className="text-xs font-semibold text-primary-700 uppercase tracking-wide mb-1">
                    Application Number
                  </p>
                  <p className="text-2xl font-bold text-primary-800">{success}</p>
                  <p className="text-xs text-gray-500 mt-1">Please save this for your records.</p>
                </div>
              )}
              <button
                onClick={() => {
                  setSuccess(null)
                  setForm({
                    nameBn: '',
                    nameEn: '',
                    fatherName: '',
                    motherName: '',
                    dateOfBirth: '',
                    gender: '',
                    classApplying: '',
                    phone: '',
                    address: '',
                    photo: null,
                  })
                  setPhotoPreview(null)
                }}
                className="btn-primary mt-2"
              >
                Submit Another Application
              </button>
            </div>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-800 to-primary-600 py-16">
        <div className="container">
          <div className="max-w-3xl">
            <p className="text-accent-300 text-sm font-semibold uppercase tracking-widest mb-2">
              Join Us
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
              Admission Application
            </h1>
            <p className="text-white/70 text-lg">
              Fill in the form below to apply for admission to Mirukhali School &amp; College.
              All fields marked with <span className="text-red-300">*</span> are required.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container max-w-3xl">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>

              {/* Student Name */}
              <fieldset className="space-y-4">
                <legend className="text-sm font-bold text-gray-700 uppercase tracking-wider border-b border-gray-100 pb-2 w-full flex items-center gap-2">
                  <User className="h-4 w-4 text-primary-700" />
                  Student Information
                </legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                      Name (Bengali) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="বাংলায় নাম লিখুন"
                      value={form.nameBn}
                      onChange={(e) => setForm((f) => ({ ...f, nameBn: e.target.value }))}
                      className={inputCls('nameBn')}
                    />
                    {fieldErrors.nameBn && <p className="text-xs text-red-500 mt-1">{fieldErrors.nameBn}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                      Name (English) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Full name in English"
                      value={form.nameEn}
                      onChange={(e) => setForm((f) => ({ ...f, nameEn: e.target.value }))}
                      className={inputCls('nameEn')}
                    />
                    {fieldErrors.nameEn && <p className="text-xs text-red-500 mt-1">{fieldErrors.nameEn}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                      Father&apos;s Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Father's full name"
                      value={form.fatherName}
                      onChange={(e) => setForm((f) => ({ ...f, fatherName: e.target.value }))}
                      className={inputCls('fatherName')}
                    />
                    {fieldErrors.fatherName && <p className="text-xs text-red-500 mt-1">{fieldErrors.fatherName}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                      Mother&apos;s Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Mother's full name"
                      value={form.motherName}
                      onChange={(e) => setForm((f) => ({ ...f, motherName: e.target.value }))}
                      className={inputCls('motherName')}
                    />
                    {fieldErrors.motherName && <p className="text-xs text-red-500 mt-1">{fieldErrors.motherName}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="date"
                        value={form.dateOfBirth}
                        onChange={(e) => setForm((f) => ({ ...f, dateOfBirth: e.target.value }))}
                        max={new Date().toISOString().split('T')[0]}
                        className={`${inputCls('dateOfBirth')} pl-9`}
                      />
                    </div>
                    {fieldErrors.dateOfBirth && <p className="text-xs text-red-500 mt-1">{fieldErrors.dateOfBirth}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.gender}
                      onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
                      className={inputCls('gender')}
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {fieldErrors.gender && <p className="text-xs text-red-500 mt-1">{fieldErrors.gender}</p>}
                  </div>
                </div>
              </fieldset>

              {/* Admission Details */}
              <fieldset className="space-y-4">
                <legend className="text-sm font-bold text-gray-700 uppercase tracking-wider border-b border-gray-100 pb-2 w-full flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary-700" />
                  Admission Details
                </legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                      Class Applying For <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.classApplying}
                      onChange={(e) => setForm((f) => ({ ...f, classApplying: e.target.value }))}
                      className={inputCls('classApplying')}
                    >
                      <option value="">Select class</option>
                      {CLASSES.map((c) => (
                        <option key={c} value={c}>Class {c}</option>
                      ))}
                    </select>
                    {fieldErrors.classApplying && <p className="text-xs text-red-500 mt-1">{fieldErrors.classApplying}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="tel"
                        placeholder="01XXXXXXXXX"
                        value={form.phone}
                        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                        className={`${inputCls('phone')} pl-9`}
                      />
                    </div>
                    {fieldErrors.phone && <p className="text-xs text-red-500 mt-1">{fieldErrors.phone}</p>}
                  </div>
                </div>
              </fieldset>

              {/* Address */}
              <fieldset className="space-y-4">
                <legend className="text-sm font-bold text-gray-700 uppercase tracking-wider border-b border-gray-100 pb-2 w-full flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary-700" />
                  Address
                </legend>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Full Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Village, Post Office, Upazila, District"
                    value={form.address}
                    onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                    className={`${inputCls('address')} resize-none`}
                  />
                  {fieldErrors.address && <p className="text-xs text-red-500 mt-1">{fieldErrors.address}</p>}
                </div>
              </fieldset>

              {/* Photo Upload */}
              <fieldset className="space-y-3">
                <legend className="text-sm font-bold text-gray-700 uppercase tracking-wider border-b border-gray-100 pb-2 w-full flex items-center gap-2">
                  <Camera className="h-4 w-4 text-primary-700" />
                  Applicant Photo (Optional)
                </legend>
                <div className="flex items-start gap-5">
                  {photoPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-24 h-28 object-cover rounded-lg border-2 border-primary-200 shadow-sm"
                    />
                  ) : (
                    <div className="w-24 h-28 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center flex-shrink-0">
                      <Camera className="h-8 w-8 text-gray-300" />
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="btn-secondary text-sm py-2 px-4"
                    >
                      {photoPreview ? 'Change Photo' : 'Upload Photo'}
                    </button>
                    <p className="text-xs text-gray-400 mt-2">
                      JPG, PNG, WebP — max 2MB. Passport size recommended.
                    </p>
                    {fieldErrors.photo && <p className="text-xs text-red-500 mt-1">{fieldErrors.photo}</p>}
                  </div>
                </div>
              </fieldset>

              {error && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center gap-2 py-3.5 text-base disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting Application…
                  </>
                ) : (
                  <>
                    Submit Application
                    <ChevronRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
