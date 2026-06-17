'use client'

import { useEffect, useState } from 'react'

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!sessionStorage.getItem('splashShown')) {
      setIsVisible(true)
      setTimeout(() => {
        setIsVisible(false)
        sessionStorage.setItem('splashShown', 'true')
      }, 3000)
    }
  }, [])

  if (!isVisible) return null

  return (
    <div 
      className="fixed inset-0 bg-[#003366] z-[9999] flex flex-col items-center justify-center transition-opacity duration-800"
    >
      <div className="text-white text-5xl mb-10 font-extrabold tracking-widest animate-[fadeIn_1s_ease-in]">
        FurFinder
      </div>
      <div className="flex gap-8 relative -rotate-15">
        {[0, 1, 2, 3, 4].map((i) => (
          <i 
            key={i} 
            className="fas fa-paw text-[#d4af37] text-5xl opacity-0 animate-[walk_2s_forwards]"
            style={{ 
              animationDelay: `${0.2 + i * 0.4}s`,
              transform: `translateY(${i % 2 === 0 ? '20px' : '-20px'})`
            }}
          ></i>
        ))}
      </div>
      <style jsx>{`
        @keyframes walk {
          0% { opacity: 0; transform: scale(0.5) translateY(inherit); }
          50% { opacity: 1; transform: scale(1.1) translateY(inherit); }
          100% { opacity: 0.5; transform: scale(1) translateY(inherit); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
