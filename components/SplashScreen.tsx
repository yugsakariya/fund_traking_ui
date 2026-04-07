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
        }, 500)
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
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900 transition-opacity duration-500 ${
          fadeOut ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="flex flex-col items-center gap-6">
          {/* Logo/Icon - matches app header */}
          <div className="w-20 h-20 bg-yellow-400 rounded-2xl flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#111827"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-10 h-10"
            >
              <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
              <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
              <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
            </svg>
          </div>

          {/* App Name */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">
              Group Fund
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              Managing your funds with ease
            </p>
          </div>

          {/* Loading Spinner - yellow to match accent */}
          <div className="flex items-center gap-2 text-gray-400">
            <span className="w-5 h-5 border-2 border-gray-700 border-t-yellow-400 rounded-full animate-spin" />
            <span className="text-sm">Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  // Only render children after health check passes and fade-out is complete
  return <>{children}</>
}
