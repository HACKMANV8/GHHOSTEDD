import './globals.css'
import 'leaflet/dist/leaflet.css' // <-- 1. ADD THIS IMPORT
import React from 'react'
import Navbar from '../components/Navbar'
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
        <AppThemeProvider>
          {/* 2. ADDED RESPONSIVE BACKGROUND */}
          <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-black">
            <header className="w-full">
              <Navbar />
            </header>
            
            <main className="flex-1">{children}</main>
            
            {/* 3. ADDED RESPONSIVE FOOTER TEXT */}
            <footer className="text-center py-4 text-sm text-slate-500 dark:text-slate-400">
              {new Date().getFullYear()} Naakshatra — Hackathon build
            </footer>
          </div>
        </AppThemeProvider>
      </body>
    </html>
  )
}