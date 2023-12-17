'use client'

import IconCopy from '@/components/icons/IconCopy'
import IconDelete from '@/components/icons/IconDelete'
import { copyToClipboard } from '@/utils'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'

export default function List({ list, loading }) {
  if (loading) {
    return <div className="animate-bounce">Loading..</div>
  }

  return (
    <div className="max-w-2xl w-full">
      {list.length === 0 && (
        <div className="flex flex-row justify-center items-center  my-2 py-2 px-4">
          There is no data
        </div>
      )}
      {list.map(item => (
        <div className="flex flex-col items-end my-2 py-2 px-4" key={item._id}>
          <pre className="w-full bg-gray-800 py-2 px-4 ">{item.text}</pre>
          <div className="flex items-center justify-end">
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
                  await fetch('/api/delete', {
                    method: 'delete',
                    body: JSON.stringify({ _id: item._id }),
                  })
                  toast.success('deleted')
                }
              }}
            >
              <IconDelete size={30} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
