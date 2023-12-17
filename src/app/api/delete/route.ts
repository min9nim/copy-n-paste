import { textsCollection } from '@/utils'
import { MongoClient, ObjectId } from 'mongodb'
import { NextResponse } from 'next/server'

export async function DELETE(request: Request) {
  if (!process.env.MONGODB_URI) {
    throw Error('MONGODB_URI is undefined')
  }
  const client = new MongoClient(process.env.MONGODB_URI)

  try {
    const { _id } = await request.json()
    if (!_id) {
      return NextResponse.json(
        { message: '_id is required' },
        {
          status: 400,
        },
      )
    }
    await client.connect()
    await textsCollection(client).deleteOne({
      _id: new ObjectId(_id),
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
