import { ONE_DAY } from '@/constant'
import { oneOf, queryObjToStr } from 'mingutils'
import toast from 'react-hot-toast'
import { parse as parseUrl } from 'url'

export async function xExcerpt(tweetId) {
  const result = await req.get(
    `https://api.x.com/2/tweets`,
    {
      ids: tweetId,
      'tweet.fields': 'created_at',
      expansions: 'author_id',
      'user.fields': 'created_at',
    },
    { headers: { Authorization: 'Bearer ' + process.env.X_AUTH_TOKEN } },
  )

  console.log('xExcerpt result', result)

  assert(result.data.length > 0, `No x data`)
  assert(result.includes.users.length > 0, 'No users info')

  const tweet = result.data[0]
  const user = result.includes.users[0]

  return {
    title: tweet.text.slice(0, 20) + `- ${user.name} (@${user.username}) on X`,
    description: tweet.text.slice(0, 100),
    image: '',
    favicon: 'https://abs.twimg.com/favicons/twitter-pip.3.ico',
  }
}

export const getTweetId = url => {
  // https://x.com/btclog29/status/1860281373136945349
  const regex = /x\.com\/(?:\w+)\/status\/(\d+)/
  const match = url.match(regex)
  return match ? match[1] : null
}

/*
{
  "data": [
    {
      "text": "하~ 발작버튼 오지네\n어디서 개뼉다구 같은 말로 혹세무민하고 앉았냐 https://t.co/VpnDFldlHm",
      "author_id": "1589247257215262720",
      "edit_history_tweet_ids": [
        "1859800387009876461"
      ],
      "created_at": "2024-11-22T03:25:40.000Z",
      "id": "1859800387009876461"
    }
  ],
  "includes": {
    "users": [
      {
        "username": "btclog29",
        "name": "Keating in the rabbit hole⚡",
        "created_at": "2022-11-06T13:24:12.000Z",
        "id": "1589247257215262720"
      }
    ]
  }
}
  */

export default function excerptFromHtml(html, url) {
  // console.log('html >>\n', html)
  const title =
    html.match(new RegExp(`property="og:title" content="([^"]+)"`)) ??
    html.match(new RegExp(`<title>(.+)</title>`))
  const description = html.match(
    new RegExp(`property="og:description" content="([^"]+)"`),
  )
  const image = html.match(new RegExp(`property="og:image" content="([^"]+)"`))
  const _favicon = html.match(
    new RegExp(
      `<link rel="shortcut icon" (?:type="image/x-icon" )?href="([^"]+)"`,
    ),
  )
  const favicon = _favicon ? _favicon[1] : '/favicon.ico'
  const urlObj = parseUrl(url)

  const excerpt = {
    title: title ? title[1] : 'not found',
    description: description ? description[1] : 'not found',
    image: image ? image[1] : 'not found',
    favicon:
      oneOf([
        [favicon.startsWith('http'), favicon],
        [favicon.startsWith('//'), urlObj?.protocol + favicon],
      ]) ?? urlObj?.protocol + '//' + urlObj?.host + favicon,
  }
  return excerpt
}

export const isBrowser = typeof window === 'object'
export const PROD_HOST = 'copy-n-paste.vercel.app'
export const isProd =
  process.env.VERCEL_GIT_COMMIT_REF === 'main' ||
  (isBrowser && window.location.host === PROD_HOST)

export const API_URL = isProd ? `https://${PROD_HOST}` : 'http://localhost:3000'

export const textFromClipboard = async () => {
  const str = await navigator.clipboard.readText().catch(err => {
    const msg = 'Failed to read clipboard contents: '
    console.error(msg, err)
  })
  if (!str) {
    toast.error('No text in clipboard')
    throw Error('No text in clipboard')
  }
  return str.trim()
}

export function debounce(func, timeout = 300) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => func(...args), timeout)
  }
}

export async function listDatabases(client) {
  const databasesList = await client.db().admin().listDatabases()

  console.log('Databases:')
  databasesList.databases.forEach(db => console.log(` - ${db.name}`))
}

export async function createText(client, text) {
  const result = await textsCollection(client).insertOne(text)
  console.log(`New text created with the following id: ${result.insertedId}`)
}

export const textsCollection = client =>
  client.db('copy-n-paste').collection('texts')

