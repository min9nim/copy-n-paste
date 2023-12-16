'use client'

export default function Button({ label, onClick }) {
  return (
    <button className="border px-2 py-1" onClick={onClick}>
      {label}
    </button>
  )
}
