"use client"
// 1. Import useState, useEffect, and useRef for the dropdown
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
// 2. Import ChevronDown for the dropdown icon
import { Target, LayoutDashboard, Cpu, Sun, Moon, Home, ChevronDown } from 'lucide-react' 
import { useTheme } from 'next-themes'

// 3. Mock data for the node list (replace with your actual data)
const nodes = [
  { id: 'node-a1', name: 'NODE-A1' },
  { id: 'node-l4', name: 'NODE-L4' },
  { id: 'node-b2', name: 'NODE-B2' },
]

export default function Navbar() {
  const [greeting, setGreeting] = useState('');
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()

  // 4. State to manage the dropdown's visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // 5. Ref to detect clicks outside the dropdown
  const dropdownRef = useRef<HTMLDivElement>(null);

  // --- useEffects ---
  useEffect(() => {
    setMounted(true)

    const getGreeting = () => {
      // ... (greeting logic is unchanged)
      const hour = new Date().getHours(); 
      if (hour >= 5 && hour < 12) setGreeting('Good morning');
      else if (hour >= 12 && hour < 18) setGreeting('Good afternoon');
      else setGreeting('Good evening');
    };
    getGreeting();

    // 6. Effect to handle clicks outside the dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };

  }, []); // Empty dependency array ensures this runs once on mount

  const toggleTheme = () => {
    const current = resolvedTheme || theme
    setTheme(current === 'dark' ? 'light' : 'dark')
  }

  if (!mounted) {
    return <nav className="h-[69px]"></nav>;
  }

  return (
    <nav className="
      sticky top-0 z-50 backdrop-blur-sm transition-all duration-300
      border-b
      bg-[color:var(--bg-secondary)]/90
      border-[color:var(--accent-green)]/20
    ">
      <div className="w-full px-4 py-4 flex items-center justify-between">
        
        {/* === LEFT SIDE (Logo) === */}
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
        <div className="flex items-center gap-6">
          
          <Link 
            href="/" 
            className="
              flex items-center gap-1.5 font-medium
              transition-colors duration-200
              text-[color:var(--text-secondary)]
              hover:text-[color:var(--accent-green)]
            "
          >
            <Home size={18} />
            Home
          </Link>

          {/* 7. Dropdown Menu */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="
                flex items-center gap-1.5 font-medium
                transition-colors duration-200
                text-[color:var(--text-secondary)]
                hover:text-[color:var(--accent-green)]
              "
            >
              <Cpu size={18} />
              Cadet's Status
              <ChevronDown size={16} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* 8. Dropdown Panel */}
            {isDropdownOpen && (
              <div className="
                absolute top-full left-0 mt-2 w-48
                bg-[color:var(--bg-secondary)]
                border border-[color:var(--accent-green)]/20
                rounded-md shadow-lg py-1
              ">
                {/* Add a link to the main node page if you have one */}
                <Link
                  href="/node"
                  className="block px-4 py-2 text-sm text-[color:var(--text-primary)] hover:bg-[color:var(--bg-accent)]"
                  onClick={() => setIsDropdownOpen(false)} // Close on click
                >
                  Node
                </Link>
                {/* Map over your list of nodes */}
                {nodes.map((node) => (
                  <Link 
                    key={node.id}
                    href={`/node/${node.id}`}
                    className="block px-4 py-2 text-sm text-[color:var(--text-primary)] hover:bg-[color:var(--bg-accent)]"
                    onClick={() => setIsDropdownOpen(false)} // Close on click
                  >
                    {node.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

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
        <div className="flex-1 flex items-center justify-end gap-6">
          {greeting && ( 
            <span className="text-[color:var(--text-secondary)]">
              {greeting}, Admin
            </span>
          )}
          <button 
            onClick={toggleTheme}
            className="
              transition-colors duration-200
              text-[color:var(--text-secondary)]
              hover:text-[color:var(--accent-green)]
            "
            aria-label="Toggle theme"
          >
            {mounted && (resolvedTheme || theme) === 'dark' ? (
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