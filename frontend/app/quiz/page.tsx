'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Brain, Target, Trophy, Clock } from 'lucide-react'
import Link from 'next/link'
import { topicsAPI, quizAPI, type LegalTopic } from '@/lib/api'

export default function QuizPage() {
  const [topics, setTopics] = useState<LegalTopic[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTopics()
  }, [])

  const fetchTopics = async () => {
    try {
      setLoading(true)
      const data = await topicsAPI.getTopics()
      setTopics(data)
    } catch (error) {
      console.error('Error fetching topics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading topics...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">Quiz Center</h1>
        <p className="text-muted-foreground">
          Test your legal knowledge with interactive quizzes and track your progress.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Random Quiz
            </CardTitle>
            <CardDescription>
              Take a random quiz to test your knowledge across all topics.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/quiz/random">
                Start Random Quiz
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              My Results
            </CardTitle>
            <CardDescription>
              View your quiz history and track your improvement.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild className="w-full">
              <Link href="/quiz/results">
                View Results
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Topic-based Quizzes */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Quiz by Topic</h2>
        <p className="text-muted-foreground mb-6">
          Choose a specific legal topic to focus your quiz practice.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => (
          <Card key={topic.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{topic.title}</CardTitle>
              <CardDescription>{topic.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <Badge variant="secondary">{topic.category}</Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>5 min</span>
                </div>
              </div>

              <Button asChild className="w-full">
                <Link href={`/quiz/topic/${topic.id}`}>
                  <Brain className="mr-2 h-4 w-4" />
                  Start Quiz
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {topics.length === 0 && !loading && (
        <div className="text-center py-12">
          <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No quizzes available</h3>
          <p className="text-muted-foreground mb-4">
            Complete some learning modules first to unlock quizzes.
          </p>
          <Button asChild>
            <Link href="/learn">Start Learning</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
