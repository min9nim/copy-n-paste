'use client'

import IconCopy from '@/components/icons/IconCopy'
import IconDelete from '@/components/icons/IconDelete'
import useIsClient from '@/hooks/useIsClient'
import { copyToClipboard } from '@/utils'
import dayjs from 'dayjs'
import toast from 'react-hot-toast'

export default function ItemFooter({ loading, item, deleteItem }) {
  const isClient = useIsClient()
  return (
    <div
      className={`flex flex-row gap-2 justify-between items-center italic w-full px-3 text-sm ${
        loading ? 'text-gray-700' : 'text-gray-500'
      }`}
    >
      <div className="flex flex-row items-center italic">
        {isClient && document.body.clientWidth > 672 && (
          <div
            className={`mr-2 ${
              loading ? 'cursor-not-allowed' : 'hover:scale-110 cursor-pointer'
            }`}
            onClick={() => {
              copyToClipboard(item.text)
              toast.success('copied')
            }}
          >
            <IconCopy size={18} />
          </div>
        )}
        <div>expires in {dayjs(item.expireAt).format('YYYY.MM.DD')}</div>
        <div
          className={
            loading ? 'cursor-not-allowed' : 'hover:scale-110 cursor-pointer'
          }
          onClick={() => deleteItem(item)}
        >
          <IconDelete size={35} />
        </div>
      </div>
      <div className="flex flex-row gap-2 items-center italic">
        <div>{dayjs(item.createdAt).fromNow()}</div>
        <div
          className={
            loading ? 'cursor-not-allowed' : 'hover:scale-110 cursor-pointer'
          }
          onClick={() => {
            copyToClipboard(item.text)
            toast.success('copied')
          }}
        >
          <IconCopy size={18} />
        </div>
      </div>
    </div>
  )
}
