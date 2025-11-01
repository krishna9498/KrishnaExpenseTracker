import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function DashboardScreen() {
  const [transactions, setTransactions] = useState([]);
  const router = useRouter();

  // Load transactions from storage on focus
  useFocusEffect(
    React.useCallback(() => {
      loadTransactions();
    }, [])
  );

  const loadTransactions = async () => {
    try {
      const storedTransactions = await AsyncStorage.getItem('@transactions');
      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions));
      } else {
        // ONLY 2 initial transactions
        const initialTransactions = [
          {
            id: '1',
            date: '2025-01-27',
            amount: '150.00',
            description: 'Grocery Shopping',
            location: 'Supermarket',
            type: 'Debit',
            category: 'Shopping',
          },
          {
            id: '2',
            date: '2025-01-26', 
            amount: '1000.00',
            description: 'Salary',
            location: 'Bank',
            type: 'Credit',
            category: 'Income',
          },
        ];
        setTransactions(initialTransactions);
        await AsyncStorage.setItem('@transactions', JSON.stringify(initialTransactions));
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const saveTransactions = async (newTransactions) => {
    try {
      await AsyncStorage.setItem('@transactions', JSON.stringify(newTransactions));
    } catch (error) {
      console.error('Error saving transactions:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => router.replace('/')
        },
      ]
    );
  };

  const handleAddTransaction = () => {
    router.push('/add-transaction');
  };

  const handleTransactionPress = (transaction) => {
    router.push({
      pathname: '/transaction-detail',
      params: { transaction: JSON.stringify(transaction) }
    });
  };

  // Function to add new transaction
  const addNewTransaction = (newTransaction) => {
    const transactionWithId = {
      ...newTransaction,
      id: Date.now().toString(),
    };
    const updatedTransactions = [transactionWithId, ...transactions];
    setTransactions(updatedTransactions);
    saveTransactions(updatedTransactions);
  };

  const getAmountColor = (type) => {
    switch (type) {
      case 'Credit':
      case 'Refund':
        return '#4CAF50';
      case 'Debit':
        return '#F44336';
      default:
        return '#333';
    }
  };

  const getAmountPrefix = (type) => {
    switch (type) {
      case 'Credit':
      case 'Refund':
        return '+';
      case 'Debit':
        return '-';
      default:
        return '';
    }
  };

  const renderTransactionItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.transactionItem}
      onPress={() => handleTransactionPress(item)}
    >
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionDescription}>{item.description}</Text>
        <Text style={styles.transactionCategory}>{item.category}</Text>
        <Text style={styles.transactionDate}>{item.date}</Text>
      </View>
      <View style={styles.amountContainer}>
        <Text style={[
          styles.transactionAmount,
          { color: getAmountColor(item.type) }
        ]}>
          {getAmountPrefix(item.type)}${item.amount}
        </Text>
        <Text style={styles.transactionType}>{item.type}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Krishna Expense Dashboard',
          headerRight: () => (
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          ),
        }} 
      />

      <View style={styles.header}>
        <Text style={styles.balanceText}>
          Total Balance: ${transactions.reduce((total, transaction) => {
            const amount = parseFloat(transaction.amount);
            if (transaction.type === 'Credit' || transaction.type === 'Refund') {
              return total + amount;
            } else {
              return total - amount;
            }
          }, 0).toFixed(2)}
        </Text>
        <Text style={styles.transactionCount}>
          Total Transactions: {transactions.length}
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.addButton}
        onPress={handleAddTransaction}
      >
        <Text style={styles.addButtonText}>+ Add New Transaction</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Recent Transactions</Text>
      
      {transactions.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No transactions yet</Text>
        </View>
      ) : (
        <FlatList
          data={transactions}
          renderItem={renderTransactionItem}
          keyExtractor={item => item.id}
          style={styles.transactionList}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  balanceText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 5,
  },
  transactionCount: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  transactionList: {
    flex: 1,
  },
  transactionItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  transactionCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#999',
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  transactionType: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
  },
  logoutButton: {
    marginRight: 15,
    padding: 8,
  },
  logoutText: {
    color: '#F44336',
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 18,
    color: '#666',
  },
});