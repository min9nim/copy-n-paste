'use client'

import Button from '@/components/Button'
import Radio from '@/components/Radio'
import { ONE_DAY } from '@/constant'
import useIsClient from '@/hooks/useIsClient'
import { req, textFromClipboard } from '@/utils'
import { clsNms } from 'mingutils'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function Form({ userId, setList }) {
  const isClient = useIsClient()
  const [text, setText] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [expire, setExpire] = useState<number>(ONE_DAY * 31)

  const saveText = async ({ text, userId, expire }) => {
    if (!text) {
      toast.error('No text in textarea')
      return
    }
    setLoading(true)
    await req.post('/api/save', { text: text.trim(), userId, expire })
    const list = await req.get('/api/list', { userId })
    setList(list)
    setText('')
    setLoading(false)
    toast.success('saved')
  }

  return (
    <div className={clsNms('max-w-2xl w-full', { 'text-gray-500': loading })}>
      <textarea
        className="p-2 bg-gray-900 w-full border"
        value={text}
        disabled={loading}
        rows={5}
        onChange={e => {
          setText(e.target.value)
        }}
      />
      {loading && (
        <div
          className="w-full max-w-2xl text-xl"
          style={{ position: 'absolute', marginTop: '-80px' }}
        >
          <div className="w-full flex justify-center animate-spin text-white">
            @@
          </div>
        </div>
      )}
      <div className="flex flex-row flex-wrap justify-between">
        <div className="mb-1 flex flex-row gap-2">
          {isClient && document.body.clientWidth > 672 && (
            <Button
              label="Save"
              onClick={async () => {
                await saveText({ text, userId, expire })
              }}
              disable={loading}
            />
          )}
          <Button
            label="Paste"
            onClick={async () => {
              const value = await textFromClipboard()
              setText(text => text + value)
            }}
            disable={loading}
          />
        </div>
        <div className="flex flex-row flex-wrap items-center gap-2 px-2 mb-1">
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
            readOnly={loading}
          />
        </div>

        <div className="flex flex-row gap-2 mb-1">
          <Button
            label="Paste & Save"
            onClick={async () => {
              const value = await textFromClipboard()
              setText(text => text + value)
              await saveText({ text: text + value, userId, expire })
            }}
            disable={loading}
          />
          <Button
            label="Save"
            onClick={async () => {
              await saveText({ text, userId, expire })
            }}
            disable={loading}
          />
        </div>
      </div>
    </div>
  )
}
