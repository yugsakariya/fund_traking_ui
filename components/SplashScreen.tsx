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
    const checkHealth = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''
        const response = await fetch(`${apiUrl}/api/health`)
        if (response.status === 200) {
          // Start fade out animation
          setFadeOut(true)
          // Wait for animation to complete before hiding
          setTimeout(() => {
            setIsLoading(false)
          }, 500)
        } else {
          // Retry after a delay if not 200
          setTimeout(checkHealth, 1000)
        }
      } catch {
        // Retry after a delay on error
        setTimeout(checkHealth, 1000)
      }
    }

    checkHealth()
  }, [])

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

  return <>{children}</>
}
