import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'

const outfit = Outfit({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
})

export const metadata: Metadata = {
  title: {
    template: '%s | Caleb University Service Desk',
    default: 'Caleb University Service Desk',
  },
  description:
    'Submit and track student service requests at Caleb University.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${outfit.variable} antialiased`}>
      <body className="font-sans animate-in fade-in duration-500">{children}</body>
    </html>
  )
}
