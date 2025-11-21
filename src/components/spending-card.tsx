import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useAppContext } from '../context/app-context'
import { formatCurrency } from '../utils/currency'

interface SpendingCardProps {
  totalBalance: number
  weeklySpending: number
  spendingTrend: number
  cardNumber: string
  onReceivePress: () => void
  onSendPress: () => void
}

export const SpendingCard = ({
  totalBalance,
  weeklySpending,
  spendingTrend,
  cardNumber,
  onReceivePress,
  onSendPress
}: SpendingCardProps) => {
  const { theme } = useAppContext()
  const trendText = spendingTrend > 0 ? 'more' : 'less'
  const showTrend = !isNaN(spendingTrend) && isFinite(spendingTrend)

  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.lightRay} />

      <View style={styles.content}>
        <Text style={[styles.warningText, { color: theme.textSecondary }]}>
          You spent{' '}
          <Text style={[styles.highlight, { color: theme.primary }]}>
            {formatCurrency(weeklySpending)}
          </Text>{' '}
          on expenses this week
          {showTrend && (
            <>
              {' '}
              <Text style={[styles.highlight, { color: theme.primary }]}>
                {Math.abs(spendingTrend).toFixed(0)}% {trendText}
              </Text>{' '}
              than last week.
            </>
          )}
        </Text>

        <View style={styles.balanceContainer}>
          <Text style={[styles.balance, { color: theme.text }]}>
            {formatCurrency(totalBalance)}
          </Text>
          <Text style={[styles.cardNumber, { color: theme.textSecondary }]}>
            **** **** {cardNumber}
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.white }]}
            onPress={onReceivePress}
          >
            <Ionicons name="arrow-down" size={20} color={theme.black} />
            <Text style={[styles.buttonText, { color: theme.black }]}>Receive</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.sendButton]} onPress={onSendPress}>
            <Ionicons name="arrow-up" size={20} color={theme.white} />
            <Text style={[styles.buttonText, { color: theme.white }]}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 300,
    overflow: 'hidden',
    position: 'relative',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1
  },
  lightRay: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 150,
    height: 200,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: [{ rotate: '45deg' }],
    borderRadius: 100
  },
  content: { flex: 1, justifyContent: 'space-between' },
  warningText: { fontSize: 16, lineHeight: 20 },
  highlight: { fontWeight: 'bold' },
  balanceContainer: { marginVertical: 20 },
  balance: { fontSize: 36, fontWeight: 'bold', marginBottom: 5 },
  cardNumber: { fontSize: 14 },
  actions: { flexDirection: 'row', gap: 15 },
  button: {
    flex: 1,
    borderRadius: 30,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },
  sendButton: { backgroundColor: '#333' },
  buttonText: { fontWeight: 'bold', fontSize: 16 }
})
