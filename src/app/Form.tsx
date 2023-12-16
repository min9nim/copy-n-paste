'use client'

import { useState } from 'react'

export default function Form() {
  const [text, setText] = useState<string>('')
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
          const result = await fetch(`/api/save`, {
            method: 'post',
            body: JSON.stringify({ text }),
          }).then(res => res.json())
          console.log(result)
        }}
      >
        save
      </button>
    </div>
  )
}
