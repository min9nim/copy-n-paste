'use client'

import { removeAnimation } from '@/utils'
import dayjs from 'dayjs'
import { not } from 'ramda'
import { useState } from 'react'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import Item from './Item'

dayjs.extend(require('dayjs/plugin/relativeTime'))

export default function List({ list, loading, setList, setLoading, userId }) {
  const [pre, setPre] = useState<boolean>(false)
  const deleteItem = async item => {
    const result = await Swal.fire({
      title: `Delete this text?`,
      html: `<span class="text-gray-400">${
        item.text.length > 50
          ? item.text.slice(20) + ' ... ' + item.text.slice(-20)
          : item.text
      }</span>`,
      // icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    })

    if (result.isConfirmed) {
      await removeAnimation(document.getElementById(item._id), 0.5)
      setLoading(true)

      await fetch('/api/delete', {
        method: 'delete',
        body: JSON.stringify({ _id: item._id }),
      })
      const list = await fetch('/api/list?userId=' + userId).then(res =>
        res.json(),
      )
      setList(list)
      setLoading(false)
      toast.success('deleted')
    }
  }
  if (list.length === 0 && loading) {
    return <div className="animate-spin">@@</div>
  }

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
        <Item item={item} deleteItem={deleteItem} pre={pre} />
      ))}
    </div>
  )
}
