import './globals.css'
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
        <div className="min-h-screen flex flex-col">
          <header className="w-full">
            <Navbar />
            </header>
            
            {/* This is the corrected line: 
              Removed "container", "mx-auto", "px-4", and "py-8"
            */}
            <main className="flex-1">{children}</main>
            
            <footer className="text-center py-4 text-sm text-slate-500">
              {new Date().getFullYear()} Naakshatra — Hackathon build
              </footer>
              </div>
              </AppThemeProvider>
              </body>
              </html>
              )
            }