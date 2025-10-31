import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const TransactionDetailScreen = () => {
  const params = useLocalSearchParams();
  const transaction = JSON.parse(params.transaction);

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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.amountSection}>
          <Text style={[
            styles.amount,
            { color: getAmountColor(transaction.type) }
          ]}>
            {getAmountPrefix(transaction.type)}${transaction.amount}
          </Text>
          <Text style={styles.type}>{transaction.type}</Text>
        </View>

        <View style={styles.detailSection}>
          <DetailRow label="Description" value={transaction.description} />
          <DetailRow label="Category" value={transaction.category} />
          <DetailRow label="Date" value={transaction.date} />
          <DetailRow label="Location" value={transaction.location} />
          <DetailRow label="Transaction Type" value={transaction.type} />
        </View>
      </View>
    </ScrollView>
  );
};

const DetailRow = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  amountSection: {
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  amount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  type: {
    fontSize: 16,
    color: '#666',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  detailSection: {
    gap: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'right',
    flex: 1,
    marginLeft: 10,
  },
});

export default TransactionDetailScreen;