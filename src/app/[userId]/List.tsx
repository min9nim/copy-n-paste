'use client'

import IconCopy from '@/components/icons/IconCopy'
import IconDelete from '@/components/icons/IconDelete'
import { copyToClipboard } from '@/utils'
import toast from 'react-hot-toast'

export default function List({ list, loading }) {
  if (loading) {
    return <div className="animate-bounce">Loading..</div>
  }

  console.log(22, list)
  return (
    <div className="max-w-2xl w-full">
      {list.length === 0 && (
        <div className="flex flex-row justify-center items-center  my-2 py-2 px-4">
          There is no data
        </div>
      )}
      {list.map(item => (
        <div
          className="flex flex-row justify-between items-center bg-gray-800 my-2 py-2 px-4"
          key={item._id}
        >
          <pre>{item.text}</pre>
          <div
            className="hover:scale-110 cursor-pointer"
            onClick={() => {
              copyToClipboard(item.text)
              toast.success('copied')
            }}
          >
            <IconCopy size={15} />
          </div>
          <div
            className="hover:scale-110 cursor-pointer"
            onClick={async () => {
              await fetch('/api/delete', {
                method: 'delete',
                body: JSON.stringify({ _id: item._id }),
              })
              toast.success('deleted')
            }}
          >
            <IconDelete size={25} />
          </div>
        </div>
      ))}
    </div>
  )
}
