import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import TransactionForm from '../../src/components/transaction-form'
import TransactionItem from '../../src/components/transaction-item'
import { GLOBAL_STYLES } from '../../src/constants/theme'
import { useAppContext } from '../../src/context/app-context'
import { Transaction, TransactionType } from '../../src/types'

type FilterType = 'all' | TransactionType

export default function TransactionsScreen() {
  const { transactions, addTransaction, editTransaction, deleteTransaction, theme } =
    useAppContext()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [filter, setFilter] = useState<FilterType>('all')
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | undefined>(undefined)

  const handleSaveTransaction = async (data: any) => {
    if (selectedTransaction) {
      await editTransaction(data)
    } else {
      await addTransaction(data)
    }
    setIsModalVisible(false)
    setSelectedTransaction(undefined)
  }

  const handleDeleteTransaction = async (id: string) => {
    await deleteTransaction(id)
    setIsModalVisible(false)
    setSelectedTransaction(undefined)
  }

  const openAddModal = () => {
    setSelectedTransaction(undefined)
    setIsModalVisible(true)
  }

  const openEditModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setIsModalVisible(true)
  }

  const filteredTransactions = transactions.filter((t) => {
    if (filter === 'all') return true
    return t.type === filter
  })

  const FilterButton = ({ type, label }: { type: FilterType; label: string }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        { backgroundColor: theme.card, borderColor: theme.border },
        filter === type && { backgroundColor: theme.primary, borderColor: theme.primary }
      ]}
      onPress={() => setFilter(type)}
    >
      <Text
        style={[
          styles.filterText,
          { color: theme.text },
          filter === type && { color: theme.black }
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={[GLOBAL_STYLES.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[GLOBAL_STYLES.title, { color: theme.text }]}>Transactions</Text>
      </View>

      <View style={styles.filterContainer}>
        <FilterButton type="all" label="All" />
        <FilterButton type="expense" label="Expenses" />
        <FilterButton type="earning" label="Income" />
      </View>

      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TransactionItem key={item.id} transaction={item} onPress={() => openEditModal(item)} />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            No transactions found.
          </Text>
        }
      />

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.primary }]}
        onPress={openAddModal}
      >
        <Ionicons name="add" size={30} color={theme.black} />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View>
            <TransactionForm
              initialTransaction={selectedTransaction}
              onSubmit={handleSaveTransaction}
              onDelete={selectedTransaction ? handleDeleteTransaction : undefined}
              onCancel={() => setIsModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingBottom: 10 },
  filterContainer: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 15, gap: 10 },
  filterButton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1 },
  filterText: { fontWeight: '600' },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100 // Space for FAB
  },
  emptyText: { textAlign: 'center', marginTop: 50 },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }
})
