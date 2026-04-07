'use client'

import { useEffect, useState } from 'react'
import { Spinner } from '@/components/ui/spinner'

interface SplashScreenProps {
  children: React.ReactNode
}

export function SplashScreen({ children }: SplashScreenProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    let isMounted = true
    let retryTimeout: NodeJS.Timeout

    const checkHealth = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''
      console.log('[v0] Checking health at:', `${apiUrl}/api/health`)
      try {
        const response = await fetch(`${apiUrl}/api/health`)
        console.log('[v0] Health check response status:', response.status)
        if (response.status === 200) {
          // Start fade out animation
          console.log('[v0] Health check passed, fading out splash screen')
          setFadeOut(true)
          // Wait for animation to complete before hiding
          setTimeout(() => {
            if (isMounted) {
              console.log('[v0] Splash screen hidden, showing app')
              setIsLoading(false)
            }
          }, 500)
        } else {
          // Retry after a delay if not 200
          console.log('[v0] Health check failed, retrying in 1s')
          retryTimeout = setTimeout(checkHealth, 1000)
        }
      } catch (error) {
        // Retry after a delay on error
        console.log('[v0] Health check error:', error, 'retrying in 1s')
        retryTimeout = setTimeout(checkHealth, 1000)
      }
    }

    checkHealth()

    return () => {
      isMounted = false
      clearTimeout(retryTimeout)
    }
  }, [])

  // Show splash screen while loading - don't render children at all
  if (isLoading) {
    return (
      <div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${
          fadeOut ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="flex flex-col items-center gap-6">
          {/* Logo/Icon */}
          <div className="flex size-20 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-10"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>

          {/* App Name */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">
              Group Fund Tracker
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Managing your funds with ease
            </p>
          </div>

          {/* Loading Spinner */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Spinner className="size-5" />
            <span className="text-sm">Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  // Only render children after health check passes and fade-out is complete
  return <>{children}</>
}
