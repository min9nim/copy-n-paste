'use client'

import IconDelete from '@/components/icons/IconDelete'
import { copyToClipboard } from '@/utils'
import dayjs from 'dayjs'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'

dayjs.extend(require('dayjs/plugin/relativeTime'))

export default function List({ list, loading, setList, setLoading, userId }) {
  if (loading) {
    return <div className="animate-bounce">Loading..</div>
  }

  const deleteItem = async item => {
    const result = await Swal.fire({
      title: `Delete this text?`,
      html: `<span class="text-gray-400">${item.text}</span>`,
      // icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    })

    if (result.isConfirmed) {
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
  return (
    <div className="max-w-2xl w-full">
      {list.length === 0 && (
        <div className="flex flex-row justify-center items-center  my-2 py-2 px-4">
          There is no data
        </div>
      )}
      {list.map(item => (
        <div
          className="flex flex-col items-end my-4 bg-gray-900 "
          key={item._id}
        >
          <pre
            className="w-full py-2 px-4 cursor-pointer hover:italic break-all word-wrap"
            onClick={() => {
              copyToClipboard(item.text)
              toast.success('copied')
            }}
          >
            {item.text}
          </pre>
          <div className="flex flex-row gap-2 justify-between items-center text-gray-500 italic w-full px-2 text-sm">
            <div>expire in {dayjs(item.expireAt).format('YYYY.MM.DD')}</div>
            <div className="flex flex-row gap-2 items-center text-gray-500 italic">
              <div>{dayjs(item.createdAt).fromNow()}</div>
              <div
                className="hover:scale-110 cursor-pointer"
                onClick={() => deleteItem(item)}
              >
                <IconDelete size={30} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
