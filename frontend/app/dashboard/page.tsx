'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Trophy, BookOpen, Brain, Target, Award, TrendingUp, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { topicsAPI, quizAPI, type UserProgress, type LegalTopic } from '@/lib/api'

interface DashboardData {
  userProgress: UserProgress[]
  recentQuizResults: any[]
  totalTopics: number
  completedTopics: number
  averageQuizScore: number
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      fetchDashboardData()
    }
  }, [status, router])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch user progress and topics
      const [progressData, topicsData, quizResults] = await Promise.all([
        topicsAPI.getUserProgress().catch(() => []),
        topicsAPI.getTopics().catch(() => []),
        quizAPI.getResults().catch(() => [])
      ])

      const completedTopics = progressData.filter((p: UserProgress) => p.completed).length
      const totalTopics = topicsData.length
      
      // Calculate average quiz score
      const averageQuizScore = quizResults.length > 0 
        ? Math.round(quizResults.reduce((sum: number, result: any) => sum + (result.score * 100), 0) / quizResults.length)
        : 0

      setDashboardData({
        userProgress: progressData,
        recentQuizResults: quizResults.slice(0, 5),
        totalTopics,
        completedTopics,
        averageQuizScore
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      // Set fallback data
      setDashboardData({
        userProgress: [],
        recentQuizResults: [],
        totalTopics: 0,
        completedTopics: 0,
        averageQuizScore: 0
      })
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Failed to load dashboard data</p>
          <Button onClick={fetchDashboardData}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  const progressPercentage = dashboardData.totalTopics > 0 
    ? (dashboardData.completedTopics / dashboardData.totalTopics) * 100 
    : 0

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">
            Welcome back, {session?.user?.name || 'Legal Explorer'}!
          </h1>
          <p className="text-muted-foreground">
            Continue your legal learning journey with personalized recommendations.
          </p>
        </div>
        <Button variant="outline" onClick={fetchDashboardData}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.completedTopics}/{dashboardData.totalTopics}</div>
            <Progress value={progressPercentage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quiz Score</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.averageQuizScore}%</div>
            <p className="text-xs text-muted-foreground">Average score</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Topics Started</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.userProgress.length}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.recentQuizResults.length}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Progress */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Continue Learning</CardTitle>
              <CardDescription>
                Pick up where you left off in your legal education journey
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {dashboardData.userProgress.length > 0 ? (
                dashboardData.userProgress.slice(0, 5).map((progress) => (
                  <div key={progress.topic_id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">Topic #{progress.topic_id}</h3>
                      <Progress value={progress.progress_percentage} className="mt-2" />
                      <p className="text-sm text-muted-foreground mt-1">
                        {progress.progress_percentage}% completed
                        {progress.completed && <span className="text-green-600 ml-2">✓ Completed</span>}
                      </p>
                    </div>
                    <Button asChild className="ml-4">
                      <Link href={`/learn/topic-${progress.topic_id}`}>
                        {progress.completed ? 'Review' : 'Continue'}
                      </Link>
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">You haven't started any topics yet</p>
                  <Button asChild>
                    <Link href="/learn">Start Learning</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Badges & Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Badges Earned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {dashboardData.completedTopics > 0 && (
                  <div className="flex items-center gap-2 p-2 bg-muted rounded">
                    <Trophy className="h-4 w-4 text-primary" />
                    <span className="text-sm">Quick Learner</span>
                  </div>
                )}
                {dashboardData.averageQuizScore > 80 && (
                  <div className="flex items-center gap-2 p-2 bg-muted rounded">
                    <Trophy className="h-4 w-4 text-primary" />
                    <span className="text-sm">Quiz Master</span>
                  </div>
                )}
                {dashboardData.userProgress.length > 5 && (
                  <div className="flex items-center gap-2 p-2 bg-muted rounded">
                    <Trophy className="h-4 w-4 text-primary" />
                    <span className="text-sm">Dedicated Student</span>
                  </div>
                )}
                {dashboardData.userProgress.length === 0 && (
                  <p className="text-sm text-muted-foreground">Complete topics to earn badges!</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/ai-assistant">
                  <Brain className="mr-2 h-4 w-4" />
                  Ask AI Assistant
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/quiz/random">
                  <Target className="mr-2 h-4 w-4" />
                  Take Random Quiz
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
