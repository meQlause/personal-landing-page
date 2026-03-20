import { motion, type HTMLMotionProps } from 'framer-motion'
import React from 'react'

interface LoadingScreenProps {
  progress: number
}

// Helper to avoid TS error with initial/exit in some environments
const MotionDiv = motion.div as React.ComponentType<HTMLMotionProps<'div'>>

const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress }) => {
  return (
    <MotionDiv
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-[#0a0a0a]"
    >
      <div className="noise-overlay pointer-events-none opacity-40" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(40,40,40,0.15)_0%,transparent_100%)]" />

      <div className="relative flex flex-col items-center gap-8 px-6 text-center">
        <MotionDiv
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-4xl font-bold tracking-[0.2em] text-white sm:text-6xl">ARDIAL</span>
          <span className="text-xs tracking-[0.4em] text-white/40 uppercase">
            Personal Portfolio
          </span>
        </MotionDiv>

        <div className="relative w-64 h-[2px] bg-white/10 rounded-full overflow-hidden sm:w-80">
          <MotionDiv
            className="absolute left-0 top-0 h-full bg-white"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', damping: 20, stiffness: 50 }}
          />
        </div>

        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col gap-1 items-center"
        >
          <span className="text-[10px] font-mono tracking-widest text-white/50 uppercase">
            Loading Experience
          </span>
          <span className="text-sm font-mono text-white/80">{Math.round(progress)}%</span>
        </MotionDiv>
      </div>

      <div className="absolute top-8 left-8 w-12 h-12 border-t border-l border-white/20" />
      <div className="absolute top-8 right-8 w-12 h-12 border-t border-r border-white/20" />
      <div className="absolute bottom-8 left-8 w-12 h-12 border-b border-l border-white/20" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-b border-r border-white/20" />
    </MotionDiv>
  )
}

export default LoadingScreen
