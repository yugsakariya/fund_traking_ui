"use client"

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { LogOut, Wallet, User } from "lucide-react"
import { ProfileSheet } from "./ProfileSheet"

export function Header() {
  const { user, logout } = useAuth()
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 bg-gray-900 border-b border-gray-800">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center">
              <Wallet className="w-5 h-5 text-gray-900" />
            </div>
            <h1 className="text-xl font-bold text-white">Group Fund</h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Profile Button */}
            <button
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
            >
              <div className="w-7 h-7 bg-yellow-400 rounded-lg flex items-center justify-center">
                <span className="text-sm font-semibold text-gray-900">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium text-white leading-tight">{user?.name}</p>
                <p className="text-xs text-gray-400 capitalize leading-tight">{user?.role}</p>
              </div>
            </button>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="w-10 h-10 bg-gray-800 hover:bg-red-500/20 hover:text-red-400 rounded-xl flex items-center justify-center transition-colors text-gray-400"
              aria-label="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <ProfileSheet isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  )
}
