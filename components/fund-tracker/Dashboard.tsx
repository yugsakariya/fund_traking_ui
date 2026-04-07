"use client"

import { useState, useCallback } from "react"
import useSWR from "swr"
import { Header } from "./Header"
import { BalanceCard } from "./BalanceCard"
import { TransactionForm } from "./TransactionForm"
import { TransactionTable } from "./TransactionTable"
import { UserWiseLedger } from "./UserWiseLedger"
import { fundApi, membersApi, type CreateTransactionData } from "@/lib/api"
import { RefreshCw, Users } from "lucide-react"

export function Dashboard() {
  const [isAddingTransaction, setIsAddingTransaction] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showUserWiseLedger, setShowUserWiseLedger] = useState(false)

  // Fetch balance
  const { 
    data: balanceData, 
    error: balanceError,
    isLoading: balanceLoading,
    mutate: mutateBalance 
  } = useSWR("fund-balance", () => fundApi.getBalance())

  // Fetch ledger (transactions)
  const { 
    data: ledgerData, 
    error: ledgerError,
    isLoading: ledgerLoading,
    mutate: mutateLedger 
  } = useSWR("fund-ledger", () => fundApi.getLedger())

  // Fetch members for the transaction form dropdown
  const { 
    data: membersData,
    error: membersError,
    isLoading: membersLoading,
  } = useSWR("members", () => membersApi.getAll())

  const isLoading = balanceLoading || ledgerLoading || membersLoading
  const hasError = balanceError || ledgerError || membersError

  const handleAddTransaction = useCallback(async (data: CreateTransactionData) => {
    setIsAddingTransaction(true)
    setError(null)
    
    try {
      await fundApi.addTransaction(data)
      // Refresh both balance and ledger
      await Promise.all([mutateBalance(), mutateLedger()])
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to add transaction"
      setError(message)
      throw err
    } finally {
      setIsAddingTransaction(false)
    }
  }, [mutateBalance, mutateLedger])

  const handleRefresh = useCallback(async () => {
    setError(null)
    await Promise.all([mutateBalance(), mutateLedger()])
  }, [mutateBalance, mutateLedger])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-yellow-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {(hasError || error) && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-xl px-4 py-3">
            <div className="flex items-center justify-between">
              <p className="text-red-400 text-sm">
                {error || "Failed to load data. Please try again."}
              </p>
              <button 
                onClick={handleRefresh}
                className="text-red-400 hover:text-red-300 transition-colors"
                aria-label="Retry"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <BalanceCard 
          balance={balanceData?.balance ?? 0}
          totalDeposits={balanceData?.total_deposits ?? 0}
          totalWithdrawals={balanceData?.total_withdrawals ?? 0}
        />

        {/* User-wise Ledger Button */}
        <button
          onClick={() => setShowUserWiseLedger(true)}
          className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-xl transition-colors border border-gray-700"
        >
          <Users className="w-5 h-5 text-yellow-400" />
          View User-wise Ledger
        </button>
        
        <TransactionForm 
          onSubmit={handleAddTransaction} 
          isSubmitting={isAddingTransaction}
          members={membersData?.users ?? []}
        />
        
        <TransactionTable 
          transactions={ledgerData?.transactions ?? []} 
          isLoading={ledgerLoading}
        />
      </main>

      {/* User-wise Ledger Modal */}
      <UserWiseLedger
        isOpen={showUserWiseLedger}
        onClose={() => setShowUserWiseLedger(false)}
        transactions={ledgerData?.transactions ?? []}
        members={membersData?.users ?? []}
      />
    </div>
  )
}
