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

    return type === "deposit" ? `+ INR ${formatted}` : `- INR ${formatted}`
  }

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-3xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Transaction History</h2>
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="w-6 h-6 text-yellow-400 animate-spin" />
        </div>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-gray-800 rounded-3xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Transaction History</h2>
        <div className="text-center py-8">
          <p className="text-gray-400">No transactions yet</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-3xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Transaction History</h2>
        <span className="text-sm text-gray-400">{transactions.length} transactions</span>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="bg-gray-900 rounded-2xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  transaction.type === "deposit"
                    ? "bg-green-500/20"
                    : "bg-red-500/20"
                }`}
              >
                {transaction.type === "deposit" ? (
                  <ArrowDownLeft className="w-5 h-5 text-green-400" />
                ) : (
                  <ArrowUpRight className="w-5 h-5 text-red-400" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-white truncate">{transaction.user_name}</p>
                <p className="text-sm text-gray-400 truncate">
                  {transaction.note || `Recorded by ${transaction.recorder_name}`}
                </p>
              </div>
            </div>

            <div className="text-right flex-shrink-0 ml-3">
              <p
                className={`font-semibold ${
                  transaction.type === "deposit" ? "text-green-400" : "text-red-400"
                }`}
              >
                {formatAmount(transaction.amount, transaction.type)}
              </p>
              <p className="text-xs text-gray-500">{formatDate(transaction.created_at)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
