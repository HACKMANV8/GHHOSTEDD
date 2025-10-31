import './globals.css'
import React from 'react'
import Navbar from '../components/Navbar'
import { AppThemeProvider } from './theme-provider' // 1. IMPORT the provider

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
    // 2. REMOVE className="dark" and ADD suppressHydrationWarning
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* 3. WRAP your entire layout with the provider */}
        <AppThemeProvider>
          <div className="min-h-screen flex flex-col">
            <header className="w-full">
              <Navbar />
            </header>
            <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
            <footer className="text-center py-4 text-sm text-slate-500">
              {new Date().getFullYear()} Naakshatra — Hackathon build
            </footer>
          </div>
        </AppThemeProvider>
      </body>
    </html>
  )
}
