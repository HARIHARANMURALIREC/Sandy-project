'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Scale, Menu, X, Globe } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTranslation } from 'react-i18next'

export function Navbar() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { t, i18n } = useTranslation()

  const toggleLanguage = () => {
    const languages = ['en', 'hi', 'ta']
    const currentIndex = languages.indexOf(i18n.language)
    const nextLanguage = languages[(currentIndex + 1) % languages.length]
    i18n.changeLanguage(nextLanguage)
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Scale className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary">Rights 360</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/dashboard" className="text-sm font-medium hover:text-primary">
              Dashboard
            </Link>
            <Link href="/learn" className="text-sm font-medium hover:text-primary">
              Learn
            </Link>
            <Link href="/quiz" className="text-sm font-medium hover:text-primary">
              Quiz
            </Link>
            <Link href="/ai-assistant" className="text-sm font-medium hover:text-primary">
              AI Assistant
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              className="hidden md:flex"
            >
              <Globe className="h-4 w-4" />
            </Button>

            {/* Auth */}
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                      {session.user?.name?.[0] || 'U'}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/dashboard"
                className="block px-3 py-2 text-sm font-medium hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/learn"
                className="block px-3 py-2 text-sm font-medium hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Learn
              </Link>
              <Link
                href="/quiz"
                className="block px-3 py-2 text-sm font-medium hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Quiz
              </Link>
              <Link
                href="/ai-assistant"
                className="block px-3 py-2 text-sm font-medium hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                AI Assistant
              </Link>
              
              {!session && (
                <>
                  <div className="border-t my-2" />
                  <Link
                    href="/login"
                    className="block px-3 py-2 text-sm font-medium hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="block px-3 py-2 text-sm font-medium hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
              
              <div className="border-t my-2" />
              <button
                onClick={toggleLanguage}
                className="block px-3 py-2 text-sm font-medium hover:text-primary w-full text-left"
              >
                Language: {i18n.language.toUpperCase()}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
