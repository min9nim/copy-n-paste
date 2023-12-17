'use client'

import { useEffect } from 'react'

export default function SweetAlertDarkMode() {
  const isDark = true
  useEffect(() => {
    const ss = document.createElement('link')
    ss.rel = 'stylesheet'
    if (isDark) {
      ss.href = '//cdn.jsdelivr.net/npm/@sweetalert2/theme-dark@4/dark.css'
    } else {
      ss.href = '//cdn.jsdelivr.net/npm/@sweetalert2/theme-minimal/minimal.css'
    }
    document.head.appendChild(ss)
  }, [])
  return null
}
