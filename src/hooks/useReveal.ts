import { useEffect, useRef, useState } from 'react'

interface UseRevealOptions {
  delay?: number
  threshold?: number
  rootMargin?: string
}

/**
 * Returns a ref and a boolean `inView`. When the element enters the viewport,
 * `inView` becomes true after an optional delay. The observer disconnects
 * after the first trigger (one-shot animation).
 */
export function useReveal<T extends HTMLElement>(options: UseRevealOptions = {}) {
  const { delay = 0, threshold = 0.12, rootMargin = '0px 0px -50px 0px' } = options
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          setTimeout(() => setInView(true), delay)
          observer.unobserve(entry.target)
        })
      },
      { threshold, rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay, threshold, rootMargin])

  return { ref, inView }
}
