'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { BookOpen, Clock, ArrowLeft, CheckCircle, Brain } from 'lucide-react'
import Link from 'next/link'
import { topicsAPI, type LegalTopic, type UserProgress } from '@/lib/api'

export default function TopicPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [topic, setTopic] = useState<LegalTopic | null>(null)
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [savingProgress, setSavingProgress] = useState(false)

  useEffect(() => {
    if (slug) {
      fetchTopic()
    }
  }, [slug])

  const fetchTopic = async () => {
    try {
      setLoading(true)
      const data = await topicsAPI.getTopicBySlug(slug)
      setTopic(data)
      
      // Try to get user progress (might fail if not authenticated)
      try {
        const progressData = await topicsAPI.getUserProgress()
        const userProgress = progressData.find((p: UserProgress) => p.topic_id === data.id)
        setProgress(userProgress || null)
      } catch (error) {
        // User might not be authenticated, that's ok
        console.log('Could not fetch user progress:', error)
      }
    } catch (error) {
      console.error('Error fetching topic:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkComplete = async () => {
    if (!topic) return
    
    try {
      setSavingProgress(true)
      await topicsAPI.updateProgress(topic.id, 100, true)
      setProgress({
        topic_id: topic.id,
        completed: true,
        progress_percentage: 100,
        last_accessed: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error updating progress:', error)
    } finally {
      setSavingProgress(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading topic...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!topic) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Topic not found</h1>
          <Link href="/learn">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Topics
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const tags = topic.tags ? JSON.parse(topic.tags) : []

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/learn">
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Topics
          </Button>
        </Link>
      </div>

      {/* Progress Bar */}
      {progress && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Your Progress</span>
              <span className="text-sm text-muted-foreground">
                {progress.progress_percentage}% Complete
              </span>
            </div>
            <Progress value={progress.progress_percentage} className="mb-4" />
            {progress.completed && (
              <div className="flex items-center text-green-600">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span className="text-sm">Completed!</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Topic Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Badge className={getDifficultyColor(topic.difficulty_level)}>
                {topic.difficulty_level}
              </Badge>
              <CardTitle className="text-3xl mt-4">{topic.title}</CardTitle>
              <p className="text-muted-foreground mt-2">{topic.description}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <BookOpen className="h-4 w-4 mr-1" />
            <span className="mr-4">{topic.category}</span>
            <Clock className="h-4 w-4 mr-1" />
            <span>5 min read</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {tags.map((tag: string) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Topic Content */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="prose prose-lg max-w-none">
            <div className="whitespace-pre-wrap">{topic.content}</div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        {!progress?.completed && (
          <Button onClick={handleMarkComplete} disabled={savingProgress} size="lg">
            {savingProgress ? 'Saving...' : 'Mark as Complete'}
          </Button>
        )}
        
        <Button variant="outline" size="lg" asChild>
          <Link href="/quiz">
            <Brain className="mr-2 h-4 w-4" />
            Take Quiz
          </Link>
        </Button>
      </div>
    </div>
  )
}
