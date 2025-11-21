# Finance Tracking App 💰

A modern, feature-rich finance tracking mobile application built with React Native and Expo. Track your income and expenses, manage budgets, and gain insights into your spending habits with a beautiful dark/light theme interface.

## ✨ Features

### 📊 Transaction Management
- **Add Transactions**: Record income and expenses with detailed information (amount, reason, second party, date)
- **Edit Transactions**: Tap any transaction to modify its details
- **Delete Transactions**: Remove transactions with confirmation dialog
- **Transaction Filters**: Filter by All, Expenses, or Income on the Transactions screen

### 💳 Financial Insights
- **Real-time Balance**: View your current total balance
- **Weekly Spending**: Track your spending for the current week
- **Spending Trends**: Compare current week spending vs. last week with percentage change
- **Budget Management**: Set and manage monthly budget limits

### 🎨 User Interface
- **Dark/Light Theme**: Toggle between dark and light modes
- **Modern Design**: Clean, intuitive interface with yellow accent colors
- **Spending Card**: Visual representation of your financial status
- **Quick Actions**: Receive and Send buttons for fast transaction entry

### 💾 Data Persistence
- **Local Storage**: All data saved using AsyncStorage
- **Automatic Sync**: Changes reflected immediately across the app
- **Currency Support**: F CFA currency format

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd finance-track-antigravity
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on your device**
   - Scan the QR code with Expo Go (Android) or Camera app (iOS)
   - Or press `a` for Android emulator
   - Or press `i` for iOS simulator

## 📱 App Structure

```
finance-track-antigravity/
├── app/                          # Expo Router screens
│   ├── (tabs)/                   # Tab navigation screens
│   │   ├── index.tsx            # Home screen
│   │   ├── transactions.tsx     # Transactions list screen
│   │   ├── settings.tsx         # Settings screen
│   │   └── _layout.tsx          # Tab layout configuration
│   └── _layout.tsx              # Root layout
├── src/
│   ├── components/              # Reusable components
│   │   ├── SpendingCard.tsx    # Main spending card component
│   │   ├── TransactionForm.tsx # Add/Edit transaction form
│   │   └── TransactionItem.tsx # Transaction list item
│   ├── constants/
│   │   └── theme.ts            # Theme colors and global styles
│   ├── context/
│   │   └── AppContext.tsx      # Global state management
│   ├── services/
│   │   └── storage.ts          # AsyncStorage wrapper
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   └── utils/
│       └── currency.ts         # Currency formatting utilities
└── package.json
```

## 🎯 Usage

### Adding a Transaction
1. Tap the **+** button on the Transactions screen, or
2. Use **Receive** (for income) or **Send** (for expenses) buttons on the Home screen
3. Fill in the transaction details
4. Tap "Add Transaction"

### Editing a Transaction
1. Tap any transaction in the list
2. Modify the details as needed
3. Tap "Update Transaction"

### Deleting a Transaction
1. Tap the transaction you want to delete
2. Tap "Delete Transaction" button
3. Confirm the deletion

### Changing Theme
1. Go to the **Settings** tab
2. Toggle the **Dark Mode** switch
3. The app will immediately update across all screens

### Managing Budget
1. Go to the **Settings** tab
2. Enter your desired monthly budget limit
3. Tap "Update Budget"

## 🛠️ Technologies Used

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tooling
- **Expo Router**: File-based navigation
- **TypeScript**: Type-safe development
- **AsyncStorage**: Local data persistence
- **React Context API**: Global state management

## 📋 Future Enhancements

- [ ] Online database synchronization
- [ ] AI-driven financial advice
- [ ] Budget target tracking
- [ ] Transaction categories
- [ ] Export data functionality
- [ ] Charts and analytics
- [ ] Multi-currency support

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ using Expo and React Native
