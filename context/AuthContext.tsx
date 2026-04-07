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
    const storedToken = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      } catch {
        // Invalid stored data, clear it
        localStorage.removeItem("token")
        localStorage.removeItem("user")
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

    localStorage.setItem("token", response.token)
    localStorage.setItem("user", JSON.stringify(userData))

    setToken(response.token)
    setUser(userData)
  }

  const logout = () => {
    // Call logout API (fire and forget)
    authApi.logout().catch(() => {})
    
    localStorage.removeItem("token")
    localStorage.removeItem("user")
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
