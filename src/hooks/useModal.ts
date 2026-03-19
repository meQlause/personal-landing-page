import { useCallback, useEffect, useState } from 'react'
import type { ModalState, ModalType, Project, Experience, Certification, Education } from '../types'

type ModalData = Project | Experience | Certification | Education

export function useModal() {
  const [modal, setModal] = useState<ModalState>({ type: null, data: null })

  const openModal = useCallback((type: ModalType, data: ModalData) => {
    setModal({ type, data })
    document.body.style.overflow = 'hidden'
  }, [])

  const closeModal = useCallback(() => {
    setModal({ type: null, data: null })
    document.body.style.overflow = ''
  }, [])

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modal.type !== null) {
        closeModal()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [modal.type, closeModal])

  return { modal, openModal, closeModal }
}
