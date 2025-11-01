// src/app/(app)/layout.tsx  <-- This is your NEW file

import React from 'react'
// The path needs '../..' to go up two levels from (app)/layout.tsx
import Navbar from '../../components/Navbar' 

export default function AppLayout({
  children
}: {
  children: React.ReactNode
}) {
  // This is the layout code from your original file
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-black">
      <header className="w-full">
        <Navbar />
      </header>

      <main className="flex-1">{children}</main>

      <footer className="text-center py-4 text-sm text-slate-500 dark:text-slate-400">
        {new Date().getFullYear()} Naakshatra — Hackathon build
      </footer>
    </div>
  )
}