import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // In a real app, make API call to your backend
    const response = await fetch(`${process.env.API_URL || 'http://localhost:8000'}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    })

    if (response.ok) {
      return NextResponse.json({ message: 'User created successfully' })
    } else {
      const error = await response.json()
      return NextResponse.json(
        { message: error.detail || 'Registration failed' },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
