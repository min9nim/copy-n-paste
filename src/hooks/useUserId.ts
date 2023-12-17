import { usePathname } from 'next/navigation'

export default function useUserId() {
  const pathname = usePathname()

  console.log({ pathname })

  // useEffect(() => {
  //   if (!userId) {
  //     const id = Math.random().toString(36).slice(2)
  //     window.localStorage.setItem('userId', id)
  //     setUserId(id)
  //   }
  // }, [pathname])

  return pathname
}
