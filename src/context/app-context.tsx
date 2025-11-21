import { THEMES } from '@/src/constants/theme'
import { StorageService } from '@/src/services/storage'
import { AppSettings, Transaction } from '@/src/types'
import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react'

interface AppContextType {
  isLoading: boolean
  totalIncome: number
  totalBalance: number
  spendingTrend: number
  totalExpenses: number
  weeklySpending: number
  budgetProgress: number
  monthlyExpenses: number
  remainingBudget: number
  lastWeekSpending: number
  settings: AppSettings
  theme: typeof THEMES.dark
  transactions: Transaction[]
  deleteTransaction: (id: string) => Promise<void>
  editTransaction: (transaction: Transaction) => Promise<void>
  updateSettings: (newSettings: Partial<AppSettings>) => Promise<void>
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider = ({ children }: PropsWithChildren) => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'dark',
    budget: { limit: 0, currency: 'F CFA' }
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    const [loadedTransactions, loadedSettings] = await Promise.all([
      StorageService.getTransactions(),
      StorageService.getSettings()
    ])
    setTransactions(loadedTransactions)
    setSettings(loadedSettings)
    setIsLoading(false)
  }

  const addTransaction = async (newTransactionData: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = { id: Date.now().toString(), ...newTransactionData }
    const updatedTransactions = [newTransaction, ...transactions]
    setTransactions(updatedTransactions)
    await StorageService.saveTransactions(updatedTransactions)
  }

  const editTransaction = async (updatedTransaction: Transaction) => {
    const updatedTransactions = transactions.map((t) =>
      t.id === updatedTransaction.id ? updatedTransaction : t
    )
    setTransactions(updatedTransactions)
    await StorageService.saveTransactions(updatedTransactions)
  }

  const deleteTransaction = async (id: string) => {
    const updatedTransactions = transactions.filter((t) => t.id !== id)
    setTransactions(updatedTransactions)
    await StorageService.saveTransactions(updatedTransactions)
  }

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    const updatedSettings = { ...settings, ...newSettings }
    setSettings(updatedSettings)
    await StorageService.saveSettings(updatedSettings)
  }

  const totalIncome = transactions
    .filter((t) => t.type === 'earning')
    .reduce((acc, curr) => acc + curr.amount, 0)

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0)

  const totalBalance = totalIncome - totalExpenses

  // Calculate Weekly Spending
  const now = new Date()
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
  startOfWeek.setHours(0, 0, 0, 0)

  const startOfLastWeek = new Date(startOfWeek)
  startOfLastWeek.setDate(startOfLastWeek.getDate() - 7)

  const endOfLastWeek = new Date(startOfWeek)
  endOfLastWeek.setMilliseconds(-1)

  const weeklySpending = transactions
    .filter((t) => t.type === 'expense' && new Date(t.date) >= startOfWeek)
    .reduce((acc, curr) => acc + curr.amount, 0)

  const lastWeekSpending = transactions
    .filter(
      (t) =>
        t.type === 'expense' &&
        new Date(t.date) >= startOfLastWeek &&
        new Date(t.date) < startOfWeek
    )
    .reduce((acc, curr) => acc + curr.amount, 0)

  let spendingTrend = 0
  if (lastWeekSpending > 0) {
    spendingTrend = ((weeklySpending - lastWeekSpending) / lastWeekSpending) * 100
  } else if (weeklySpending > 0) {
    spendingTrend = 100 // If last week was 0 and this week is > 0, it's a 100% increase (or infinite, but 100 is safer for UI)
  }

  // Calculate monthly expenses (current month only)
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const monthlyExpenses = transactions
    .filter((t) => {
      if (t.type !== 'expense') return false
      const transactionDate = new Date(t.date)
      return (
        transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear
      )
    })
    .reduce((sum, t) => sum + t.amount, 0)

  const budgetLimit = settings.budget.limit
  const budgetProgress = budgetLimit > 0 ? (monthlyExpenses / budgetLimit) * 100 : 0
  const remainingBudget = budgetLimit - monthlyExpenses

  const theme = settings.theme === 'light' ? THEMES.light : THEMES.dark

  return (
    <AppContext.Provider
      value={{
        transactions,
        settings,
        theme,
        addTransaction,
        editTransaction,
        deleteTransaction,
        updateSettings,
        isLoading,
        totalBalance,
        totalExpenses,
        totalIncome,
        weeklySpending,
        lastWeekSpending,
        spendingTrend,
        monthlyExpenses,
        budgetProgress,
        remainingBudget
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}
