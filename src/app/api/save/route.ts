import { createText, getExcerpt } from '@/utils'
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
      console.log('[excerpt] start', { url })
      const {
        title,
        image,
        description: desc,
        favicon,
      } = await getExcerpt(url).catch(e => {
        console.error(e.message)
        return {
          title: 'xx',
          image: '',
          description: 'xx',
          favicon: '',
        }
      })

      console.log('[excerpt] done', { url, title, image, desc, favicon })

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

async function excerpt(url: string) {
  const res = await fetch(url)
  if (!res.ok) {
    throw Error(`[${res.status}] res.ok is falsy`)
  }

  const html = await res.text()
  console.log('[html2]', html.slice(0, 2500))

  const title = html.match(new RegExp(`property="og:title" content="([^"]+)"`))
  const description = html.match(
    new RegExp(`property="og:description" content="([^"]+)"`),
  )
  const image = html.match(new RegExp(`property="og:image" content="([^"]+)"`))
  const favicon = html.match(
    new RegExp(`<link rel="shortcut icon" href="([^"]+)"`),
  )

  return {
    title: title ? title[1] : 'not found',
    description: description ? description[1] : 'not found',
    image: image ? image[1] : 'not found',
    favicon: favicon ? favicon[1] : 'not found',
  }
}
