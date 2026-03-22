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
      className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-[#05070a]"
    >
      <div className="noise-overlay pointer-events-none opacity-40" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_100%)]" />

      <div className="relative flex flex-col items-center gap-12 px-6 text-center">
        <MotionDiv
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col items-center gap-2"
        >
          <span
            className="text-4xl font-bold tracking-[0.2em] text-white sm:text-6xlglitch"
            data-text="ARDIAL"
          >
            ARDIAL
          </span>
          <span className="text-xs tracking-[0.4em] text-white/40 uppercase">Personal Website</span>
        </MotionDiv>

        {/* Unique Circular Progress */}
        <div className="relative flex items-center justify-center w-48 h-48 sm:w-56 sm:h-56">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background Circle */}
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              stroke="white"
              strokeWidth="1"
              fill="transparent"
              className="opacity-[0.03]"
            />
            {/* Progress Circle */}
            <motion.circle
              cx="50%"
              cy="50%"
              r="45%"
              stroke="var(--acid)"
              strokeWidth="2"
              fill="transparent"
              strokeDasharray="283%"
              initial={{ strokeDashoffset: '283%' }}
              animate={{
                strokeDashoffset: `${283 - (283 * progress) / 100}%`,
              }}
              transition={{
                strokeDashoffset: { type: 'spring', damping: 20, stiffness: 50 },
              }}
            />
          </svg>

          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-4xl font-mono text-white/90 font-light">
              {Math.round(progress)}%
            </span>
            <div className="flex gap-1 mt-1">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  className="w-1 h-1 bg-[var(--acid)] rounded-full"
                />
              ))}
            </div>
          </div>

          {/* Decorative bits - Orbital markers */}
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <div
              key={angle}
              className="absolute w-0.5 h-2 bg-white/10"
              style={{ transform: `rotate(${angle}deg) translateY(-110px)` }}
            />
          ))}
        </div>

        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col gap-2 items-center"
        >
          <span className="text-[10px] font-mono tracking-[0.4em] text-white/30 uppercase">
            Initializing Core Systems
          </span>
          <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[var(--acid)] to-transparent opacity-20" />
        </MotionDiv>
      </div>
    </MotionDiv>
  )
}

export default LoadingScreen
