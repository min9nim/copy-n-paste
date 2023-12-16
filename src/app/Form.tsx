'use client'

import { useState } from 'react'

export default function Form() {
  const [text, setText] = useState<string>('')
  return (
    <textarea
      className="p-2 bg-gray-900 max-w-2xl w-full"
      value={text}
      rows={5}
      onChange={e => {
        setText(e.target.value)
      }}
    />
  )
}
