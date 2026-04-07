"use client"

import { useAuth, AuthProvider } from "@/context/AuthContext"
import { LoginPage } from "./LoginPage"
import { Dashboard } from "./Dashboard"
import { Spinner } from "@/components/ui/spinner"

function AppContent() {
  const { token, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Spinner className="w-8 h-8 text-yellow-400" />
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
