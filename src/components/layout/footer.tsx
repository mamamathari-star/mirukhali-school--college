import React from 'react'
import Link from 'next/link'
import { MapPin, Phone, Mail, Facebook, Youtube, ExternalLink } from 'lucide-react'
import {
  SCHOOL_NAME,
  SCHOOL_NAME_BN,
  SCHOOL_ADDRESS,
  SCHOOL_PHONE,
  SCHOOL_EMAIL,
  SCHOOL_EIIN,
  SCHOOL_ESTABLISHED,
} from '@/lib/constants'

const quickLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Academics', href: '/academics' },
  { label: 'Our Teachers', href: '/teachers' },
  { label: 'Notice Board', href: '/notices' },
  { label: 'Exam Results', href: '/results' },
  { label: 'Admission', href: '/admission' },
]

const moreLinks = [
  { label: 'Governing Body', href: '/committee' },
  { label: 'Photo Gallery', href: '/gallery' },
  { label: 'Facilities', href: '/facilities' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Verify Certificate', href: '/verify' },
  { label: 'Admin Portal', href: '/admin' },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary-900 text-gray-300">
      {/* Main footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* School info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary-800 font-bold text-lg shadow-md ring-2 ring-accent-600 flex-shrink-0">
                MSC
              </div>
              <div>
                <div className="font-bold text-white text-sm leading-tight">{SCHOOL_NAME}</div>
                <div className="text-xs text-gray-400">{SCHOOL_NAME_BN}</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              A premier educational institution in Mathbaria, Pirojpur, Bangladesh. Committed to
              excellence in education since {SCHOOL_ESTABLISHED.split(' ').pop()}.
            </p>
            <div className="text-xs text-gray-500 space-y-1">
              <p>EIIN: {SCHOOL_EIIN}</p>
              <p>Established: {SCHOOL_ESTABLISHED}</p>
            </div>
            {/* Social links */}
            <div className="flex gap-3 mt-5">
              <a
                href="#"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-primary-700 hover:bg-accent-600 flex items-center justify-center transition-colors"
              >
                <Facebook className="h-4 w-4 text-white" />
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="w-8 h-8 rounded-full bg-primary-700 hover:bg-accent-600 flex items-center justify-center transition-colors"
              >
                <Youtube className="h-4 w-4 text-white" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 pb-2 border-b border-primary-700">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-accent-400 transition-colors flex items-center gap-1.5"
                  >
                    <span className="text-accent-600">›</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 pb-2 border-b border-primary-700">
              More
            </h4>
            <ul className="space-y-2">
              {moreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-accent-400 transition-colors flex items-center gap-1.5"
                  >
                    <span className="text-accent-600">›</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 pb-2 border-b border-primary-700">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-accent-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-400">{SCHOOL_ADDRESS}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-accent-500 flex-shrink-0" />
                <a
                  href={`tel:${SCHOOL_PHONE}`}
                  className="text-sm text-gray-400 hover:text-accent-400 transition-colors"
                >
                  {SCHOOL_PHONE}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-accent-500 flex-shrink-0" />
                <a
                  href={`mailto:${SCHOOL_EMAIL}`}
                  className="text-sm text-gray-400 hover:text-accent-400 transition-colors"
                >
                  {SCHOOL_EMAIL}
                </a>
              </li>
            </ul>

            {/* Useful external links */}
            <div className="mt-5 pt-4 border-t border-primary-700">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">
                Important Links
              </p>
              <ul className="space-y-1.5">
                {[
                  { label: 'Bangladesh Education Board', href: 'http://www.educationboard.gov.bd' },
                  { label: 'NCTB', href: 'http://www.nctb.gov.bd' },
                ].map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gray-500 hover:text-accent-400 transition-colors flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary-800">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>
            © {currentYear} {SCHOOL_NAME}. All rights reserved.
          </p>
          <p>
            Powered by{' '}
            <span className="text-accent-500 font-medium">MSC Digital Platform</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
