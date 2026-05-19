"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Sun, Moon, Cpu, BarChart2, Users, FileText } from "lucide-react"

export default function Navbar() {
  const pathname = usePathname()
  const [darkMode, setDarkMode] = useState(true)

  useEffect(() => {
    // Initial theme setup (dark by default)
    const isDark = document.documentElement.classList.contains("dark") || 
                   (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
    
    if (isDark) {
      document.documentElement.classList.add("dark")
      setDarkMode(true)
    } else {
      document.documentElement.classList.remove("dark")
      setDarkMode(false)
    }
  }, [])

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
      setDarkMode(false)
    } else {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
      setDarkMode(true)
    }
  }

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Users },
    { href: "/analytics", label: "Analytics", icon: BarChart2 },
  ]

  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-neutral-200 dark:border-neutral-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-white dark:to-neutral-300 bg-clip-text text-transparent">
              VisionHire<span className="text-indigo-500 font-medium">.ai</span>
            </span>
          </Link>

          {/* Main Nav */}
          {pathname !== "/" && (
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold"
                        : "text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900/50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          {pathname === "/" ? (
            <Link
              href="/dashboard"
              className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-md transition-colors"
            >
              Launch App
            </Link>
          ) : (
            <Link
              href="/"
              className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white"
            >
              Landing Page
            </Link>
          )}
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-400 cursor-pointer transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  )
}
