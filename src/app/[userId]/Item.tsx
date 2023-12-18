import IconCopy from '@/components/icons/IconCopy'
import IconDelete from '@/components/icons/IconDelete'
import { copyToClipboard, enableUrl, removeAnimation } from '@/utils'
import dayjs from 'dayjs'
import { useParams } from 'next/navigation'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'

export default function Item({ item, pre, setList }) {
  const userId = useParams().userId

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
      await fetch('/api/delete', {
        method: 'delete',
        body: JSON.stringify({ _id: item._id }),
      })
      const list = await fetch('/api/list?userId=' + userId).then(res =>
        res.json(),
      )
      setList(list)
      toast.success('deleted')
    }
  }
  return (
    <div
      id={item._id}
      className="flex flex-col items-end my-4 bg-gray-900 "
      key={item._id}
    >
      {pre ? (
        <pre className="w-full py-2 px-4 break-all word-wrap overflow-auto">
          {item.text}
        </pre>
      ) : (
        <div
          className="w-full py-2 px-4 break-all word-wrap"
          dangerouslySetInnerHTML={{
            __html: enableUrl(item.text).replaceAll('\n', '<br/>'),
          }}
        />
      )}
      <div className="flex flex-row gap-2 justify-between items-center text-gray-500 italic w-full px-4 text-sm">
        <div className="flex flex-row items-center text-gray-500 italic">
          <div
            className="hover:scale-110 cursor-pointer mr-2"
            onClick={() => {
              copyToClipboard(item.text)
              toast.success('copied')
            }}
          >
            <IconCopy size={18} />
          </div>
          <div>expires in {dayjs(item.expireAt).format('YYYY.MM.DD')}</div>
          <div
            className="hover:scale-110 cursor-pointer"
            onClick={() => deleteItem(item)}
          >
            <IconDelete size={35} />
          </div>
        </div>
        <div className="flex flex-row gap-2 items-center text-gray-500 italic">
          <div>{dayjs(item.createdAt).fromNow()}</div>
          <div
            className="hover:scale-110 cursor-pointer"
            onClick={() => {
              copyToClipboard(item.text)
              toast.success('copied')
            }}
          >
            <IconCopy size={18} />
          </div>
        </div>
      </div>
    </div>
  )
}