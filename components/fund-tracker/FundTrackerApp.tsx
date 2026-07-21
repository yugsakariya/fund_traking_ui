"use client"

import { useAuth, AuthProvider } from "@/context/AuthContext"
import { LoginPage } from "./LoginPage"
import { Dashboard } from "./Dashboard"
import { Spinner } from "@/components/ui/spinner"

function AppContent() {
  const { token, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-premium noise-overlay flex items-center justify-center">
        <div className="relative z-10">
          <div className="absolute inset-0 bg-amber-400/15 rounded-full blur-xl" />
          <Spinner className="relative w-8 h-8 text-amber-400" />
        </div>
      </div>
    )
  }

  return token ? <Dashboard /> : <LoginPage />
}

export function FundTrackerApp() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
