"use client"

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { Plus, Minus, ChevronDown } from "lucide-react"
import type { CreateTransactionData, User } from "@/lib/api"

interface TransactionFormProps {
  onSubmit: (data: CreateTransactionData) => Promise<void>
  isSubmitting?: boolean
  members: User[]
}

export function TransactionForm({ onSubmit, isSubmitting = false, members }: TransactionFormProps) {
  const { isAdmin, user } = useAuth()
  const [selectedUserId, setSelectedUserId] = useState<number | "">("")
  const [amount, setAmount] = useState("")
  const [type, setType] = useState<"deposit" | "withdrawal">("deposit")
  const [note, setNote] = useState("")
  const [error, setError] = useState("")

  // Only render if user is admin
  if (!isAdmin) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    const parsedAmount = parseFloat(amount)
    
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid amount")
      return
    }

    try {
      await onSubmit({
        amount: parsedAmount,
        type,
        user_id: selectedUserId ? Number(selectedUserId) : undefined,
        note: note.trim() || undefined,
      })
      // Reset form on success
      setSelectedUserId("")
      setAmount("")
      setNote("")
      setType("deposit")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to add transaction"
      setError(message)
    }
  }

  return (
    <div className="glass-card rounded-2xl p-6 animate-fade-in-up">
      <h2 className="text-base font-semibold gradient-text-white mb-5 tracking-tight">Add Transaction</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="glass-card-light rounded-xl px-4 py-3 border-red-500/20 animate-scale-in" role="alert">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div>
          <label htmlFor="member" className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
            Member <span className="normal-case text-slate-500">(Optional)</span>
          </label>
          <div className="relative">
            <select
              id="member"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value ? Number(e.target.value) : "")}
              disabled={isSubmitting}
              className="w-full glass-input rounded-xl px-4 py-3 text-white appearance-none focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select member (defaults to {user?.name || "you"})</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.email})
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label htmlFor="amount" className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
            Amount <span className="normal-case text-slate-500">(INR)</span>
          </label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            min="1"
            step="0.01"
            disabled={isSubmitting}
            className="w-full glass-input rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Type</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setType("deposit")}
              disabled={isSubmitting}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
                type === "deposit"
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                  : "glass-input text-slate-400 hover:text-slate-300 hover:border-slate-600"
              }`}
            >
              <Plus className="w-4 h-4" />
              Deposit
            </button>
            <button
              type="button"
              onClick={() => setType("withdrawal")}
              disabled={isSubmitting}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
                type === "withdrawal"
                  ? "bg-red-500/15 text-red-400 border border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                  : "glass-input text-slate-400 hover:text-slate-300 hover:border-slate-600"
              }`}
            >
              <Minus className="w-4 h-4" />
              Withdrawal
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="note" className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
            Note <span className="normal-case text-slate-500">(Optional)</span>
          </label>
          <input
            id="note"
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note..."
            disabled={isSubmitting}
            maxLength={200}
            className="w-full glass-input rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn-accent py-3.5 rounded-xl flex items-center justify-center gap-2 mt-2 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <span className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
              Adding...
            </>
          ) : (
            "Add Transaction"
          )}
        </button>
      </form>
    </div>
  )
}
