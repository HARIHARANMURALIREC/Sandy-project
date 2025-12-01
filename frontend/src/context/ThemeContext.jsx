import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    // Check if dark class is already on html element (from script tag)
    const htmlHasDark = document.documentElement.classList.contains('dark')
    
    // Check localStorage
    const saved = localStorage.getItem('theme')
    if (saved) {
      return saved === 'dark'
    }
    
    // If HTML already has dark class, use that
    if (htmlHasDark) {
      return true
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return true
    }
    
    // Default to light mode
    return false
  })

  // Update theme when isDark changes
  useEffect(() => {
    const root = document.documentElement
    
    // Force remove dark class first
    root.classList.remove('dark')
    
    // Then add it if needed
    if (isDark) {
      root.classList.add('dark')
    }
    
    // Save to localStorage
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
    
    // Force a reflow to ensure the change is applied
    void root.offsetHeight
  }, [isDark])

  const toggleTheme = () => {
    setIsDark(prev => {
      const newValue = !prev
      // Immediately update the DOM for instant feedback
      const root = document.documentElement
      if (newValue) {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
      localStorage.setItem('theme', newValue ? 'dark' : 'light')
      return newValue
    })
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
