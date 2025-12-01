'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { ArrowLeft, CheckCircle, XCircle, Clock, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import { quizAPI, type Quiz, type QuizResult } from '@/lib/api'

export default function QuizInterfacePage() {
  const params = useParams()
  const router = useRouter()
  const type = params.type as string
  const additionalParams = params.params as string[]
  
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [result, setResult] = useState<QuizResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds
  const [startTime, setStartTime] = useState<number | null>(null)

  useEffect(() => {
    loadQuiz()
  }, [type, additionalParams])

  useEffect(() => {
    if (startTime && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [startTime, timeLeft])

  const loadQuiz = async () => {
    try {
      setLoading(true)
      let quizData: Quiz

      if (type === 'random') {
        quizData = await quizAPI.getRandomQuiz()
      } else if (type === 'topic' && additionalParams?.[0]) {
        const topicId = parseInt(additionalParams[0])
        const quizzes = await quizAPI.getQuizzesByTopic(topicId, undefined, 1)
        quizData = quizzes[0]
      } else {
        throw new Error('Invalid quiz parameters')
      }

      setQuiz(quizData)
      setStartTime(Date.now())
    } catch (error) {
      console.error('Error loading quiz:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!quiz || selectedAnswer === null) return

    try {
      setSubmitting(true)
      const timeTaken = startTime ? Math.floor((Date.now() - startTime) / 1000) : undefined
      
      const resultData = await quizAPI.submitAnswer(
        quiz.id,
        selectedAnswer,
        timeTaken
      )
      
      setResult(resultData)
    } catch (error) {
      console.error('Error submitting answer:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleNextQuiz = () => {
    setQuiz(null)
    setSelectedAnswer(null)
    setResult(null)
    setTimeLeft(300)
    setStartTime(null)
    loadQuiz()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading quiz...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No quiz available</h1>
          <Link href="/quiz">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Quiz Center
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/quiz">
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Quiz Center
          </Button>
        </Link>
        
        {!result && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            Time: {formatTime(timeLeft)}
          </div>
        )}
      </div>

      {!result ? (
        /* Quiz Question */
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Quiz Question</CardTitle>
              <span className="text-sm text-muted-foreground capitalize">
                {quiz.difficulty}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">{quiz.question}</h3>
              
              <RadioGroup
                value={selectedAnswer?.toString()}
                onValueChange={(value) => setSelectedAnswer(parseInt(value))}
                className="space-y-3"
              >
                {quiz.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleNextQuiz}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Skip Question
              </Button>
              
              <Button 
                onClick={handleSubmit} 
                disabled={selectedAnswer === null || submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Answer'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Quiz Result */
        <Card>
          <CardHeader>
            <div className="text-center">
              {result.is_correct ? (
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              ) : (
                <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              )}
              <CardTitle className={`text-2xl ${result.is_correct ? 'text-green-600' : 'text-red-600'}`}>
                {result.is_correct ? 'Correct!' : 'Incorrect'}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Your Answer:</h4>
                <p className="text-muted-foreground">
                  {quiz.options[selectedAnswer || 0]}
                </p>
              </div>
              
              {!result.is_correct && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Correct Answer:</h4>
                  <p className="text-green-600">
                    {quiz.options[result.correct_answer]}
                  </p>
                </div>
              )}

              {result.explanation && (
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Explanation:</h4>
                  <p className="text-sm">{result.explanation}</p>
                </div>
              )}
            </div>

            <div className="flex gap-4 justify-center">
              <Button variant="outline" asChild>
                <Link href="/quiz">
                  Finish Quiz
                </Link>
              </Button>
              <Button onClick={handleNextQuiz}>
                Next Question
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
