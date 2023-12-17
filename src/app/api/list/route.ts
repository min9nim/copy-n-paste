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
    const count = await textsCollection(client).count()
    let list = []
    if (count > 0) {
      await textsCollection(client).deleteMany({
        expireAt: { $lt: Date.now() },
      })
      const result = await textsCollection(client)
        .find({ userId })
        .sort({ createdAt: -1 })
      list = await result.toArray()
    }

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
