import { Toaster } from 'react-hot-toast'
import Form from './Form'
import List from './List'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24 gap-4">
      <Form />
      <List />
      <Toaster />
    </main>
  )
}
