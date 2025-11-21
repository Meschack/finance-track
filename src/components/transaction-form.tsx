import React, { useEffect, useState } from 'react'
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import { useAppContext } from '../context/app-context'
import { Transaction, TransactionType } from '../types'

interface TransactionFormProps {
  initialType?: TransactionType
  initialTransaction?: Transaction
  onSubmit: (data: {
    id?: string
    type: TransactionType
    amount: number
    reason: string
    secondParty: string
    date: string
  }) => void
  onDelete?: (id: string) => void
  onCancel: () => void
}

export default function TransactionForm({
  onSubmit,
  onCancel,
  onDelete,
  initialType = 'expense',
  initialTransaction
}: TransactionFormProps) {
  const { theme } = useAppContext()
  const [type, setType] = useState<TransactionType>(initialTransaction?.type || initialType)
  const [amount, setAmount] = useState(initialTransaction?.amount.toString() || '')
  const [reason, setReason] = useState(initialTransaction?.reason || '')
  const [secondParty, setSecondParty] = useState(initialTransaction?.secondParty || '')

  useEffect(() => {
    if (initialTransaction) {
      setType(initialTransaction.type)
      setAmount(initialTransaction.amount.toString())
      setReason(initialTransaction.reason)
      setSecondParty(initialTransaction.secondParty)
    }
  }, [initialTransaction])

  const handleSubmit = () => {
    if (!amount || !reason || !secondParty) return

    onSubmit({
      id: initialTransaction?.id,
      type,
      amount: parseFloat(amount),
      reason,
      secondParty,
      date: initialTransaction?.date || new Date().toISOString()
    })
  }

  const handleDelete = () => {
    if (initialTransaction && onDelete) {
      Alert.alert('Delete Transaction', 'Are you sure you want to delete this transaction?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(initialTransaction.id) }
      ])
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>
          {initialTransaction ? 'Edit Transaction' : 'New Transaction'}
        </Text>
        <TouchableOpacity onPress={onCancel}>
          <Text style={[styles.cancelButton, { color: theme.primary }]}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.typeSelector, { backgroundColor: theme.card }]}>
        {(['expense', 'earning'] as const).map((element) => (
          <TouchableOpacity
            key={element}
            onPress={() => setType(element)}
            style={[
              styles.typeButton,
              { backgroundColor: element === type ? theme.border : 'transparent' }
            ]}
          >
            <Text
              style={[
                styles.typeText,
                {
                  textTransform: 'capitalize',
                  color: element === type ? theme.text : theme.textSecondary
                }
              ]}
            >
              {element}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Amount</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.card, color: theme.text }]}
            placeholder="0.00"
            placeholderTextColor={theme.textSecondary}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Reason</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.card, color: theme.text }]}
            placeholder="e.g. Groceries"
            placeholderTextColor={theme.textSecondary}
            value={reason}
            onChangeText={setReason}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>
            {type === 'expense' ? 'To' : 'From'}
          </Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.card, color: theme.text }]}
            placeholder={type === 'expense' ? 'Receiver Name' : 'Sender Name'}
            placeholderTextColor={theme.textSecondary}
            value={secondParty}
            onChangeText={setSecondParty}
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: theme.primary }]}
          onPress={handleSubmit}
        >
          <Text style={[styles.submitButtonText, { color: theme.black }]}>
            {initialTransaction ? 'Update Transaction' : 'Add Transaction'}
          </Text>
        </TouchableOpacity>

        {initialTransaction && onDelete && (
          <TouchableOpacity
            style={[styles.deleteButton, { borderColor: theme.danger }]}
            onPress={handleDelete}
          >
            <Text style={[styles.deleteButtonText, { color: theme.danger }]}>
              Delete Transaction
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  title: { fontSize: 20, fontWeight: 'bold' },
  cancelButton: { fontSize: 16 },
  typeSelector: { flexDirection: 'row', borderRadius: 10, padding: 6, marginBottom: 20 },
  typeButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  typeText: { fontWeight: 'bold' },
  form: { gap: 15 },
  inputGroup: { gap: 8 },
  label: { fontSize: 14 },
  input: { borderRadius: 10, padding: 15, fontSize: 16 },
  submitButton: { padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  submitButtonText: { fontWeight: 'bold', fontSize: 16 },
  deleteButton: {
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 5,
    borderWidth: 1,
    backgroundColor: 'transparent'
  },
  deleteButtonText: { fontWeight: 'bold', fontSize: 16 }
})
