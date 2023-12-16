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

async function listDatabases(client) {
  const databasesList = await client.db().admin().listDatabases()

  console.log('Databases:')
  databasesList.databases.forEach(db => console.log(` - ${db.name}`))
}

async function createText(client, text) {
  const result = await client
    .db('copy-n-paste')
    .collection('texts')
    .insertOne(text)
  console.log(`New text created with the following id: ${result.insertedId}`)
}
