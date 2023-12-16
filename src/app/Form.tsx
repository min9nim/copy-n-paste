'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export default function Form() {
  const [text, setText] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [userId, setUserId] = useState<string>(
    typeof window === 'object'
      ? window.localStorage.getItem('userId') ?? ''
      : '',
  )
  useEffect(() => {
    if (!userId) {
      const id = Math.random().toString(36).slice(2)
      window.localStorage.setItem('userId', id)
      setUserId(id)
    }
  }, [])
  if (loading) {
    return <div className="animate-bounce">Saving..</div>
  }
  return (
    <div className="max-w-2xl w-full">
      <textarea
        className="p-2 bg-gray-900 w-full border"
        value={text}
        rows={5}
        onChange={e => {
          setText(e.target.value)
        }}
      />
      <button
        className="border px-2 py-1"
        onClick={async () => {
          setLoading(true)
          await fetch(`/api/save`, {
            method: 'post',
            body: JSON.stringify({ text, userId }),
          }).then(res => res.json())
          setLoading(false)
          setText('')
          toast.success('saved!')
        }}
      >
        save
      </button>
    </div>
  )
}
