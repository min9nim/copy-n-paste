'use client'

import IconSpin from '@/components/icons/IconSpin'
import dayjs from 'dayjs'
import { not } from 'ramda'
import { useState } from 'react'
import Item from './Item'

dayjs.extend(require('dayjs/plugin/relativeTime'))

export default function List({ list, setList }) {
  const [pre, setPre] = useState<boolean>(false)

  return (
    <div className="max-w-2xl w-full">
      <div
        className="flex flex-row items-center justify-between"
        style={{ marginBottom: -10 }}
      >
        <IconSpin size={23} />
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
