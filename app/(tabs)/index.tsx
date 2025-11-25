import { SpendingCard } from '@/src/components/spending-card'
import TransactionForm from '@/src/components/transaction-form'
import TransactionItem from '@/src/components/transaction-item'
import { GLOBAL_STYLES } from '@/src/constants/theme'
import { useAppContext } from '@/src/context/app-context'
import { Transaction, TransactionType } from '@/src/types'
import { formatCurrency } from '@/src/utils/currency'
import { Ionicons } from '@expo/vector-icons'
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet'
import { useRouter } from 'expo-router'
import React, { useCallback, useRef, useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function HomeScreen() {
  const router = useRouter()
  const {
    transactions,
    totalBalance,
    weeklySpending,
    spendingTrend,
    addTransaction,
    editTransaction,
    deleteTransaction,
    theme
  } = useAppContext()
  const [initialType, setInitialType] = useState<TransactionType>('expense')
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | undefined>(undefined)

  const bottomSheetRef = useRef<BottomSheet>(null)

  // Get last 5 transactions
  const recentTransactions = transactions.slice(0, 5)

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

  const openTransactionForm = (type: TransactionType) => {
    setInitialType(type)
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

  return (
    <SafeAreaView style={[GLOBAL_STYLES.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <View>
          <Text style={[styles.greeting, { color: theme.textSecondary }]}>Welcome back</Text>
          <Text style={[GLOBAL_STYLES.title, { color: theme.text }]}>Godwin</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={[styles.iconButton, { backgroundColor: theme.card }]}>
            <Ionicons name="notifications-outline" size={24} color={theme.icon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: theme.card }]}
            onPress={() => router.push('/settings')}
          >
            <Ionicons name="menu-outline" size={24} color={theme.icon} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <SpendingCard
          totalBalance={totalBalance}
          weeklySpending={weeklySpending}
          spendingTrend={spendingTrend}
          cardNumber="7321"
          onReceivePress={() => openTransactionForm('earning')}
          onSendPress={() => openTransactionForm('expense')}
        />

        <View style={styles.row}>
          <BudgetTargetCard />
          <View style={[styles.smallCard, { backgroundColor: theme.primary }]}>
            <View style={GLOBAL_STYLES.row}>
              <Text style={{ fontWeight: 'bold', color: theme.black }}>Th</Text>
              <Text
                style={{
                  fontWeight: 'bold',
                  marginLeft: 'auto',
                  textDecorationLine: 'underline',
                  color: theme.black
                }}
              >
                ENTER
              </Text>
            </View>

            <Text style={[styles.smallCardTitle, { color: theme.black, marginTop: 'auto' }]}>
              Thara advisor mode...
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={GLOBAL_STYLES.row}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Last Transactions</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/transactions')}>
              <Text style={[styles.link, { color: theme.primary }]}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.list}>
            {recentTransactions.length > 0 ? (
              recentTransactions.map((t) => (
                <TransactionItem key={t.id} transaction={t} onPress={() => openEditModal(t)} />
              ))
            ) : (
              <Text style={{ color: theme.textSecondary, marginTop: 10 }}>
                No transactions yet.
              </Text>
            )}
          </View>
        </View>
      </ScrollView>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        enablePanDownToClose
        enableDynamicSizing={true}
        backdropComponent={renderBackdrop}
        onClose={handleSheetClose}
        backgroundStyle={{ backgroundColor: theme.background }}
        handleIndicatorStyle={{ backgroundColor: theme.textSecondary }}
        keyboardBehavior="fillParent"
      >
        <BottomSheetView>
          <TransactionForm
            initialType={initialType}
            initialTransaction={selectedTransaction}
            onSubmit={handleSaveTransaction}
            onDelete={selectedTransaction ? handleDeleteTransaction : undefined}
            onCancel={() => bottomSheetRef.current?.close()}
          />
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  )
}

const BudgetTargetCard = () => {
  const { budgetProgress, remainingBudget, settings, theme } = useAppContext()

  const getProgressColor = () => {
    if (budgetProgress < 70) return theme.success
    if (budgetProgress < 90) return '#FFD60A'
    return theme.danger
  }

  const getMessage = () => {
    if (budgetProgress < 70) return "You're on track!"
    if (budgetProgress < 90) return 'Approaching limit'
    if (budgetProgress < 100) return 'Almost at budget'
    return 'Over budget!'
  }

  const progressWidth = Math.min(budgetProgress, 100)

  return (
    <View style={[styles.smallCard, { backgroundColor: theme.card, gap: 4 }]}>
      <Ionicons name="wallet-outline" size={20} color={theme.textSecondary} />

      <View style={{ gap: 2 }}>
        <Text style={[styles.budgetTitle, { color: theme.text }]}>{getMessage()}</Text>
        <Text style={[styles.budgetAmount, { color: theme.textSecondary }]}>
          {formatCurrency(remainingBudget)} left
        </Text>
      </View>

      <View style={{ gap: 4 }}>
        <View style={[styles.progressBar, { backgroundColor: theme.progressBarBackground }]}>
          <View
            style={{
              height: '100%',
              borderRadius: 0,
              width: `${progressWidth}%`,
              backgroundColor: getProgressColor()
            }}
          />
        </View>
        <Text style={[styles.budgetPercentage, { color: theme.textSecondary }]}>
          {budgetProgress.toFixed(0)}% of {formatCurrency(settings.budget.limit)}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15
  },
  scrollContent: { padding: 20 },
  greeting: { fontSize: 16 },
  headerActions: { flexDirection: 'row', gap: 10 },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  row: { flexDirection: 'row', marginVertical: 20, gap: 10 },
  smallCard: {
    flex: 1,
    height: 150,
    borderRadius: 20,
    padding: 15,
    justifyContent: 'space-between'
  },
  smallCardTitle: { fontSize: 16, fontWeight: 'bold' },
  progressBar: { height: 16, borderRadius: 0, overflow: 'hidden' },
  section: { marginTop: 10 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', flex: 1 },
  link: { fontWeight: 'bold' },
  list: { marginTop: 10 },
  budgetTitle: { fontSize: 13, fontWeight: 'bold' },
  budgetAmount: { fontSize: 11 },
  budgetPercentage: { fontSize: 11 }
})
