"use client"

import useSWR from "swr"
import { X, Mail, Shield, Calendar, RefreshCw, Wallet, TrendingUp, TrendingDown, History } from "lucide-react"
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
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md z-50 animate-slide-in-right">
        <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-l border-white/[0.06]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
            <h2 className="text-lg font-semibold gradient-text-white">Profile</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 glass-card-light rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-white/10 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 premium-scrollbar">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="relative">
                  <div className="absolute inset-0 bg-amber-400/15 rounded-full blur-lg" />
                  <RefreshCw className="relative w-6 h-6 text-amber-400 animate-spin" />
                </div>
              </div>
            ) : error ? (
              <div className="glass-card rounded-xl px-4 py-3 border-red-500/20">
                <div className="flex items-center justify-between">
                  <p className="text-red-400 text-sm">Failed to load profile</p>
                  <button 
                    onClick={() => mutate()}
                    className="text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : user ? (
              <div className="space-y-6 stagger-children">
                {/* Avatar */}
                <div className="flex flex-col items-center animate-fade-in-up">
                  <div className="relative mb-4">
                    <div className="absolute inset-0 bg-amber-400/20 rounded-2xl blur-xl scale-110" />
                    <div className="relative w-20 h-20 bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 rounded-2xl flex items-center justify-center animate-pulse-glow">
                      <span className="text-3xl font-bold text-slate-900">
                        {user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white tracking-tight">{user.name}</h3>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 mt-2 rounded-full text-xs font-medium ${
                    user.role === "admin" 
                      ? "bg-amber-400/10 text-amber-400 border border-amber-400/20" 
                      : "bg-slate-800 text-slate-300 border border-slate-700"
                  }`}>
                    <Shield className="w-3 h-3" />
                    {user.role === "admin" ? "Administrator" : "Member"}
                  </span>
                </div>

                {/* Contribution Summary */}
                <div className="relative rounded-xl overflow-hidden animate-fade-in-up">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 to-orange-500/5" />
                  <div className="relative p-4 border border-amber-400/15 rounded-xl">
                    <h4 className="text-xs font-medium text-amber-400 mb-3 flex items-center gap-2 uppercase tracking-wider">
                      <Wallet className="w-4 h-4" />
                      Your Contribution
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="glass-card-light rounded-lg p-3">
                        <div className="flex items-center gap-2 text-emerald-400 mb-1">
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span className="text-[10px] uppercase tracking-widest">Deposited</span>
                        </div>
                        <p className="text-lg font-bold text-white">
                          {formatCurrency(summary.total_deposits)}
                        </p>
                      </div>
                      <div className="glass-card-light rounded-lg p-3">
                        <div className="flex items-center gap-2 text-red-400 mb-1">
                          <TrendingDown className="w-3.5 h-3.5" />
                          <span className="text-[10px] uppercase tracking-widest">Withdrawn</span>
                        </div>
                        <p className="text-lg font-bold text-white">
                          {formatCurrency(summary.total_withdrawals)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-amber-400/10">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400 uppercase tracking-wider">Net Contribution</span>
                        <span className={`text-lg font-bold ${
                          summary.net_contribution >= 0 
                            ? "text-emerald-400" 
                            : "text-red-400"
                        }`}>
                          {formatCurrency(summary.net_contribution)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transaction History */}
                <div className="glass-card rounded-xl overflow-hidden animate-fade-in-up">
                  <div className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-2">
                    <History className="w-4 h-4 text-slate-400" />
                    <h4 className="text-sm font-medium text-white">Your Transaction History</h4>
                    <span className="ml-auto text-[10px] text-slate-500 bg-slate-800/50 px-2 py-0.5 rounded-full">{ledger.length}</span>
                  </div>
                  
                  {ledger.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <p className="text-slate-500 text-sm">No transactions yet</p>
                    </div>
                  ) : (
                    <div className="max-h-64 overflow-y-auto premium-scrollbar">
                      {ledger.map((item: ProfileLedgerItem) => (
                        <div 
                          key={item.id} 
                          className="px-4 py-3 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-sm font-medium ${
                              item.type === "deposit" ? "text-emerald-400" : "text-red-400"
                            }`}>
                              {item.type === "deposit" ? "+" : "-"}{formatCurrency(parseFloat(item.amount))}
                            </span>
                            <span className="text-[11px] text-slate-500">{formatDate(item.created_at)}</span>
                          </div>
                          {item.note && (
                            <p className="text-xs text-slate-400 truncate">{item.note}</p>
                          )}
                          <p className="text-[11px] text-slate-500 mt-1">
                            Recorded by: {item.recorded_by_name}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Info Cards */}
                <div className="space-y-3 animate-fade-in-up">
                  <div className="glass-card rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-800/80 rounded-lg flex items-center justify-center">
                        <Mail className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">Email</p>
                        <p className="text-white font-medium text-sm">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  {user.created_at && (
                    <div className="glass-card rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-800/80 rounded-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase tracking-widest">Member Since</p>
                          <p className="text-white font-medium text-sm">
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
