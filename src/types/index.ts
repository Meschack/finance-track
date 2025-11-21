export type TransactionType = 'expense' | 'earning'

export interface Transaction {
  id: string
  date: string
  amount: number
  reason: string
  secondParty: string
  type: TransactionType
}

export interface Budget {
  limit: number
  currency: string
}

export interface AppSettings {
  budget: Budget
  theme: 'dark' | 'light'
}
