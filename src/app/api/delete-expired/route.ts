import { textsCollection } from '@/utils'
import { MongoClient } from 'mongodb'
import { NextResponse } from 'next/server'

export async function DELETE(request: Request) {
  if (!process.env.MONGODB_URI) {
    throw Error('MONGODB_URI is undefined')
  }
  const client = new MongoClient(process.env.MONGODB_URI)

  try {
    await client.connect()
    await textsCollection(client).deleteMany({
      expireAt: { $lt: Date.now() },
    })

    return NextResponse.json(
      { message: 'ok' },
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
