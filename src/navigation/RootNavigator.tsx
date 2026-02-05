import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { AuthStack, AuthStackParamList } from './AuthStack';
import { BottomTabs, BottomTabsParamList } from './BottomTabs';
import { AdminStack } from './AdminStack';
import { colors } from '../utils/theme';

export type RootStackParamList = {
  Auth: undefined;
  MainApp: undefined;
  AdminMode: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { user, isLoading, accountType, isAdmin } = useAuth();

  console.log('🔍 RootNavigator render:', {
    hasUser: !!user,
    userId: user?.id,
    accountType,
    isAdmin,
    isLoading
  });

  if (isLoading) {
    console.log('⏳ Still loading...');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.foreground, marginTop: 12 }}>Carregando...</Text>
      </View>
    );
  }

  if (user === null) {
    console.log('🚪 User is null, showing Auth');
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="Auth"
          component={AuthStack}
          options={{
            animationTypeForReplace: 'pop',
          }}
        />
      </Stack.Navigator>
    );
  }

  // Both proprietario and arrendatario (and now Admin) use BottomTabs
  // The difference is managed inside BottomTabs
  console.log('✅ User authenticated, showing MainApp with BottomTabs');
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainApp" component={BottomTabs} />
    </Stack.Navigator>
  );
}
