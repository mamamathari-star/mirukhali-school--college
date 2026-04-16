import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Mirukhali School & College',
    template: '%s | Mirukhali School & College',
  },
  description:
    'Official website of Mirukhali School & College, EIIN 102726, Mirukhali, Mathbaria, Pirojpur, Bangladesh. Established in 1937.',
  keywords: [
    'Mirukhali School',
    'Mirukhali College',
    'Mathbaria',
    'Pirojpur',
    'Bangladesh',
    'EIIN 102726',
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  )
}
