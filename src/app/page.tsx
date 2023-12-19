'use client'

import { USER_ID } from '@/constant'
import { createRandomString } from 'mingutils'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    let userId = localStorage.getItem(USER_ID)
    if (!userId) {
      userId = createRandomString(10)
    }

    router.push('/' + userId)
  }, [])
  return <main className="p-4">Loading..</main>
}
