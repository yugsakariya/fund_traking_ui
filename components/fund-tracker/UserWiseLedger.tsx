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
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[80vh] z-50 flex flex-col overflow-hidden animate-scale-in">
        <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-white/[0.06] rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-400/10 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold gradient-text-white">User-wise Ledger</h2>
                <p className="text-[11px] text-slate-500">{members.length} members</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 glass-card-light rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-white/10 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 premium-scrollbar">
            {userSummaries.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                <p className="text-slate-500">No members found</p>
              </div>
            ) : (
              <div className="space-y-3 stagger-children">
                {userSummaries.map((summary) => (
                  <div 
                    key={summary.user.id}
                    className="glass-card rounded-xl overflow-hidden animate-fade-in-up"
                  >
                    {/* User Summary Header */}
                    <button
                      onClick={() => toggleExpanded(summary.user.id)}
                      className="w-full px-4 py-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors cursor-pointer"
                    >
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/10">
                          <span className="text-lg font-bold text-slate-900">
                            {summary.user.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      
                      {/* Name & Role */}
                      <div className="flex-1 text-left">
                        <p className="font-medium text-white text-sm">{summary.user.name}</p>
                        <p className="text-[11px] text-slate-500">{summary.transactions.length} transactions</p>
                      </div>
                      
                      {/* Summary Stats */}
                      <div className="flex items-center gap-4 text-right">
                        <div className="hidden sm:block">
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Deposits</p>
                          <p className="text-sm font-medium text-emerald-400">
                            {formatCurrency(summary.totalDeposits)}
                          </p>
                        </div>
                        <div className="hidden sm:block">
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Withdrawals</p>
                          <p className="text-sm font-medium text-red-400">
                            {formatCurrency(summary.totalWithdrawals)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Net</p>
                          <p className={`text-sm font-bold ${
                            summary.netContribution >= 0 ? "text-emerald-400" : "text-red-400"
                          }`}>
                            {formatCurrency(summary.netContribution)}
                          </p>
                        </div>
                        
                        {/* Expand Icon */}
                        {summary.transactions.length > 0 && (
                          <div className="text-slate-500">
                            {expandedUser === summary.user.id ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </div>
                        )}
                      </div>
                    </button>
                    
                    {/* Expanded Transaction List */}
                    {expandedUser === summary.user.id && summary.transactions.length > 0 && (
                      <div className="border-t border-white/[0.06] animate-fade-in">
                        {/* Mobile Stats */}
                        <div className="sm:hidden px-4 py-3 grid grid-cols-2 gap-3 bg-slate-900/50">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-sm text-emerald-400">{formatCurrency(summary.totalDeposits)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                            <span className="text-sm text-red-400">{formatCurrency(summary.totalWithdrawals)}</span>
                          </div>
                        </div>
                        
                        {/* Transaction Table */}
                        <div className="max-h-48 overflow-y-auto premium-scrollbar">
                          <table className="w-full text-sm">
                            <thead className="bg-slate-900/70 sticky top-0">
                              <tr className="text-slate-500 text-[10px] uppercase tracking-wider">
                                <th className="px-4 py-2 text-left font-medium">Date</th>
                                <th className="px-4 py-2 text-left font-medium">Type</th>
                                <th className="px-4 py-2 text-right font-medium">Amount</th>
                                <th className="px-4 py-2 text-left hidden sm:table-cell font-medium">Note</th>
                              </tr>
                            </thead>
                            <tbody>
                              {summary.transactions.map((tx) => (
                                <tr key={tx.id} className="border-t border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                  <td className="px-4 py-2.5 text-slate-400 whitespace-nowrap text-xs">
                                    {formatDate(tx.created_at)}
                                  </td>
                                  <td className="px-4 py-2.5">
                                    <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                                      tx.type === "deposit" ? "text-emerald-400" : "text-red-400"
                                    }`}>
                                      {tx.type === "deposit" ? (
                                        <TrendingUp className="w-3 h-3" />
                                      ) : (
                                        <TrendingDown className="w-3 h-3" />
                                      )}
                                      {tx.type}
                                    </span>
                                  </td>
                                  <td className={`px-4 py-2.5 text-right font-medium text-xs ${
                                    tx.type === "deposit" ? "text-emerald-400" : "text-red-400"
                                  }`}>
                                    {tx.type === "deposit" ? "+" : "-"}{formatCurrency(parseFloat(tx.amount))}
                                  </td>
                                  <td className="px-4 py-2.5 text-slate-500 truncate max-w-[150px] hidden sm:table-cell text-xs">
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
      </div>
    </>
  )
}