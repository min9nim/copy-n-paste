'use client'

export default function Button({ label, onClick, disable = false }) {
  return (
    <button className="border px-2 py-1" onClick={onClick} disabled={disable}>
      {label}
    </button>
  )
}
