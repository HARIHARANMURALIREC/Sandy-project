import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message } = body

    if (!message) {
      return NextResponse.json(
        { message: 'Message is required' },
        { status: 400 }
      )
    }

    // Make API call to your backend AI service
    const response = await fetch(`${process.env.API_URL || 'http://localhost:8000'}/api/ai/assistant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add auth headers here if needed
      },
      body: JSON.stringify({
        message,
      }),
    })

    if (response.ok) {
      const data = await response.json()
      return NextResponse.json({ response: data.response })
    } else {
      return NextResponse.json(
        { message: 'Failed to get AI response' },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error('AI assistant error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
