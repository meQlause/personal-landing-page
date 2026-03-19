import { useEffect, useState } from 'react'
import { throttle } from '../utils/throttle'

export function useNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = throttle(() => {
      setScrolled(window.scrollY > 50)
    }, 50)

    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const toggleMobile = () => setMobileOpen((prev) => !prev)
  const closeMobile = () => setMobileOpen(false)

  return { scrolled, mobileOpen, toggleMobile, closeMobile }
}
