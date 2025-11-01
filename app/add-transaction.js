import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const AddTransactionScreen = () => {
  const [formData, setFormData] = useState({
    date: '', // Empty by default - user can enter any date
    amount: '',
    description: '',
    location: '',
    type: '',
    category: '',
  });

  const router = useRouter();

  const transactionTypes = ['Credit', 'Debit', 'Refund'];
  const categories = ['Shopping', 'Travel', 'Utility', 'Food', 'Entertainment', 'Income', 'Other'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const { date, amount, description, location, type, category } = formData;
    
    if (!date || !amount || !description || !location || !type || !category) {
      Alert.alert('Error', 'Please fill in all fields');
      return false;
    }

    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return false;
    }

    return true;
  };

  const handleAddTransaction = async () => {
    if (validateForm()) {
      try {
        const newTransaction = {
          ...formData,
          id: Date.now().toString(),
          amount: parseFloat(formData.amount).toFixed(2),
        };

        // Get existing transactions and add new one
        const storedTransactions = await AsyncStorage.getItem('@transactions');
        const existingTransactions = storedTransactions ? JSON.parse(storedTransactions) : [];
        const updatedTransactions = [newTransaction, ...existingTransactions];
        
        // Save to storage
        await AsyncStorage.setItem('@transactions', JSON.stringify(updatedTransactions));
        
        Alert.alert('Success', 'Transaction added successfully!');
        router.back(); // Go back to dashboard
      } catch (error) {
        Alert.alert('Error', 'Failed to save transaction');
      }
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter date (e.g., 2025-01-27)"
            value={formData.date}
            onChangeText={(value) => handleInputChange('date', value)}
          />

          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            value={formData.amount}
            onChangeText={(value) => handleInputChange('amount', value)}
            keyboardType="decimal-pad"
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter description"
            value={formData.description}
            onChangeText={(value) => handleInputChange('description', value)}
          />

          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter location"
            value={formData.location}
            onChangeText={(value) => handleInputChange('location', value)}
          />

          <Text style={styles.label}>Transaction Type</Text>
          <View style={styles.typeContainer}>
            {transactionTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeButton,
                  formData.type === type && styles.typeButtonSelected,
                ]}
                onPress={() => handleInputChange('type', type)}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    formData.type === type && styles.typeButtonTextSelected,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  formData.category === category && styles.categoryButtonSelected,
                ]}
                onPress={() => handleInputChange('category', category)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    formData.category === category && styles.categoryButtonTextSelected,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddTransaction}
          >
            <Text style={styles.addButtonText}>Add Transaction</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  form: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 20,
    borderRadius: 8,
    fontSize: 16,
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
  },
  typeButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  typeButtonText: {
    color: '#333',
    fontWeight: '500',
  },
  typeButtonTextSelected: {
    color: 'white',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 30,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
  },
  categoryButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryButtonText: {
    color: '#333',
    fontSize: 14,
  },
  categoryButtonTextSelected: {
    color: 'white',
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddTransactionScreen;