'use client'

import { useEffect, useState } from 'react'

export default function List() {
  const [list, setList] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/list')
      .then(res => res.json())
      .then(list => {
        setList(list)
      })
  }, [])

  if (list.length === 0) {
    return <div className="animate-bounce">Loading..</div>
  }

  return (
    <div className="max-w-2xl w-full">
      {list.map(item => (
        <div className="bg-gray-800 my-2 py-2 px-4" key={item._id}>
          {item.text}
        </div>
      ))}
    </div>
  )
}
