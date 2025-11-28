import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const Quiz = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQuiz()
  }, [id])

  const fetchQuiz = async () => {
    try {
      const response = await axios.get(`/api/quiz/${id}`)
      setQuestions(response.data)
    } catch (error) {
      console.error('Error fetching quiz:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerChange = (quizId, answer) => {
    setAnswers({
      ...answers,
      [quizId]: answer
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!token) {
      alert('Please login to submit quiz')
      navigate('/login')
      return
    }

    const submission = {
      module_id: parseInt(id),
      answers: Object.entries(answers).map(([quiz_id, selected_answer]) => ({
        quiz_id: parseInt(quiz_id),
        selected_answer
      }))
    }

    try {
      const response = await axios.post(
        '/api/quiz/submit',
        submission
      )
      setResult(response.data)
    } catch (error) {
      console.error('Error submitting quiz:', error)
      if (error.response?.status === 401) {
        alert('Your session has expired. Please login again.')
        navigate('/login')
      } else {
        alert(error.response?.data?.detail || 'Failed to submit quiz. Please try again.')
      }
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading quiz...</div>
  }

  if (result) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-purple-600 dark:text-purple-400">
            Quiz Results
          </h2>
          <div className="text-6xl font-bold mb-4">
            {result.score.toFixed(0)}%
          </div>
          <p className="text-xl mb-4">
            You got {result.correct_answers} out of {result.total_questions} questions correct
          </p>
          <p className="text-lg mb-6">
            {result.passed ? (
              <span className="text-green-600">🎉 Congratulations! You passed!</span>
            ) : (
              <span className="text-yellow-600">Keep learning and try again!</span>
            )}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate(`/modules/${id}`)}
              className="px-6 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 dark:hover:bg-gray-700"
            >
              Back to Module
            </button>
            <button
              onClick={() => navigate('/progress')}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              View Progress
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-purple-600 dark:text-purple-400">
          Module Quiz
        </h2>

        <form onSubmit={handleSubmit}>
          {questions.map((q, index) => (
            <div key={q.id} className="mb-8 p-4 border rounded-lg dark:border-gray-700">
              <h3 className="font-semibold mb-4 text-lg">
                {index + 1}. {q.question}
              </h3>
              <div className="space-y-2">
                {['A', 'B', 'C', 'D'].map((option) => (
                  <label key={option} className="flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                    <input
                      type="radio"
                      name={`question-${q.id}`}
                      value={option}
                      onChange={() => handleAnswerChange(q.id, option)}
                      className="form-radio text-purple-600"
                      required
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      {option}. {q[`option_${option.toLowerCase()}`]}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition text-lg font-semibold"
          >
            Submit Quiz
          </button>
        </form>
      </div>
    </div>
  )
}

export default Quiz
