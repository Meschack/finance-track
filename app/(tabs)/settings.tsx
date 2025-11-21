import React, { useState } from 'react'
import { Alert, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { GLOBAL_STYLES } from '../../src/constants/theme'
import { useAppContext } from '../../src/context/app-context'

export default function SettingsScreen() {
  const { settings, updateSettings, theme } = useAppContext()
  const [budgetLimit, setBudgetLimit] = useState(settings.budget.limit.toString())

  const handleSaveBudget = () => {
    const limit = parseFloat(budgetLimit)
    if (isNaN(limit)) {
      Alert.alert('Invalid Input', 'Please enter a valid number for the budget.')
      return
    }
    updateSettings({ budget: { ...settings.budget, limit } })
    Alert.alert('Success', 'Budget updated successfully.')
  }

  const toggleTheme = () => {
    const newTheme = settings.theme === 'dark' ? 'light' : 'dark'
    updateSettings({ theme: newTheme })
  }

  return (
    <View style={[GLOBAL_STYLES.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[GLOBAL_STYLES.title, { color: theme.text }]}>Settings</Text>
      </View>

      <View style={[styles.section, { borderBottomColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Budget</Text>
        <View style={[styles.inputContainer, { backgroundColor: theme.card }]}>
          <Text style={[styles.currencySymbol, { color: theme.text }]}>
            {settings.budget.currency}
          </Text>
          <TextInput
            style={[styles.input, { color: theme.text }]}
            value={budgetLimit}
            onChangeText={setBudgetLimit}
            keyboardType="numeric"
            placeholderTextColor={theme.textSecondary}
          />
        </View>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={handleSaveBudget}
        >
          <Text style={[styles.buttonText, { color: theme.black }]}>Update Budget</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.section, { borderBottomColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Appearance</Text>
        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.text }]}>Dark Mode</Text>
          <Switch
            value={settings.theme === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{ false: '#767577', true: theme.primary }}
            thumbColor={theme.white}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingBottom: 10, paddingTop: 60 },
  section: { padding: 20, borderBottomWidth: 1 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15
  },
  currencySymbol: { fontSize: 18, marginRight: 10 },
  input: { flex: 1, fontSize: 18 },
  button: { padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { fontWeight: 'bold', fontSize: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 16 }
})
