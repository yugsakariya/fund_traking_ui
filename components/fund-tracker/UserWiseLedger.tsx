"use client"

import { useState } from "react"
import { X, Users, TrendingUp, TrendingDown, ChevronDown, ChevronUp } from "lucide-react"
import { type Transaction, type User } from "@/lib/api"

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

interface UserLedgerSummary {
  user: User
  transactions: Transaction[]
  totalDeposits: number
  totalWithdrawals: number
  netContribution: number
}

interface UserWiseLedgerProps {
  isOpen: boolean
  onClose: () => void
  transactions: Transaction[]
  members: User[]
}

export function UserWiseLedger({ isOpen, onClose, transactions, members }: UserWiseLedgerProps) {
  const [expandedUser, setExpandedUser] = useState<number | null>(null)

  if (!isOpen) return null

  // Group transactions by user and calculate summaries
  const userSummaries: UserLedgerSummary[] = members.map((member) => {
    const userTransactions = transactions.filter((t) => t.user_id === member.id)
    const totalDeposits = userTransactions
      .filter((t) => t.type === "deposit")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0)
    const totalWithdrawals = userTransactions
      .filter((t) => t.type === "withdrawal")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0)

    return {
      user: member,
      transactions: userTransactions,
      totalDeposits,
      totalWithdrawals,
      netContribution: totalDeposits - totalWithdrawals,
    }
  }).sort((a, b) => b.netContribution - a.netContribution) // Sort by highest contribution

  const toggleExpanded = (userId: number) => {
    setExpandedUser(expandedUser === userId ? null : userId)
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[80vh] bg-gray-900 border border-gray-800 rounded-2xl z-50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400/20 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">User-wise Ledger</h2>
              <p className="text-xs text-gray-500">{members.length} members</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {userSummaries.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500">No members found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {userSummaries.map((summary) => (
                <div 
                  key={summary.user.id}
                  className="bg-gray-800 rounded-xl overflow-hidden"
                >
                  {/* User Summary Header */}
                  <button
                    onClick={() => toggleExpanded(summary.user.id)}
                    className="w-full px-4 py-4 flex items-center gap-4 hover:bg-gray-700/50 transition-colors"
                  >
                    {/* Avatar */}
                    <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-gray-900">
                        {summary.user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    
                    {/* Name & Role */}
                    <div className="flex-1 text-left">
                      <p className="font-medium text-white">{summary.user.name}</p>
                      <p className="text-xs text-gray-500">{summary.transactions.length} transactions</p>
                    </div>
                    
                    {/* Summary Stats */}
                    <div className="flex items-center gap-4 text-right">
                      <div className="hidden sm:block">
                        <p className="text-xs text-gray-500">Deposits</p>
                        <p className="text-sm font-medium text-green-400">
                          {formatCurrency(summary.totalDeposits)}
                        </p>
                      </div>
                      <div className="hidden sm:block">
                        <p className="text-xs text-gray-500">Withdrawals</p>
                        <p className="text-sm font-medium text-red-400">
                          {formatCurrency(summary.totalWithdrawals)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Net</p>
                        <p className={`text-sm font-bold ${
                          summary.netContribution >= 0 ? "text-green-400" : "text-red-400"
                        }`}>
                          {formatCurrency(summary.netContribution)}
                        </p>
                      </div>
                      
                      {/* Expand Icon */}
                      {summary.transactions.length > 0 && (
                        <div className="text-gray-500">
                          {expandedUser === summary.user.id ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                  
                  {/* Expanded Transaction List */}
                  {expandedUser === summary.user.id && summary.transactions.length > 0 && (
                    <div className="border-t border-gray-700">
                      {/* Mobile Stats */}
                      <div className="sm:hidden px-4 py-3 grid grid-cols-2 gap-3 bg-gray-900/50">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-green-400" />
                          <span className="text-sm text-green-400">{formatCurrency(summary.totalDeposits)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingDown className="w-4 h-4 text-red-400" />
                          <span className="text-sm text-red-400">{formatCurrency(summary.totalWithdrawals)}</span>
                        </div>
                      </div>
                      
                      {/* Transaction Table */}
                      <div className="max-h-48 overflow-y-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-900/50 sticky top-0">
                            <tr className="text-gray-500 text-xs uppercase">
                              <th className="px-4 py-2 text-left">Date</th>
                              <th className="px-4 py-2 text-left">Type</th>
                              <th className="px-4 py-2 text-right">Amount</th>
                              <th className="px-4 py-2 text-left hidden sm:table-cell">Note</th>
                            </tr>
                          </thead>
                          <tbody>
                            {summary.transactions.map((tx) => (
                              <tr key={tx.id} className="border-t border-gray-700/50 hover:bg-gray-700/30">
                                <td className="px-4 py-2 text-gray-400 whitespace-nowrap">
                                  {formatDate(tx.created_at)}
                                </td>
                                <td className="px-4 py-2">
                                  <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                                    tx.type === "deposit" ? "text-green-400" : "text-red-400"
                                  }`}>
                                    {tx.type === "deposit" ? (
                                      <TrendingUp className="w-3 h-3" />
                                    ) : (
                                      <TrendingDown className="w-3 h-3" />
                                    )}
                                    {tx.type}
                                  </span>
                                </td>
                                <td className={`px-4 py-2 text-right font-medium ${
                                  tx.type === "deposit" ? "text-green-400" : "text-red-400"
                                }`}>
                                  {tx.type === "deposit" ? "+" : "-"}{formatCurrency(parseFloat(tx.amount))}
                                </td>
                                <td className="px-4 py-2 text-gray-500 truncate max-w-[150px] hidden sm:table-cell">
                                  {tx.note || "-"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}