import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatDateShort(date: Date | string | null | undefined): string {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-BD', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function generateCertificateNo(type: string): string {
  const prefix = type === 'TESTIMONIAL' ? 'TST' : type === 'TRANSFER' ? 'TRF' : 'CHR'
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 90000) + 10000
  return `${prefix}-${year}-${random}`
}

export function calculateGrade(marks: number, total: number): string {
  const percentage = (marks / total) * 100
  if (percentage >= 80) return 'A+'
  if (percentage >= 70) return 'A'
  if (percentage >= 60) return 'A-'
  if (percentage >= 50) return 'B'
  if (percentage >= 40) return 'C'
  if (percentage >= 33) return 'D'
  return 'F'
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
