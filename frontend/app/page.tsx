import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Scale, BookOpen, Brain, Mic, Globe, Award } from 'lucide-react'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-16">
        <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
          Rights 360
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Empowering everyone with knowledge of their legal rights and responsibilities through interactive learning and AI assistance.
        </p>
        {session ? (
          <Link href="/dashboard">
            <Button size="lg" className="btn-primary">
              Go to Dashboard
            </Button>
          </Link>
        ) : (
          <div className="flex gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="btn-primary">
                Get Started
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline">
                Sign Up
              </Button>
            </Link>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Core Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <Scale className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Learn Your Rights</CardTitle>
              <CardDescription>
                Access simplified explanations of complex legal topics tailored to your needs.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Brain className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Interactive Quizzes</CardTitle>
              <CardDescription>
                Test your knowledge with gamified quizzes and track your progress.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <BookOpen className="h-12 w-12 text-primary mb-4" />
              <CardTitle>AI Legal Assistant</CardTitle>
              <CardDescription>
                Get instant answers to legal questions in simple, understandable language.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Mic className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Voice Navigation</CardTitle>
              <CardDescription>
                Navigate and interact using voice commands for better accessibility.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Globe className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Multilingual Support</CardTitle>
              <CardDescription>
                Available in English, Hindi, Tamil and other regional languages.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Award className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Gamification</CardTitle>
              <CardDescription>
                Earn badges, streaks, and compete on leaderboards for motivation.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Topics Section */}
      <section className="py-16 bg-muted/50 rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-12">Legal Topics</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            'Gender Rights',
            'Cyber Laws', 
            'Labour Rights',
            'Consumer Rights',
            'Property Rights',
            'Criminal Law',
            'Constitutional Law',
            'Family Law'
          ].map((topic) => (
            <Card key={topic} className="text-center hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <h3 className="font-semibold">{topic}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
