'use client'

import { useState } from 'react'

export default function Form() {
  const [text, setText] = useState<string>('')
  return (
    <textarea
      className="p-2"
      value={text}
      cols={50}
      rows={5}
      onChange={e => {
        setText(e.target.value)
      }}
    />
  )
}