export const req = {
  get: (url, searchParams, options = {}) =>
    fetch(url + '?' + queryObjToStr(searchParams), {
      method: 'get',
      ...options,
    }).then(res => res.json()),
  post: (url, payload = {}) =>
    fetch(url, { method: 'post', body: JSON.stringify(payload) }).then(res =>
      res.json(),
    ),
  delete: (url, payload = {}) =>
    fetch(url, { method: 'delete', body: JSON.stringify(payload) }).then(res =>
      res.json(),
    ),
}

export const colorByExpireAt = (expireAt, nowTimestamp) => ({
  'text-yellow-400':
    expireAt - nowTimestamp > ONE_DAY * 3 &&
    expireAt - nowTimestamp < ONE_DAY * 7,
  'text-red-400': expireAt - nowTimestamp < ONE_DAY * 3,
})

export const getExcerpt = async (url: string) => {
  const tweetId = getTweetId(url)
  let excerpt
  if (tweetId) {
    excerpt = await xExcerpt(tweetId)
  } else if (isYouTubeUrl(url)) {
    excerpt = await youtubeOEmbed(url)
  } else {
    const result = await fetch(url)
    if (!result.ok) {
      throw Error(`[${result.status}] result.ok is falsy`)
    }
    const html = await result.text()
    excerpt = excerptFromHtml(html, url)
  }
  return excerpt
}

const isYouTubeUrl = (url: string) => {
  try {
    return (
      url.includes('www.youtube.com') ||
      url.includes('youtube.com') ||
      url.includes('youtu.be') ||
      url.includes('.youtube.com')
    )
  } catch {
    return false
  }
}

const youtubeOEmbed = async (url: string) => {
  const oembedUrl =
    'https://www.youtube.com/oembed?format=json&url=' + encodeURIComponent(url)
  const res = await fetch(oembedUrl, {
    headers: {
      'user-agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'accept-language': 'en-US,en;q=0.9',
    },
  })
  if (!res.ok) {
    throw Error(`[${res.status}] oEmbed res.ok is falsy`)
  }
  const data = await res.json()
  let description = 'not found'
  let favicon = 'https://www.youtube.com/favicon.ico'

  try {
    const htmlRes = await fetch(url, {
      headers: {
        'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'accept-language': 'en-US,en;q=0.9',
      },
    })
    if (htmlRes.ok) {
      const html = await htmlRes.text()
      const ogDesc =
        html.match(new RegExp(`property="og:description" content="([^"]+)"`)) ??
        html.match(new RegExp(`name="description" content="([^"]+)"`))
      const shortDesc = html.match(
        new RegExp(`"shortDescription":"((?:\\\\.|[^"])*)"`),
      )
      if (ogDesc?.[1]) {
        description = ogDesc[1]
      }
      if (shortDesc?.[1]) {
        description = decodeJsonString(shortDesc[1])
      }
      const iconMatch = html.match(
        new RegExp(`<link[^>]*rel="(?:shortcut )?icon"[^>]*href="([^"]+)"`),
      )
      if (iconMatch?.[1]) {
        favicon = resolveUrl(iconMatch[1], url)
      }
    }
  } catch (e) {
    console.error('[youtubeOEmbed] html fallback failed', e)
  }

  return {
    title: data?.title ?? 'not found',
    description,
    image: data?.thumbnail_url ?? 'not found',
    favicon,
  }
}

const decodeJsonString = (value: string) => {
  try {
    return JSON.parse('"' + value + '"')
  } catch {
    return value
  }
}

const resolveUrl = (href: string, baseUrl: string) => {
  if (href.startsWith('http')) {
    return href
  }
  const parsed = parseUrl(baseUrl)
  if (href.startsWith('//')) {
    return (parsed.protocol ?? 'https:') + href
  }
  if (href.startsWith('/')) {
    return (parsed.protocol ?? 'https:') + '//' + parsed.host + href
  }
  return href
}

export function assert(
  condition: any,
  message?: string,
  option?: any,
): asserts condition {
  if (condition) {
    return
  }
  if (!message && !option) {
    throw new Error(`AssertionError`)
  }
  if (!option) {
    throw new Error(`AssertionError: ${message}`)
  }

  if (option) {
    throw new AssertionError({ message, ...option })
  }
}

class AssertionError extends Error {
  constructor(args, ...params) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params)

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AssertionError)
    }
    Object.assign(this, args)
  }
}
