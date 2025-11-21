import { StyleSheet } from 'react-native'

export const PALETTE = {
  gray: '#8E8E93',
  white: '#FFFFFF',
  black: '#000000',
  danger: '#FF453A',
  primary: '#FFD60A',
  success: '#00a63e',
  darkCard: '#1C1C1E',
  lightCard: '#F2F2F7',
  darkBorder: '#38383A',
  lightBorder: '#C6C6C8',
  darkBackground: '#000000',
  lightBackground: '#F2F2F7'
}

export const THEMES = {
  dark: {
    icon: PALETTE.white,
    text: PALETTE.white,
    white: PALETTE.white,
    black: PALETTE.black,
    danger: PALETTE.danger,
    card: PALETTE.darkCard,
    inverted: PALETTE.white,
    success: PALETTE.success,
    tabBar: PALETTE.darkCard,
    primary: PALETTE.primary,
    border: PALETTE.darkBorder,
    textSecondary: PALETTE.gray,
    progressBarBackground: '#333',
    background: PALETTE.darkBackground,
    transactionItemIconBackground: PALETTE.darkCard
  },
  light: {
    text: PALETTE.black,
    icon: PALETTE.black,
    white: PALETTE.white,
    black: PALETTE.black,
    tabBar: PALETTE.white,
    danger: PALETTE.danger,
    card: PALETTE.lightCard,
    inverted: PALETTE.black,
    success: PALETTE.success,
    primary: PALETTE.primary,
    background: PALETTE.white,
    textSecondary: PALETTE.gray,
    border: PALETTE.lightBorder,
    progressBarBackground: '#E5E5EA',
    transactionItemIconBackground: PALETTE.darkCard
  }
}

export const COLORS = THEMES.dark

export const GLOBAL_STYLES = StyleSheet.create({
  container: { flex: 1 },
  subtitle: { fontSize: 16 },
  card: { borderRadius: 20, padding: 20 },
  row: { flexDirection: 'row', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  shadow: {
    elevation: 8,
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 }
  }
})
