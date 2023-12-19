'use client'

import IconSpin from '@/components/icons/IconSpin'
import dayjs from 'dayjs'
import { clsNms } from 'mingutils'
import { useParams } from 'next/navigation'
import { not } from 'ramda'
import { useState } from 'react'
import toast from 'react-hot-toast'
import Item from './Item'

dayjs.extend(require('dayjs/plugin/relativeTime'))

export default function List({ list, setList }) {
  const { userId } = useParams()
  const [pre, setPre] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  return (
    <div className="max-w-2xl w-full">
      <div
        className="flex flex-row items-center justify-between"
        style={{ marginBottom: -10 }}
      >
        <div
          onClick={async () => {
            if (loading) {
              return
            }
            setLoading(true)
            const list = await fetch(`/api/list?userId=${userId}`).then(res =>
              res.json(),
            )
            setList(list)
            setLoading(false)
            toast.success('Synchronized')
          }}
          className={clsNms(
            { 'cursor-pointer': !loading },
            { 'animate-spin': loading },
          )}
        >
          <IconSpin size={23} />
        </div>
        <div className="flex flex-row gap-1 items-center justify-end">
          <input
            type="checkbox"
            checked={pre}
            onChange={e => {
              setPre(not)
              console.log(e.target.checked)
            }}
          />
          <span
            className="cursor-pointer"
            onClick={e => {
              setPre(not)
            }}
          >
            preformatted
          </span>
        </div>
      </div>

      {list.map(item => (
        <Item key={item._id} item={item} pre={pre} setList={setList} />
      ))}
    </div>
  )
}
