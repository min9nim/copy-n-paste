import { createText } from '@/utils'
import { MongoClient } from 'mongodb'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  if (!process.env.MONGODB_URI) {
    throw Error('MONGODB_URI is undefined')
  }
  const client = new MongoClient(process.env.MONGODB_URI)

  try {
    const { text, userId, expire } = await request.json()
    if (!text) {
      return NextResponse.json(
        { message: 'Invalid text' },
        {
          status: 400,
        },
      )
    }
    await client.connect()
    const timestamp = Date.now()
    await createText(client, {
      text,
      createdAt: timestamp,
      expireAt: timestamp + expire,
      userId,
    })

    return NextResponse.json(
      { message: 'ok', text },
      {
        status: 200,
      },
    )
  } catch (e: any) {
    console.error(e)
    await client.close()
    return NextResponse.json(
      { message: e.message },
      {
        status: 500,
      },
    )
  }
}
