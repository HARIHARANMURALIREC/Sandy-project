import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const ModuleDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [module, setModule] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchModule()
  }, [id])

  const fetchModule = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/modules/${id}`)
      setModule(response.data)
    } catch (error) {
      console.error('Error fetching module:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (!module) {
    return <div className="text-center py-8">Module not found</div>
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold mb-4 text-purple-600 dark:text-purple-400">
          {module.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {module.description}
        </p>

        <div className="prose dark:prose-invert max-w-none mb-8">
          <div dangerouslySetInnerHTML={{ __html: module.content.replace(/\n/g, '<br/>') }} />
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => navigate('/modules')}
            className="px-6 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 dark:hover:bg-gray-700 transition"
          >
            Back to Modules
          </button>
          <button
            onClick={() => navigate(`/modules/${id}/quiz`)}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Take Quiz
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModuleDetail
