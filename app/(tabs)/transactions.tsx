import TransactionForm from '@/src/components/transaction-form'
import TransactionItem from '@/src/components/transaction-item'
import { COLORS, GLOBAL_STYLES } from '@/src/constants/theme'
import { useAppContext } from '@/src/context/app-context'
import { Transaction, TransactionType } from '@/src/types'
import { Ionicons } from '@expo/vector-icons'
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet'
import React, { useCallback, useRef, useState } from 'react'
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type FilterType = 'all' | TransactionType

export default function TransactionsScreen() {
  const { transactions, addTransaction, editTransaction, deleteTransaction, theme } =
    useAppContext()
  const [filter, setFilter] = useState<FilterType>('all')
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | undefined>(undefined)

  const bottomSheetRef = useRef<BottomSheet>(null)

  const handleSaveTransaction = async (data: any) => {
    if (selectedTransaction) {
      await editTransaction(data)
    } else {
      await addTransaction(data)
    }
    bottomSheetRef.current?.close()
    setSelectedTransaction(undefined)
  }

  const handleDeleteTransaction = async (id: string) => {
    await deleteTransaction(id)
    bottomSheetRef.current?.close()
    setSelectedTransaction(undefined)
  }

  const openAddModal = () => {
    setSelectedTransaction(undefined)
    bottomSheetRef.current?.expand()
  }

  const openEditModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    bottomSheetRef.current?.expand()
  }

  const handleSheetClose = useCallback(() => {
    setSelectedTransaction(undefined)
  }, [])

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
    ),
    []
  )

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
    <View style={[GLOBAL_STYLES.container, { backgroundColor: theme.background }]}>
      <FlatList
        key="transactions-list"
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TransactionItem key={item.id} transaction={item} onPress={() => openEditModal(item)} />
        )}
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <Text style={[GLOBAL_STYLES.title, { color: theme.text }]}>Transactions</Text>
            </View>

            <View style={styles.filterContainer}>
              <FilterButton key="filter-all" type="all" label="All" />
              <FilterButton key="filter-expense" type="expense" label="Expenses" />
              <FilterButton key="filter-earning" type="earning" label="Income" />
            </View>
          </View>
        }
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

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        enablePanDownToClose
        enableDynamicSizing={true}
        backdropComponent={renderBackdrop}
        onClose={handleSheetClose}
        backgroundStyle={{ backgroundColor: theme.background }}
        handleIndicatorStyle={{ backgroundColor: theme.textSecondary }}
      >
        <BottomSheetView>
          <TransactionForm
            initialTransaction={selectedTransaction}
            onSubmit={handleSaveTransaction}
            onDelete={selectedTransaction ? handleDeleteTransaction : undefined}
            onCancel={() => bottomSheetRef.current?.close()}
          />
        </BottomSheetView>
      </BottomSheet>
    </View>
  )
}

const styles = StyleSheet.create({
  header: { paddingTop: 60, paddingBottom: 10 },
  filterContainer: { flexDirection: 'row', marginBottom: 15, gap: 10 },
  filterButton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1 },
  filterText: { fontWeight: '600' },
  listContent: { paddingHorizontal: 20 },
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
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  }
})
