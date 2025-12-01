import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const AdminDashboard = () => {
  const { token, user } = useAuth()
  const navigate = useNavigate()
  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      alert('Access denied. Admin only.')
      navigate('/')
      return
    }
    fetchModules()
  }, [user])

  const fetchModules = async () => {
    try {
      const response = await axios.get('http://localhost:8000/modules')
      setModules(response.data)
    } catch (error) {
      console.error('Error fetching modules:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-purple-600 dark:text-purple-400">
        Admin Dashboard
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Modules Management
          </h2>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            Add New Module
          </button>
        </div>

        <div className="space-y-4">
          {modules.map((module) => (
            <div
              key={module.id}
              className="border dark:border-gray-700 rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold text-lg">{module.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {module.description}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-purple-600 text-purple-600 rounded hover:bg-purple-50 dark:hover:bg-gray-700">
                  Edit
                </button>
                <button className="px-4 py-2 border border-red-600 text-red-600 rounded hover:bg-red-50 dark:hover:bg-gray-700">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
          Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-300">
              {modules.length}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Total Modules</div>
          </div>
          <div className="text-center p-4 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-300">
              N/A
            </div>
            <div className="text-gray-600 dark:text-gray-400">Total Users</div>
          </div>
          <div className="text-center p-4 bg-green-100 dark:bg-green-900 rounded-lg">
            <div className="text-3xl font-bold text-green-600 dark:text-green-300">
              N/A
            </div>
            <div className="text-gray-600 dark:text-gray-400">Quiz Completions</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
