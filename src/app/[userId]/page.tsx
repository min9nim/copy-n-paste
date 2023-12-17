'use client'
import { USER_ID } from '@/constant'
import { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
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
    <main className="flex min-h-screen flex-col items-center p-24 gap-4">
      <Form userId={userId} setList={setList} />
      <List list={list} loading={loading} />
      <Toaster />
    </main>
  )
}
