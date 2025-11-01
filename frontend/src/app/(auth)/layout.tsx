// src/app/(auth)/layout.tsx  <-- This is your other NEW file

import React from 'react'

export default function AuthLayout({
  children
}: {
  children: React.ReactNode
}) {
  // This layout just shows the page, nothing else.
  // We add the background color to match.
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-black">
      {children}
    </div>
  )
}