"use client"

import useSWR from "swr"
import { X, User, Mail, Shield, Calendar, RefreshCw, Wallet, TrendingUp, TrendingDown, History } from "lucide-react"
import { authApi, type User as UserType, type ProfileLedgerItem } from "@/lib/api"
import { useAuth } from "@/context/AuthContext"

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

interface ProfileSheetProps {
  isOpen: boolean
  onClose: () => void
}

export function ProfileSheet({ isOpen, onClose }: ProfileSheetProps) {
  const { user: authUser } = useAuth()
  
  const { 
    data: profileData, 
    error,
    isLoading,
    mutate 
  } = useSWR(isOpen ? "user-profile" : null, () => authApi.getProfile())

  const user = profileData?.user ?? authUser
  const summary = profileData?.summary ?? { total_deposits: 0, total_withdrawals: 0, net_contribution: 0 }
  const ledger = profileData?.ledger ?? []

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-gray-900 border-l border-gray-800 z-50 transform transition-transform">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
            <h2 className="text-lg font-semibold text-white">Profile</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="w-6 h-6 text-yellow-400 animate-spin" />
              </div>
            ) : error ? (
              <div className="bg-red-500/10 border border-red-500/50 rounded-xl px-4 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-red-400 text-sm">Failed to load profile</p>
                  <button 
                    onClick={() => mutate()}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : user ? (
              <div className="space-y-6">
                {/* Avatar */}
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-yellow-400 rounded-2xl flex items-center justify-center mb-4">
                    <span className="text-3xl font-bold text-gray-900">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-white">{user.name}</h3>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 mt-2 rounded-full text-xs font-medium ${
                    user.role === "admin" 
                      ? "bg-yellow-400/10 text-yellow-400 border border-yellow-400/30" 
                      : "bg-gray-700 text-gray-300 border border-gray-600"
                  }`}>
                    <Shield className="w-3 h-3" />
                    {user.role === "admin" ? "Administrator" : "Member"}
                  </span>
                </div>

                {/* Contribution Summary */}
                <div className="bg-gradient-to-br from-yellow-400/20 to-yellow-600/10 border border-yellow-400/30 rounded-xl p-4">
                  <h4 className="text-sm font-medium text-yellow-400 mb-3 flex items-center gap-2">
                    <Wallet className="w-4 h-4" />
                    Your Contribution
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-900/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-green-400 mb-1">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-xs uppercase tracking-wide">Deposited</span>
                      </div>
                      <p className="text-lg font-bold text-white">
                        {formatCurrency(summary.total_deposits)}
                      </p>
                    </div>
                    <div className="bg-gray-900/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-red-400 mb-1">
                        <TrendingDown className="w-4 h-4" />
                        <span className="text-xs uppercase tracking-wide">Withdrawn</span>
                      </div>
                      <p className="text-lg font-bold text-white">
                        {formatCurrency(summary.total_withdrawals)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-yellow-400/20">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Net Contribution</span>
                      <span className={`text-lg font-bold ${
                        summary.net_contribution >= 0 
                          ? "text-green-400" 
                          : "text-red-400"
                      }`}>
                        {formatCurrency(summary.net_contribution)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Transaction History */}
                <div className="bg-gray-800 rounded-xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-700 flex items-center gap-2">
                    <History className="w-4 h-4 text-gray-400" />
                    <h4 className="text-sm font-medium text-white">Your Transaction History</h4>
                    <span className="ml-auto text-xs text-gray-500">{ledger.length} transactions</span>
                  </div>
                  
                  {ledger.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <p className="text-gray-500 text-sm">No transactions yet</p>
                    </div>
                  ) : (
                    <div className="max-h-64 overflow-y-auto">
                      {ledger.map((item: ProfileLedgerItem) => (
                        <div 
                          key={item.id} 
                          className="px-4 py-3 border-b border-gray-700/50 last:border-0 hover:bg-gray-700/30 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-sm font-medium ${
                              item.type === "deposit" ? "text-green-400" : "text-red-400"
                            }`}>
                              {item.type === "deposit" ? "+" : "-"}{formatCurrency(parseFloat(item.amount))}
                            </span>
                            <span className="text-xs text-gray-500">{formatDate(item.created_at)}</span>
                          </div>
                          {item.note && (
                            <p className="text-xs text-gray-400 truncate">{item.note}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            Recorded by: {item.recorded_by_name}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Info Cards */}
                <div className="space-y-3">
                  <div className="bg-gray-800 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                        <Mail className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                        <p className="text-white font-medium">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  {user.created_at && (
                    <div className="bg-gray-800 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Member Since</p>
                          <p className="text-white font-medium">
                            {new Date(user.created_at).toLocaleDateString("en-IN", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  )
}
