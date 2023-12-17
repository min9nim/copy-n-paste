import type { Metadata } from 'next'
import SweetAlertDarkMode from './SweetAlertDarkMode'
import './globals.css'

export const metadata: Metadata = {
  title: 'Copy & Paste',
  description: 'Copy and paste anything you want.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <SweetAlertDarkMode />
      <body>{children}</body>
    </html>
  )
}
