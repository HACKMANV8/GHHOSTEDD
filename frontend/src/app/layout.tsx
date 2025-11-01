// src/app/layout.tsx  <-- This is your ORIGINAL file, now cleaned up

import './globals.css'
import 'leaflet/dist/leaflet.css'
import React from 'react'
// 1. DO NOT import Navbar here anymore
import { AppThemeProvider } from './theme-provider'

export const metadata = {
  title: 'Naakshatra',
  description: 'Intelligent Life-Saving Detection System'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* 2. Only providers and children. No Navbar, no footer. */}
        <AppThemeProvider>
          {children}
        </AppThemeProvider>
      </body>
    </html>
  )
}