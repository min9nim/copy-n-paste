import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { text } = await request.json()

    console.log({ text })

    return NextResponse.json(
      { message: 'hello world' },
      {
        status: 200,
      },
    )
  } catch (e: any) {
    return NextResponse.json(
      { message: 'hello error' },
      {
        status: 400,
      },
    )
  }
}
