'use client'

import { colorByExpireAt, req } from '@/utils'
import { clsNms, enableUrl, go, nl2br } from 'mingutils'
import { useParams } from 'next/navigation'
import { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import ItemFooter from './ItemFooter'

export default function Item({ item, pre, setList }) {
  const userId = useParams().userId
  const divRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const deleteItem = async item => {
    const result = await Swal.fire({
      title: `Delete this text?`,
      html: `<span class="text-gray-400">${
        item.text.length > 200
          ? item.text.slice(0, 100) + ' ... ' + item.text.slice(-100)
          : item.text
      }</span>`,
      // icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    })

    if (result.isConfirmed) {
      setLoading(true)
      await req.delete('/api/delete', { _id: item._id })
      const list = await req.get('/api/list', { userId })
      setList(list)
      setLoading(false)
      toast.success('deleted')
    }
  }

  return (
    <div
      ref={divRef}
      className={clsNms('flex flex-col items-end my-3 bg-gray-900', {
        'text-gray-700': loading,
        ...colorByExpireAt(item.expireAt, Date.now()),
      })}
      key={item._id}
    >
      {loading && (
        <div
          className="flex flex-row justify-center items-center animate-spin w-full text-white"
          style={{
            position: 'relative',
            top: (divRef.current?.clientHeight ?? 0) / 2,
            height: 0,
          }}
        >
          @@
        </div>
      )}
      {pre ? (
        <pre className="w-full py-3 px-3 break-all word-wrap overflow-auto">
          {item.text}
        </pre>
      ) : (
        <div
          className="w-full py-3 px-3 break-all word-wrap"
          dangerouslySetInnerHTML={{
            __html: go(item.text, enableUrl, nl2br),
          }}
        />
      )}
      <ItemFooter item={item} deleteItem={deleteItem} loading={loading} />
    </div>
  )
}
