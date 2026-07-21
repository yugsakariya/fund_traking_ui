"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { authApi, type User } from "@/lib/api"

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing token on mount
    try {
      const storedToken = localStorage.getItem("token")
      const storedUser = localStorage.getItem("user")

      if (storedToken && storedUser) {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      }
    } catch {
      // localStorage access denied or invalid stored data — continue without auth
      try {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      } catch {
        // Ignore — localStorage is fully inaccessible
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const response = await authApi.login(email, password)
    
    const userData: User = {
      id: response.user.id,
      name: response.user.name,
      email: response.user.email,
      role: response.user.role,
    }

    try {
      localStorage.setItem("token", response.token)
      localStorage.setItem("user", JSON.stringify(userData))
    } catch {
      // localStorage not available — session won't persist across refreshes
    }

    setToken(response.token)
    setUser(userData)
  }

  const logout = () => {
    // Call logout API (fire and forget)
    authApi.logout().catch(() => {})
    
    try {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    } catch {
      // Ignore — localStorage is inaccessible
    }
    setToken(null)
    setUser(null)
  }

  const isAdmin = user?.role === "admin"

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
