"use client"

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Target, LayoutDashboard, Cpu, Sun, Moon, Home, ChevronDown } from 'lucide-react'
import { useTheme } from 'next-themes'

const nodes = [
  { id: 'node-a1', name: 'NODE-A1', status: 'OPERATIONAL' },
  { id: 'node-l4', name: 'NODE-L4', status: 'WARNING' },
  { id: 'node-b2', name: 'NODE-B2', status: 'OPERATIONAL' },
]

export default function Navbar() {
  const [greeting, setGreeting] = useState('')
  const [mounted, setMounted] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { theme, setTheme, resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)

    // Greeting logic
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) setGreeting('Good morning')
    else if (hour >= 12 && hour < 18) setGreeting('Good afternoon')
    else setGreeting('Good evening')

    // Close dropdown on outside click
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleTheme = () => {
    const current = resolvedTheme || theme
    setTheme(current === 'dark' ? 'light' : 'dark')
  }

  if (!mounted) {
    return <nav className="h-[69px]"></nav>
  }

  return (
    <nav className="
      sticky top-0 z-50 
      bg-black/95
      backdrop-blur-xl
      border-b border-emerald-500/30
      transition-all duration-300
    ">
      <div className="w-full px-4 py-4 flex items-center justify-between">
        
        {/* === LEFT: Logo === */}
        <div className="flex-1">
          <Link 
            href="/" 
            className="
              flex items-center gap-2 text-xl font-bold tracking-wide
              text-emerald-400 hover:text-emerald-300
              transition-colors duration-200
            "
          >
            <Target size={24} />
            Naakshatra
          </Link>
        </div>

        {/* === CENTER: Nav Links === */}
        <div className="flex items-center gap-6">
          
          <Link 
            href="/" 
            className="
              flex items-center gap-1.5 font-medium
              text-gray-400 hover:text-emerald-400
              transition-colors duration-200
            "
          >
            <Home size={18} />
            Home
          </Link>

          {/* === DROPDOWN MENU === */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`
                flex items-center gap-1.5 font-medium rounded-md px-2 py-1
                transition-all duration-200
                ${isDropdownOpen 
                  ? 'text-emerald-400 bg-gray-800/50' 
                  : 'text-gray-400 hover:text-emerald-400'
                }
              `}
            >
              <Cpu size={18} />
              Cadet's Status
              <ChevronDown size={16} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* === DROPDOWN PANEL === */}
            {isDropdownOpen && (
              <div className="
                absolute top-full left-0 mt-3 w-72 z-50
                bg-gray-900
                border border-emerald-500/50
                rounded-xl shadow-2xl py-3
                backdrop-blur-xl
                ring-2 ring-emerald-500/20
                overflow-hidden
                animate-in fade-in-0 zoom-in-95 duration-100
              ">
                {/* Header */}
                <div className="px-4 pb-2 border-b border-emerald-500/20">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Nodes
                  </p>
                </div>

                {/* Node Overview */}
                <Link
                  href="/node"
                  className="flex items-center justify-between px-4 py-3 text-sm text-gray-100 hover:bg-gray-800 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    <Cpu size={14} className="text-emerald-400" />
                    Node Overview
                  </span>
                </Link>

                {/* Node List */}
                {nodes.map((node) => (
                  <Link
                    key={node.id}
                    href={`/node/${node.id}`}
                    className="flex items-center justify-between px-4 py-3 text-sm text-gray-100 hover:bg-gray-800 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <span className="font-mono text-emerald-300">{node.name}</span>
                    <span className={`
                      text-xs px-2.5 py-0.5 rounded-full font-bold border
                      ${node.status === 'WARNING'
                        ? 'bg-orange-500/20 text-orange-400 border-orange-500/50'
                        : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                      }
                    `}>
                      {node.status}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link 
            href="/admin" 
            className="
              flex items-center gap-1.5 font-medium
              text-gray-400 hover:text-emerald-400
              transition-colors duration-200
            "
          >
            <LayoutDashboard size={18} />
            Admin
          </Link>
        </div>

        {/* === RIGHT: Greeting + Theme Toggle === */}
        <div className="flex-1 flex items-center justify-end gap-6">
          {greeting && (
            <span className="text-gray-400">
              {greeting}, Admin
            </span>
          )}
          <button 
            onClick={toggleTheme}
            className="
              text-gray-400 hover:text-emerald-400
              transition-colors duration-200
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