"use client"

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { LogOut, Wallet } from "lucide-react"
import { ProfileSheet } from "./ProfileSheet"

export function Header() {
  const { user, logout } = useAuth()
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 glass-header">
        <div className="max-w-lg mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-400/15 rounded-xl blur-md" />
              <div className="relative w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Wallet className="w-5 h-5 text-slate-900" />
              </div>
            </div>
            <h1 className="text-xl font-bold gradient-text-white tracking-tight">Group Fund</h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Profile Button */}
            <button
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-2.5 px-3 py-2 glass-card-light rounded-xl hover-lift cursor-pointer"
            >
              <div className="w-7 h-7 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-sm font-semibold text-slate-900">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium text-white leading-tight">{user?.name}</p>
                <p className="text-[11px] text-slate-400 capitalize leading-tight">{user?.role}</p>
              </div>
            </button>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="w-10 h-10 glass-card-light rounded-xl flex items-center justify-center transition-all duration-300 text-slate-400 hover:text-red-400 hover:border-red-500/30 hover:shadow-[0_0_15px_rgba(239,68,68,0.1)] cursor-pointer"
              aria-label="Logout"
            >
              <LogOut className="w-[18px] h-[18px]" />
            </button>
          </div>
        </div>
      </header>

      <ProfileSheet isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  )
}
