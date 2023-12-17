'use client'

import Button from '@/components/Button'
import { textFromClipboard } from '@/utils'
import { clsNms } from '@madup-inc/utils'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function Form({ userId, setList }) {
  const [text, setText] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const saveText = async ({ text, userId }) => {
    if (!text) {
      toast.error('No text in textarea')
      throw Error('No text in textarea')
    }
    setLoading(true)
    await fetch(`/api/save`, {
      method: 'post',
      body: JSON.stringify({ text, userId }),
    }).then(res => res.json())
    setText('')
    const list = await fetch(`/api/list?userId=${userId}`).then(res =>
      res.json(),
    )
    setList(list)
    setLoading(false)
    toast.success('saved')
  }

  return (
    <div className="max-w-2xl w-full">
      <textarea
        className={clsNms('p-2 bg-gray-800 w-full border', {
          'animate-bounce': loading,
          'bg-gray-700': loading,
        })}
        value={text}
        disabled={loading}
        rows={5}
        onChange={e => {
          setText(e.target.value)
        }}
      />
      <div className="flex flex-row gap-2">
        <Button
          label="Paste"
          onClick={async () => {
            const value = await textFromClipboard()
            setText(value)
          }}
        />
        <Button
          label="Save"
          onClick={async () => {
            await saveText({ text, userId })
          }}
        />
        <Button
          label="Paste & Save"
          onClick={async () => {
            const value = await textFromClipboard()
            setText(value)
            await saveText({ text: value, userId })
          }}
        />
      </div>
    </div>
  )
}
