'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Clock, Users, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { topicsAPI, type LegalTopic } from '@/lib/api'

export default function LearnPage() {
  const [topics, setTopics] = useState<LegalTopic[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  useEffect(() => {
    fetchTopics()
  }, [selectedCategory])

  const fetchTopics = async () => {
    try {
      setLoading(true)
      const data = await topicsAPI.getTopics(selectedCategory)
      setTopics(data)
    } catch (error) {
      console.error('Error fetching topics:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['Civil Rights', 'Technology Law', 'Consumer Protection', 'Employment Law']

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
            <p className="text-muted-foreground">Loading topics...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Legal Learning Hub</h1>
        <p className="text-muted-foreground">
          Explore comprehensive guides on various legal topics and understand your rights.
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === '' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('')}
            size="sm"
          >
            All Topics
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              size="sm"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => (
          <Card key={topic.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{topic.title}</CardTitle>
                <Badge className={getDifficultyColor(topic.difficulty_level)}>
                  {topic.difficulty_level}
                </Badge>
              </div>
              <CardDescription>{topic.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground mb-4">
                <BookOpen className="h-4 w-4 mr-1" />
                <span className="mr-4">{topic.category}</span>
                <Clock className="h-4 w-4 mr-1" />
                <span>5 min read</span>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {topic.tags && JSON.parse(topic.tags).map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <Button asChild className="w-full">
                <Link href={`/learn/${topic.slug}`}>
                  Start Learning
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {topics.length === 0 && !loading && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No topics found</h3>
          <p className="text-muted-foreground">
            {selectedCategory ? `No topics in ${selectedCategory}` : 'No topics available'}
          </p>
        </div>
      )}
    </div>
  )
}
