import { useEffect, useRef } from 'react'

interface UseIntersectionObserverOptions {
  threshold?: number
  rootMargin?: string
  onIntersect?: (entry: IntersectionObserverEntry) => void
}

/**
 * Attaches an IntersectionObserver to a ref. Calls onIntersect when element
 * enters the viewport, then unobserves (one-shot reveal).
 */
export function useIntersectionObserver<T extends HTMLElement>(
  options: UseIntersectionObserverOptions = {}
) {
  const { threshold = 0.12, rootMargin = '0px 0px -50px 0px', onIntersect } = options
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          onIntersect?.(entry)
          observer.unobserve(entry.target)
        })
      },
      { threshold, rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin, onIntersect])

  return ref
}
