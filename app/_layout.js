import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{ 
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="dashboard" 
          options={{ 
            title: 'Krishna Expense Dashboard',
            headerBackTitle: 'Back'
          }} 
        />
        <Stack.Screen 
          name="transaction-detail" 
          options={{ 
            title: 'Transaction Details',
            headerBackTitle: 'Back'
          }} 
        />
        <Stack.Screen 
          name="add-transaction" 
          options={{ 
            title: 'Add Transaction',
            headerBackTitle: 'Back'
          }} 
        />
      </Stack>
    </GestureHandlerRootView>
  );
}