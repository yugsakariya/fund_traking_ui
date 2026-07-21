"use client"

import { TrendingUp, ArrowDownLeft, ArrowUpRight } from "lucide-react"

interface BalanceCardProps {
  balance: number
  totalDeposits?: number
  totalWithdrawals?: number
}

export function BalanceCard({ balance, totalDeposits = 0, totalWithdrawals = 0 }: BalanceCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="relative rounded-3xl overflow-hidden shimmer-overlay animate-fade-in-up">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
      
      {/* Content */}
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-slate-900/80 font-medium text-sm uppercase tracking-wider">Total Group Fund</p>
          <div className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-slate-900" />
          </div>
        </div>

        <p className="text-4xl font-bold text-slate-900 mb-6 tracking-tight">{formatCurrency(balance)}</p>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <div className="w-8 h-8 bg-emerald-500/25 rounded-lg flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4 text-emerald-900" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-900/50 uppercase tracking-wide">Deposits</p>
              <p className="text-sm font-bold text-slate-900">{formatCurrency(totalDeposits)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 text-red-900" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-900/50 uppercase tracking-wide">Withdrawals</p>
              <p className="text-sm font-bold text-slate-900">{formatCurrency(totalWithdrawals)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
