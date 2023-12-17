'use client'

import Button from '@/components/Button'
import Radio from '@/components/Radio'
import { ONE_DAY } from '@/constant'
import { textFromClipboard } from '@/utils'
import { clsNms } from '@madup-inc/utils'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function Form({ userId, setList }) {
  const [text, setText] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [expire, setExpire] = useState<number>(0)

  const saveText = async ({ text, userId }) => {
    if (!text) {
      toast.error('No text in textarea')
      return
    }
    setLoading(true)
    await fetch(`/api/save`, {
      method: 'post',
      body: JSON.stringify({ text, userId }),
    }).then(res => res.json())
    const list = await fetch(`/api/list?userId=${userId}`).then(res =>
      res.json(),
    )
    setList(list)
    setText('')
    setLoading(false)
    toast.success('saved')
  }

  return (
    <div className="max-w-2xl w-full">
      <textarea
        className={clsNms('p-2 bg-gray-900 w-full border', {
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
      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-2">
          <Button
            label="Paste"
            onClick={async () => {
              const value = await textFromClipboard()
              setText(value)
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
        <div className="flex flex-row flex-wrap items-center gap-2 px-2">
          <span>Expires in</span>
          <Radio
            options={[
              {
                label: '1M',
                value: ONE_DAY * 31,
              },
              {
                label: '3M',
                value: ONE_DAY * 31 * 3,
              },
              {
                label: '1Y',
                value: ONE_DAY * 31 * 12,
              },
            ]}
            value={expire}
            setValue={setExpire}
          />
        </div>

        <Button
          label="Save"
          onClick={async () => {
            await saveText({ text, userId })
          }}
        />
      </div>
    </div>
  )
}
