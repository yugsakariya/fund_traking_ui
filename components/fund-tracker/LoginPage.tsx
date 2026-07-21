"use client"

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { Wallet, Mail, Lock, Eye, EyeOff } from "lucide-react"

export function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    // Basic validation
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password")
      return
    }

    setIsLoading(true)

    try {
      await login(email.trim(), password)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Invalid email or password"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-premium noise-overlay flex flex-col items-center justify-center px-4 relative">
      {/* Ambient background orbs */}
      <div className="absolute top-1/3 left-1/6 w-72 h-72 bg-amber-500/[0.04] rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/6 w-56 h-56 bg-indigo-500/[0.03] rounded-full blur-3xl" />
      <div className="absolute top-1/6 right-1/3 w-40 h-40 bg-amber-400/[0.03] rounded-full blur-2xl" />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="relative inline-block mb-5">
            <div className="absolute inset-0 bg-amber-400/20 rounded-2xl blur-xl scale-110" />
            <div className="relative w-18 h-18 bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto animate-pulse-glow">
              <Wallet className="w-9 h-9 text-slate-900" />
            </div>
          </div>
          <h1 className="text-3xl font-bold gradient-text-white tracking-tight">Group Fund Tracker</h1>
          <p className="text-slate-400 mt-2 text-sm tracking-wide">Sign in to manage your group funds</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
          {error && (
            <div className="glass-card-light rounded-xl px-4 py-3 border-red-500/30 animate-scale-in" role="alert">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
              Email
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-amber-400 transition-colors duration-300" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                autoComplete="email"
                className="w-full glass-input rounded-xl pl-12 pr-4 py-4 text-white placeholder-slate-500 focus:outline-none transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
              Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-amber-400 transition-colors duration-300" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full glass-input rounded-xl pl-12 pr-12 py-4 text-white placeholder-slate-500 focus:outline-none transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors duration-300"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-accent py-4 rounded-xl mt-8 flex items-center justify-center gap-2 text-base"
          >
            {isLoading ? (
              <>
                <span className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
