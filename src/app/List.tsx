'use client'

import IconCopy from '@/components/icons/IconCopy'
import { copyToClipboard } from '@/utils'
import toast from 'react-hot-toast'

export default function List({ list }) {
  if (list.length === 0) {
    return <div className="animate-bounce">Loading..</div>
  }

  return (
    <div className="max-w-2xl w-full">
      {list.map(item => (
        <div
          className="flex flex-row justify-between bg-gray-800 my-2 py-2 px-4"
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
        </div>
      ))}
    </div>
  )
}
