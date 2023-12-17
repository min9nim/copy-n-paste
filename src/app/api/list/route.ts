import { USER_ID } from '@/constant'
import { textsCollection } from '@/utils'
import { MongoClient } from 'mongodb'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get(USER_ID)

  if (!userId) {
    return NextResponse.json(
      { message: '`userId` is required' },
      {
        status: 400,
      },
    )
  }

  if (!process.env.MONGODB_URI) {
    throw Error('MONGODB_URI is undefined')
  }
  const client = new MongoClient(process.env.MONGODB_URI)

  try {
    await client.connect()
    const result = await textsCollection(client)
      .find({ userId })
      .sort({ createdAt: -1 })

    const list = await result.toArray()

    // 콜렉션이 비워져 있을 때 예외 처리 필요

    return NextResponse.json(list, {
      status: 200,
    })
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
