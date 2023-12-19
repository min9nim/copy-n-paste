'use client'
import IconLogo from '@/components/icons/IconLogo'
import { USER_ID } from '@/constant'
import { copyToClipboard } from '@/utils'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import Form from './Form'
import List from './List'

export default function Home({ params }) {
  const userId = params.userId
  const [list, setList] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()
  useEffect(() => {
    fetch('/api/delete-expired', { method: 'delete' })
      .then(res => res.json())
      .then(() => console.info('Expired items deleted'))

    setLoading(true)
    fetch('/api/list?userId=' + userId)
      .then(res => res.json())
      .then(list => {
        setList(list)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    document.title += ' - ' + userId
    localStorage.setItem(USER_ID, userId)
  }, [userId])

  return (
    <main className="flex min-h-screen flex-col items-center px-2 py-4 gap-2">
      <div className="flex items-center justify-between w-full max-w-2xl">
        <div
          className="flex items-center max-w-2xl cursor-pointer"
          style={{ marginLeft: -10 }}
          onClick={() => router.push('/')}
        >
          <IconLogo size={30} />
          <div
            className="text-2xl font-bold"
            style={{ marginBottom: 2, marginLeft: -3 }}
          >
            Copy & Paste
          </div>
        </div>
        <div
          className="text-gray-400 cursor-pointer hover:italic"
          onClick={() => {
            copyToClipboard('https://mycnp.vercel.app/' + userId)
            toast.success('copied')
          }}
        >
          {decodeURIComponent(userId)}
        </div>
      </div>
      <Form userId={userId} setList={setList} />
      <hr className="h-4" />
      {list.length === 0 && loading ? (
        <div className="animate-spin">@@</div>
      ) : (
        <List list={list} setList={setList} />
      )}
      <Toaster />
    </main>
  )
}
