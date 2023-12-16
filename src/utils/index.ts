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

export const deeplReq = (path: string, option = {}) =>
  fetch(`https://api-free.deepl.com${path}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `DeepL-Auth-Key ${process.env.API_KEY}`,
    },
    ...option,
  }).then(res => res.json())

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
  const result = await client
    .db('copy-n-paste')
    .collection('texts')
    .insertOne(text)
  console.log(`New text created with the following id: ${result.insertedId}`)
}
