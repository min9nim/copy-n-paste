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

    let urlRegex = /(https?:\/\/[^ ]*)/
    let res = text.match(urlRegex)
    if (res) {
      const url = res[1]
      const {
        title,
        image,
        description: desc,
        favicon,
      } = await fetch('https://honey2.vercel.app/api/og?url=' + url, {
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(res => res.json())

      console.log({ url, title, image, desc, favicon })

      await createText(client, {
        text,
        createdAt: timestamp,
        expireAt: timestamp + expire,
        userId,
        title,
        image,
        desc,
        favicon,
        url,
      })
    } else {
      await createText(client, {
        text,
        createdAt: timestamp,
        expireAt: timestamp + expire,
        userId,
      })
    }

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
