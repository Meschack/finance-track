import AsyncStorage from '@react-native-async-storage/async-storage'
import { AppSettings, Transaction } from '../types'

const KEYS = { TRANSACTIONS: '@transactions', SETTINGS: '@settings' }

const DEFAULT_SETTINGS: AppSettings = { theme: 'dark', budget: { limit: 5000, currency: 'F CFA' } }

export const StorageService = {
  async getTransactions(): Promise<Transaction[]> {
    try {
      const json = await AsyncStorage.getItem(KEYS.TRANSACTIONS)
      return json ? JSON.parse(json) : []
    } catch (e) {
      console.error('Failed to load transactions', e)
      return []
    }
  },

  async saveTransactions(transactions: Transaction[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(transactions))
    } catch (e) {
      console.error('Failed to save transactions', e)
    }
  },

  async getSettings(): Promise<AppSettings> {
    try {
      const json = await AsyncStorage.getItem(KEYS.SETTINGS)
      return json ? { ...DEFAULT_SETTINGS, ...JSON.parse(json) } : DEFAULT_SETTINGS
    } catch (e) {
      console.error('Failed to load settings', e)
      return DEFAULT_SETTINGS
    }
  },

  async saveSettings(settings: AppSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings))
    } catch (e) {
      console.error('Failed to save settings', e)
    }
  },

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear()
    } catch (e) {
      console.error('Failed to clear storage', e)
    }
  }
}
