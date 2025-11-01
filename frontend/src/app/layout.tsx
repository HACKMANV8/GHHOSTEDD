// src/app/layout.tsx 

import './globals.css'
import 'leaflet/dist/leaflet.css'
import React from 'react'

// 1. DO NOT import Navbar here anymore
import { AppThemeProvider } from './theme-provider'
// 💡 NEW: Import the Toaster component from your UI directory
import { Toaster } from '@/components/ui/toaster' 

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
        
        {/* 🚀 ADDED: The Toaster component is placed here to display alerts */}
        <Toaster /> 
      </body>
    </html>
  )
}