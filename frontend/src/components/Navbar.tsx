"use client"
import React, { useState, useEffect } from 'react'

// --- MOCK DEPENDENCIES (for preview environment) ---
// In your real project, you would remove these mocks and use your actual imports.

// Mock next/link
const Link = ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: any }) => (
  <a href={href} {...props}>{children}</a>
)

// Mock lucide-react icons
const Target = ({ size = 24 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
const LayoutDashboard = ({ size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
const Cpu = ({ size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
const Sun = ({ size = 20 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
const Moon = ({ size = 20 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>

// Mock next-themes
const useTheme = () => {
  const [theme, setTheme] = useState('dark') // Default to 'dark' for the mock
  return { theme, setTheme }
}

// --- END OF MOCK DEPENDENCIES ---


export default function Navbar() {
  // --- State for the Dynamic Greeting ---
  const [greeting, setGreeting] = useState('');
  
  // --- Theme State ---
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // --- useEffects ---
  useEffect(() => {
    // This prevents hydration mismatch for the theme
    setMounted(true)

    // This sets the greeting
    const getGreeting = () => {
      const hour = new Date().getHours(); 
      if (hour >= 5 && hour < 12) setGreeting('Good morning');
      else if (hour >= 12 && hour < 18) setGreeting('Good afternoon');
      else setGreeting('Good evening');
    };
    getGreeting();
  }, []); 

  // Function to toggle theme
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }

  // We must wait for the component to mount to know the theme
  if (!mounted) {
    // Render a basic layout or null to avoid hydration errors
    return <nav className="h-[69px]"></nav>;
  }

  // --- JSX Layout ---
  return (
    <nav className="
      sticky top-0 z-50 backdrop-blur-sm transition-all duration-300
      border-b
      bg-[color:var(--bg-secondary)]/90
      border-[color:var(--accent-green)]/20
    ">
      {/* FIX: Replaced 'container mx-auto' with 'w-full'
        This makes the div full-width, and the padding (px-4)
        prevents content from touching the edges.
      */}
      <div className="w-full px-4 py-4 flex items-center justify-between">
        
        {/* === LEFT SIDE (Logo) === */}
        {/* flex-1 causes this to take up available space, pushing to the left */}
        <div className="flex-1">
          <Link 
            href="/" 
            className="
              flex items-center gap-2 text-xl font-bold tracking-wide
              transition-colors duration-200
              text-[color:var(--accent-green)] hover:text-[color:var(--accent-green)]/80
            "
          >
            <Target size={24} />
            Naakshatra
          </Link>
        </div>

        {/* === CENTER (Nav Links) === */}
        {/* This div is not flex-1, so it just takes its own content width */}
        <div className="flex items-center gap-6">
          <Link 
            href="/node" 
            className="
              flex items-center gap-1.5 font-medium
              transition-colors duration-200
              text-[color:var(--text-secondary)]
              hover:text-[color:var(--accent-green)]
            "
          >
            <Cpu size={18} />
            Node
          </Link>
          <Link 
            href="/admin" 
            className="
              flex items-center gap-1.5 font-medium
              transition-colors duration-200
              text-[color:var(--text-secondary)]
              hover:text-[color:var(--accent-green)]
            "
          >
            <LayoutDashboard size={18} />
            Admin
          </Link>
        </div>

        {/* === RIGHT SIDE (Greeting & Theme Toggle) === */}
        {/* flex-1 causes this to take up available space, pushing to the right */}
        <div className="flex-1 flex items-center justify-end gap-6">
          
          {/* Greeting */}
          {greeting && ( 
            <span className="text-[color:var(--text-secondary)]">
              {greeting}, Admin
            </span>
          )}

          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme}
            className="
              transition-colors duration-200
              text-[color:var(--text-secondary)]
              hover:text-[color:var(--accent-green)]
            "
            aria-label="Toggle theme"
          >
            {/* Show Moon in Light, Sun in Dark */}
            {theme === 'dark' ? (
              <Sun size={20} />
            ) : (
              <Moon size={20} />
            )}
          </button>
        </div>

      </div>
    </nav>
  )
}
