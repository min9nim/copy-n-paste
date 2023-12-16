import { MongoClient } from 'mongodb'

describe('test', () => {
  test('mongodb', async () => {
    try {
      if (!process.env.MONGODB_URI) {
        throw Error('MONGODB_URI is undefined')
      }
      const client = new MongoClient(process.env.MONGODB_URI)

      await client.connect()
      await listDatabases(client)
    } catch (e) {
      console.error(e)
    }
  })
})

async function listDatabases(client) {
  const databasesList = await client.db().admin().listDatabases()

  console.log('Databases:')
  databasesList.databases.forEach(db => console.log(` - ${db.name}`))
}
