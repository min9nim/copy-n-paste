import { MongoClient } from 'mongodb'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  if (!process.env.MONGODB_URI) {
    throw Error('MONGODB_URI is undefined')
  }
  const client = new MongoClient(process.env.MONGODB_URI)

  try {
    await client.connect()
    const result = await client
      .db('copy-n-paste')
      .collection('texts')
      .find()
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
