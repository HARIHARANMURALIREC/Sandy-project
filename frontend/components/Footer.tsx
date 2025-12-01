import Link from 'next/link'
import { Scale } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Scale className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-primary">Rights 360</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Making legal knowledge accessible, interactive, and inclusive for everyone.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/dashboard" className="text-muted-foreground hover:text-primary">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/learn" className="text-muted-foreground hover:text-primary">
                  Learn
                </Link>
              </li>
              <li>
                <Link href="/quiz" className="text-muted-foreground hover:text-primary">
                  Quiz
                </Link>
              </li>
              <li>
                <Link href="/ai-assistant" className="text-muted-foreground hover:text-primary">
                  AI Assistant
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Topics */}
          <div className="space-y-4">
            <h3 className="font-semibold">Topics</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/learn/gender-rights" className="text-muted-foreground hover:text-primary">
                  Gender Rights
                </Link>
              </li>
              <li>
                <Link href="/learn/cyber-laws" className="text-muted-foreground hover:text-primary">
                  Cyber Laws
                </Link>
              </li>
              <li>
                <Link href="/learn/labour-rights" className="text-muted-foreground hover:text-primary">
                  Labour Rights
                </Link>
              </li>
              <li>
                <Link href="/learn/consumer-rights" className="text-muted-foreground hover:text-primary">
                  Consumer Rights
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="text-muted-foreground hover:text-primary">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Rights 360. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
