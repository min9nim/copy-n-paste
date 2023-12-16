import { createText, listDatabases } from '@/utils'
import { MongoClient } from 'mongodb'

describe('test', () => {
  test('mongodb', async () => {
    if (!process.env.MONGODB_URI) {
      throw Error('MONGODB_URI is undefined')
    }
    const client = new MongoClient(process.env.MONGODB_URI)

    try {
      await client.connect()
      await listDatabases(client)

      await createText(client, {
        text: 'blabla',
        createAt: Date.now(),
        userId: Math.random().toString(36).slice(2),
      })
    } catch (e) {
      console.error(e)
    } finally {
      await client.close()
    }
  })
})
