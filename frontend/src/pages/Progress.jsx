import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const Progress = () => {
  const { token, user } = useAuth()
  const [progress, setProgress] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchProgress()
    }
  }, [user])

  const fetchProgress = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/user/progress/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      setProgress(response.data)
    } catch (error) {
      console.error('Error fetching progress:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading progress...</div>
  }

  if (!progress) {
    return <div className="text-center py-8">No progress data available</div>
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-purple-600 dark:text-purple-400">
        Your Progress
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
          <div className="text-4xl font-bold text-purple-600 mb-2">
            {progress.completed_modules}
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            Modules Completed
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
          <div className="text-4xl font-bold text-purple-600 mb-2">
            {progress.total_modules}
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            Total Modules
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
          <div className="text-4xl font-bold text-purple-600 mb-2">
            {progress.average_score.toFixed(0)}%
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            Average Score
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
          Module Progress
        </h2>

        {progress.progress_details.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">
            No modules completed yet. Start learning!
          </p>
        ) : (
          <div className="space-y-4">
            {progress.progress_details.map((detail) => (
              <div
                key={detail.id}
                className="border dark:border-gray-700 rounded-lg p-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-lg">
                    {detail.module_title}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      detail.completed
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {detail.completed ? 'Completed' : 'In Progress'}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                    <div
                      className="bg-purple-600 h-4 rounded-full"
                      style={{ width: `${detail.score}%` }}
                    ></div>
                  </div>
                  <div className="text-purple-600 font-semibold">
                    {detail.score.toFixed(0)}%
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Completed on:{' '}
                  {new Date(detail.completed_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Progress
