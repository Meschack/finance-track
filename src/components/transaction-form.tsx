import { Ionicons } from '@expo/vector-icons'
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

  const [formData, setFormData] = useState({
    type: initialTransaction?.type || initialType,
    amount: initialTransaction?.amount.toString() || '',
    reason: initialTransaction?.reason || '',
    secondParty: initialTransaction?.secondParty || ''
  })

  useEffect(() => {
    if (initialTransaction) {
      setFormData({
        type: initialTransaction.type,
        amount: initialTransaction.amount.toString(),
        reason: initialTransaction.reason,
        secondParty: initialTransaction.secondParty
      })
    }
  }, [initialTransaction])

  const updateField = (field: keyof typeof formData, value: string | TransactionType) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    if (!formData.amount || !formData.reason.trim() || !formData.secondParty.trim()) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    const transactionData: Transaction = {
      id: initialTransaction?.id || Date.now().toString(),
      type: formData.type,
      amount: parseFloat(formData.amount),
      reason: formData.reason.trim(),
      secondParty: formData.secondParty.trim(),
      date: new Date().toISOString()
    }

    onSubmit(transactionData)

    // Reset form values after submission
    if (!initialTransaction) {
      setFormData({ type: 'expense', amount: '', reason: '', secondParty: '' })
    }
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
            onPress={() => updateField('type', element)}
            style={[
              styles.typeButton,
              { backgroundColor: element === formData.type ? theme.border : 'transparent' }
            ]}
          >
            <Text
              style={[
                styles.typeText,
                {
                  textTransform: 'capitalize',
                  color: element === formData.type ? theme.text : theme.textSecondary
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
            value={formData.amount}
            onChangeText={(value) => updateField('amount', value)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Reason</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.card, color: theme.text }]}
            placeholder="e.g. Groceries"
            placeholderTextColor={theme.textSecondary}
            value={formData.reason}
            onChangeText={(value) => updateField('reason', value)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>
            {formData.type === 'expense' ? 'To' : 'From'}
          </Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.card, color: theme.text }]}
            placeholder={formData.type === 'expense' ? 'Receiver Name' : 'Sender Name'}
            placeholderTextColor={theme.textSecondary}
            value={formData.secondParty}
            onChangeText={(value) => updateField('secondParty', value)}
          />
        </View>

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 5 }}>
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: theme.primary, flex: 1 }]}
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
              <Ionicons name="trash-outline" size={24} color={theme.danger} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingBottom: 10 },
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
  form: { gap: 10 },
  inputGroup: { gap: 5 },
  label: { fontSize: 14 },
  input: { borderRadius: 10, padding: 15, fontSize: 16 },
  submitButton: { padding: 16, borderRadius: 10, alignItems: 'center' },
  submitButtonText: { fontWeight: 'bold', fontSize: 16 },
  deleteButton: {
    height: 'auto',
    aspectRatio: 1,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: 'transparent',
    alignContent: 'center',
    justifyContent: 'center'
  },
  deleteButtonText: { fontWeight: 'bold', fontSize: 16 }
})
