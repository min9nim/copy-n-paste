'use client'
import IconLogo from '@/components/icons/IconLogo'
import { USER_ID } from '@/constant'
import { copyToClipboard } from '@/utils'
import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import Form from './Form'
import List from './List'

export default function Home({ params }) {
  const userId = params.userId
  const [list, setList] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setLoading(true)
    fetch('/api/list?userId=' + userId)
      .then(res => res.json())
      .then(list => {
        setList(list)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    localStorage.setItem(USER_ID, userId)
  }, [userId])
  return (
    <main className="flex min-h-screen flex-col items-center px-2 py-4 gap-4">
      <div
        className="flex items-center justify-between w-full max-w-2xl"
        style={{ marginLeft: -20 }}
      >
        <div className="flex items-center max-w-2xl">
          <IconLogo size={30} />
          <div className="text-2xl">Copy & Paste</div>
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
      <List
        list={list}
        setList={setList}
        loading={loading}
        setLoading={setLoading}
        userId={userId}
      />
      <Toaster />
    </main>
  )
}
