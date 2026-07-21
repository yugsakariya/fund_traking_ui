"use client"

import { ArrowDownLeft, ArrowUpRight, RefreshCw } from "lucide-react"
import type { Transaction } from "@/lib/api"

interface TransactionTableProps {
  transactions: Transaction[]
  isLoading?: boolean
}

export function TransactionTable({ transactions, isLoading = false }: TransactionTableProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const formatAmount = (amount: string | number, type: "deposit" | "withdrawal") => {
    const numericAmount = typeof amount === "string" ? parseFloat(amount) : amount
    const formatted = new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(numericAmount)

    return type === "deposit" ? `+ ₹${formatted}` : `- ₹${formatted}`
  }

  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl p-6 animate-fade-in-up">
        <h2 className="text-base font-semibold gradient-text-white mb-4 tracking-tight">Transaction History</h2>
        <div className="flex items-center justify-center py-8">
          <div className="relative">
            <div className="absolute inset-0 bg-amber-400/15 rounded-full blur-lg" />
            <RefreshCw className="relative w-6 h-6 text-amber-400 animate-spin" />
          </div>
        </div>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-6 animate-fade-in-up">
        <h2 className="text-base font-semibold gradient-text-white mb-4 tracking-tight">Transaction History</h2>
        <div className="text-center py-8">
          <p className="text-slate-500 text-sm">No transactions yet</p>
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-2xl p-6 animate-fade-in-up">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold gradient-text-white tracking-tight">Transaction History</h2>
        <span className="text-xs text-slate-500 bg-slate-800/50 px-2.5 py-1 rounded-full">{transactions.length}</span>
      </div>

      <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1 premium-scrollbar">
        {transactions.map((transaction, index) => (
          <div
            key={transaction.id}
            className="glass-card-light rounded-xl p-3.5 flex items-center justify-between hover-lift cursor-default animate-fade-in-up"
            style={{ animationDelay: `${Math.min(index * 50, 400)}ms` }}
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  transaction.type === "deposit"
                    ? "bg-emerald-500/15 shadow-[0_0_10px_rgba(16,185,129,0.08)]"
                    : "bg-red-500/15 shadow-[0_0_10px_rgba(239,68,68,0.08)]"
                }`}
              >
                {transaction.type === "deposit" ? (
                  <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
                ) : (
                  <ArrowUpRight className="w-4 h-4 text-red-400" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-white text-sm truncate">{transaction.user_name}</p>
                <p className="text-xs text-slate-500 truncate">
                  {transaction.note || `Recorded by ${transaction.recorder_name}`}
                </p>
              </div>
            </div>

            <div className="text-right flex-shrink-0 ml-3">
              <p
                className={`font-semibold text-sm ${
                  transaction.type === "deposit" ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {formatAmount(transaction.amount, transaction.type)}
              </p>
              <p className="text-[11px] text-slate-500">{formatDate(transaction.created_at)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
