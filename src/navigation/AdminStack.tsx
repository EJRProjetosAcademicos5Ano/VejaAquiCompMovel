import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AdVerificationScreen from '../screens/admin/AdVerificationScreen';
import UserManagementScreen from '../screens/admin/UserManagementScreen';
import FinancialScreen from '../screens/admin/FinancialScreen';
import ModerationScreen from '@/screens/admin/ModerationScreen';
import AdminReportsScreen from '@/screens/admin/AdminReportsScreen';
import SubscriptionPlansScreen from '@/screens/admin/SubscriptionPlansScreen';
import AdManagementScreen from '@/screens/admin/AdManagementScreen';
import { colors } from '@/utils/theme';

export type AdminStackParamList = {
    AdminDashboard: undefined;
    AdVerification: undefined;
    UserManagement: undefined;
    Financials: undefined;
    Moderation: undefined;
    Reports: undefined;
    SubscriptionPlans: undefined;
    AdManagement: undefined;
};

const Stack = createNativeStackNavigator<AdminStackParamList>();

export function AdminStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: colors.foreground, // Dark theme for Admin
                },
                headerTintColor: colors.background,
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            <Stack.Screen
                name="AdminDashboard"
                component={AdminDashboardScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="AdVerification"
                component={AdVerificationScreen}
                options={{ title: 'Verificar Anúncios' }}
            />
            <Stack.Screen
                name="UserManagement"
                component={UserManagementScreen}
                options={{ title: 'Gestão de Usuários' }}
            />
            <Stack.Screen
                name="Financials"
                component={FinancialScreen}
                options={{ title: 'Financeiro' }}
            />
            <Stack.Screen
                name="Moderation"
                component={ModerationScreen}
                options={{ title: 'Moderação' }}
            />
            <Stack.Screen
                name="Reports"
                component={AdminReportsScreen}
                options={{ title: 'Relatórios' }}
            />
            <Stack.Screen
                name="SubscriptionPlans"
                component={SubscriptionPlansScreen}
                options={{ title: 'Planos de Subscrição' }}
            />
            <Stack.Screen
                name="AdManagement"
                component={AdManagementScreen}
                options={{ title: 'Gestão de Publicidade' }}
            />
        </Stack.Navigator>
    );
}
