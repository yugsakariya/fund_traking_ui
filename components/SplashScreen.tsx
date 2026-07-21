'use client'

import { useEffect, useState, useCallback } from 'react'

interface SplashScreenProps {
  children: React.ReactNode
}

const HEALTH_CHECK_INTERVAL = 1000 // 1 second between retries
const HEALTH_ENDPOINT = '/api/health'

export function SplashScreen({ children }: SplashScreenProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  const checkHealth = useCallback(async (signal: AbortSignal): Promise<boolean> => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''
    try {
      const response = await fetch(`${apiUrl}${HEALTH_ENDPOINT}`, { signal })
      return response.status === 200
    } catch {
      return false
    }
  }, [])

  useEffect(() => {
    let isMounted = true
    let retryTimeout: NodeJS.Timeout
    const abortController = new AbortController()

    const pollHealth = async () => {
      const isHealthy = await checkHealth(abortController.signal)
      
      if (!isMounted) return

      if (isHealthy) {
        setFadeOut(true)
        setTimeout(() => {
          if (isMounted) setIsLoading(false)
        }, 600)
      } else {
        retryTimeout = setTimeout(pollHealth, HEALTH_CHECK_INTERVAL)
      }
    }

    pollHealth()

    return () => {
      isMounted = false
      abortController.abort()
      clearTimeout(retryTimeout)
    }
  }, [checkHealth])

  // Show splash screen while loading - don't render children at all
  if (isLoading) {
    return (
      <div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-premium noise-overlay transition-all duration-600 ${
          fadeOut ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
        }`}
      >
        {/* Ambient glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl animate-breathe" />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl animate-breathe" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 flex flex-col items-center gap-8">
          {/* Logo with glow */}
          <div className="relative animate-float">
            <div className="absolute inset-0 bg-amber-400/20 rounded-2xl blur-xl" />
            <div className="relative w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center glow-amber-strong">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0f172a"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-10 h-10"
              >
                <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
              </svg>
            </div>
          </div>

          {/* App Name */}
          <div className="text-center animate-fade-in" style={{ animationDelay: '200ms' }}>
            <h1 className="text-3xl font-bold gradient-text-white tracking-tight">
              Group Fund
            </h1>
            <p className="mt-2 text-sm text-slate-400 tracking-wide">
              Managing your funds with ease
            </p>
          </div>

          {/* Premium Loading Bar */}
          <div className="w-48 animate-fade-in" style={{ animationDelay: '400ms' }}>
            <div className="w-full h-0.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="loading-bar" />
            </div>
            <p className="text-center text-xs text-slate-500 mt-3 animate-breathe">
              Loading
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Only render children after health check passes and fade-out is complete
  return <>{children}</>
}
