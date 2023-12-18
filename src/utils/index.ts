import toast from 'react-hot-toast'

export const isBrowser = typeof window === 'object'
export const PROD_HOST = 'copy-n-paste.vercel.app'
export const isProd =
  process.env.VERCEL_GIT_COMMIT_REF === 'main' ||
  (isBrowser && window.location.host === PROD_HOST)

export const API_URL = isProd ? `https://${PROD_HOST}` : 'http://localhost:3000'

export const copyToClipboard = val => {
  let t = document.createElement('textarea')
  document.body.appendChild(t)
  t.value = val
  t.select()
  document.execCommand('copy')
  document.body.removeChild(t)
}

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

export const enableUrl = (str: string): string => {
  if (!str) {
    return ''
  }
  const isUrl =
    /((?:http|https?|ftps?|sftp):\/\/(?:[a-z0-9-]+\.)+[a-z0-9]{2,4}\S*)/gi
  if (isUrl.test(str)) {
    return str.replace(isUrl, '<a href="$1" target="_blank">$1</a>')
  }
  const wwwStart = /(www\.(?:[a-z0-9-]+\.)+[a-z0-9]{2,4}\S*)/gi
  if (wwwStart.test(str)) {
    return str.replace(wwwStart, '<a href="http://$1" target="_blank">$1</a>')
  }
  return str
}

export const classNames = (...params: any[]): string => {
  const result = params.reduce((acc, value) => {
    if (!value) {
      return acc
    }
    if (typeof value === 'boolean') {
      throw Error('Boolean type is not acceptable')
    }
    if (typeof value === 'string') {
      return acc + ' ' + value
    }
    const classes = Object.entries(value).reduce(
      (acc, [key, value]) => acc + (value ? ' ' + key : ''),
      '',
    )
    return acc + classes
  }, '')

  return result ? result.trim() : undefined
}

export const camelToKabab = (value: string) =>
  value.replace(
    /[a-z|0-9][A-Z][a-z|0-9]/g,
    match => match[0] + '-' + match.slice(1).toLowerCase(),
  )

export const clsNms = (...params: any[]): string => {
  const classString = classNames(...params)
  return classString ? camelToKabab(classString) : classString
}
