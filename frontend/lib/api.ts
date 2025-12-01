import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Types
export interface User {
  id: number
  email: string
  name: string
  is_active: boolean
}

export interface LegalTopic {
  id: number
  title: string
  slug: string
  description: string
  content: string
  difficulty_level: string
  category: string
  tags: string
  is_published: boolean
}

export interface Quiz {
  id: number
  topic_id: number
  question: string
  options: string[]
  explanation?: string
  difficulty: string
}

export interface UserProgress {
  topic_id: number
  completed: boolean
  progress_percentage: number
  last_accessed: string
}

export interface QuizResult {
  is_correct: boolean
  correct_answer: number
  explanation?: string
  score: number
}

// Auth API
export const authAPI = {
  async register(data: { name: string; email: string; password: string }) {
    const response = await api.post('/api/auth/register', data)
    return response.data
  },

  async login(data: { username: string; password: string }) {
    const formData = new FormData()
    formData.append('username', data.username)
    formData.append('password', data.password)
    
    const response = await api.post('/api/auth/token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token)
    }
    
    return response.data
  },

  async getCurrentUser() {
    const response = await api.get('/api/auth/me')
    return response.data
  },

  logout() {
    localStorage.removeItem('access_token')
  }
}

// Legal Topics API
export const topicsAPI = {
  async getTopics(category?: string, difficulty?: string) {
    const params = new URLSearchParams()
    if (category) params.append('category', category)
    if (difficulty) params.append('difficulty', difficulty)
    
    const response = await api.get(`/api/legal/topics?${params.toString()}`)
    return response.data
  },

  async getTopicBySlug(slug: string) {
    const response = await api.get(`/api/legal/topics/${slug}`)
    return response.data
  },

  async updateProgress(topicId: number, progress: number, completed: boolean = false) {
    const response = await api.post(`/api/legal/topics/${topicId}/progress`, {
      progress_percentage: progress,
      completed
    })
    return response.data
  },

  async getUserProgress() {
    const response = await api.get('/api/legal/user/progress')
    return response.data
  }
}

// Quiz API
export const quizAPI = {
  async getRandomQuiz(topicId?: number, difficulty?: string) {
    const params = new URLSearchParams()
    if (topicId) params.append('topic_id', topicId.toString())
    if (difficulty) params.append('difficulty', difficulty)
    
    const response = await api.get(`/api/quiz/random?${params.toString()}`)
    return response.data
  },

  async getQuizzesByTopic(topicId: number, difficulty?: string, limit: number = 10) {
    const params = new URLSearchParams()
    if (difficulty) params.append('difficulty', difficulty)
    params.append('limit', limit.toString())
    
    const response = await api.get(`/api/quiz/topic/${topicId}?${params.toString()}`)
    return response.data
  },

  async submitAnswer(quizId: number, selectedAnswer: number, timeTaken?: number) {
    const response = await api.post('/api/quiz/submit', {
      quiz_id: quizId,
      selected_answer: selectedAnswer,
      time_taken: timeTaken
    })
    return response.data
  },

  async getResults() {
    const response = await api.get('/api/quiz/results')
    return response.data
  }
}

// AI Assistant API
export const aiAPI = {
  async chatWithAssistant(message: string, context?: string) {
    const response = await api.post('/api/ai/assistant', {
      message,
      context
    })
    return response.data
  },

  async explainTopic(topic: string, complexityLevel: string = 'simple') {
    const response = await api.post('/api/ai/explain-topic', {
      topic,
      complexity_level: complexityLevel
    })
    return response.data
  }
}

export default api
