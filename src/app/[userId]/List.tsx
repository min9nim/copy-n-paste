'use client'

import dayjs from 'dayjs'
import { not } from 'ramda'
import { useState } from 'react'
import Item from './Item'

dayjs.extend(require('dayjs/plugin/relativeTime'))

export default function List({ list, setList, userId }) {
  const [pre, setPre] = useState<boolean>(false)

  return (
    <div className="max-w-2xl w-full">
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
      {list.map(item => (
        <Item item={item} pre={pre} setList={setList} userId={userId} />
      ))}
    </div>
  )
}
