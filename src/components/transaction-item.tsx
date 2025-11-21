import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useAppContext } from '../context/app-context'
import { Transaction } from '../types'
import { formatCurrency } from '../utils/currency'

interface TransactionItemProps {
  transaction: Transaction
  onPress?: () => void
}

export default function TransactionItem({ transaction, onPress }: TransactionItemProps) {
  const { theme } = useAppContext()
  const isReceive = transaction.type === 'earning'

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: isReceive ? theme.transactionItemIconBackground : theme.primary }
        ]}
      >
        <Ionicons
          name={isReceive ? 'arrow-down' : 'arrow-up'}
          size={24}
          color={isReceive ? theme.white : theme.black}
          style={{ transform: [{ rotate: isReceive ? '45deg' : '45deg' }] }}
        />
      </View>

      <View style={styles.details}>
        <Text style={[styles.reason, { color: theme.text }]}>{isReceive ? 'Receive' : 'Sent'}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={[styles.party, { color: theme.textSecondary }]}>
            {isReceive ? 'from ' : 'to '}
          </Text>
          <Text style={[styles.party, { color: theme.textSecondary, fontWeight: '700' }]}>
            {transaction.secondParty}
          </Text>
        </View>
      </View>

      <View style={styles.amountContainer}>
        <Text style={[styles.amount, { color: theme.inverted }]}>
          {isReceive ? '+' : '-'}
          {formatCurrency(transaction.amount)}
        </Text>
        <Text style={[styles.date, { color: theme.textSecondary }]}>
          {new Date(transaction.date).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  iconContainer: {
    width: 55,
    height: 55,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  details: { flex: 1 },
  reason: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  party: { fontSize: 14 },
  amountContainer: { alignItems: 'flex-end' },
  amount: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  date: { fontSize: 12 }
})
