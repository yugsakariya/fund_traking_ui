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
    <div className="bg-gray-800 rounded-3xl p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Add Transaction</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-xl px-4 py-3 text-red-400 text-sm" role="alert">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="member" className="block text-sm font-medium text-gray-400 mb-2">
            Member (Optional - defaults to you)
          </label>
          <div className="relative">
            <select
              id="member"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value ? Number(e.target.value) : "")}
              disabled={isSubmitting}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select member (defaults to {user?.name || "you"})</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.email})
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-400 mb-2">
            Amount (INR)
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
            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Type</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setType("deposit")}
              disabled={isSubmitting}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                type === "deposit"
                  ? "bg-green-500/20 text-green-400 border-2 border-green-500"
                  : "bg-gray-900 text-gray-400 border border-gray-700 hover:border-gray-600"
              }`}
            >
              <Plus className="w-4 h-4" />
              Deposit
            </button>
            <button
              type="button"
              onClick={() => setType("withdrawal")}
              disabled={isSubmitting}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                type === "withdrawal"
                  ? "bg-red-500/20 text-red-400 border-2 border-red-500"
                  : "bg-gray-900 text-gray-400 border border-gray-700 hover:border-gray-600"
              }`}
            >
              <Minus className="w-4 h-4" />
              Withdrawal
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="note" className="block text-sm font-medium text-gray-400 mb-2">
            Note (Optional)
          </label>
          <input
            id="note"
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note..."
            disabled={isSubmitting}
            maxLength={200}
            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-400/50 disabled:cursor-not-allowed text-gray-900 font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <span className="w-5 h-5 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
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
