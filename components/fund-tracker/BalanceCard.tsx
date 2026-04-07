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
    <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-3xl p-6 shadow-lg shadow-yellow-400/20">
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-900 font-medium">Total Group Fund</p>
        <div className="w-10 h-10 bg-gray-900/10 rounded-xl flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-gray-900" />
        </div>
      </div>

      <p className="text-4xl font-bold text-gray-900 mb-6">{formatCurrency(balance)}</p>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-gray-900/80">
          <div className="w-8 h-8 bg-green-600/20 rounded-lg flex items-center justify-center">
            <ArrowDownLeft className="w-4 h-4 text-green-800" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-900/60">Deposits</p>
            <p className="text-sm font-semibold text-gray-900">{formatCurrency(totalDeposits)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-900/80">
          <div className="w-8 h-8 bg-red-600/20 rounded-lg flex items-center justify-center">
            <ArrowUpRight className="w-4 h-4 text-red-800" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-900/60">Withdrawals</p>
            <p className="text-sm font-semibold text-gray-900">{formatCurrency(totalWithdrawals)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
