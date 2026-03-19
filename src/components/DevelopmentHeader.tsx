import React from 'react'

const DevelopmentHeader: React.FC = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 'var(--header-h)',
        backgroundColor: 'rgba(17, 17, 17, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--burn)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: '6px',
          height: '6px',
          backgroundColor: 'var(--burn)',
          borderRadius: '50%',
          boxShadow: '0 0 8px var(--burn)',
          animation: 'pulse 2s infinite',
        }}
      />
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          letterSpacing: '0.15em',
          color: 'var(--text)',
          textTransform: 'uppercase',
          fontWeight: 500,
        }}
      >
        Website under development
      </span>
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}

export default DevelopmentHeader
