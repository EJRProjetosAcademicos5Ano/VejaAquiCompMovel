import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { HomeStack, HomeStackParamList } from './HomeStack';
import { SearchStack, SearchStackParamList } from './SearchStack';
import { PublishStack, PublishStackParamList } from './PublishStack';
import { ProfileStack, ProfileStackParamList } from './ProfileStack';
import { OwnerStack } from './OwnerStack';
import { AdminStack } from './AdminStack';
import { useAuth } from '../context/AuthContext';
import { colors } from '../utils/theme';

export type BottomTabsParamList = {
  HomeTab: undefined;
  SearchTab: undefined;
  PublishTab: undefined;
  DashboardTab: undefined;
  ProfileTab: undefined;
  AdminTab: undefined;
};

const Tab = createBottomTabNavigator<BottomTabsParamList>();

export function BottomTabs() {
  const { user } = useAuth();
  const isProprietario = user?.accountType === 'proprietario';

  console.log('🏠 BottomTabs - User:', user?.email, 'accountType:', user?.accountType, 'isProprietario:', isProprietario);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'HomeTab':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'SearchTab':
              iconName = focused ? 'search' : 'search-outline';
              break;
            case 'PublishTab':
              iconName = focused ? 'add-circle' : 'add-circle-outline';
              break;
            case 'DashboardTab':
              iconName = focused ? 'stats-chart' : 'stats-chart-outline';
              break;
            case 'ProfileTab':
              iconName = focused ? 'person' : 'person-outline';
              break;
            case 'AdminTab':
              iconName = focused ? 'shield-checkmark' : 'shield-checkmark-outline';
              break;
            default:
              iconName = 'home-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="SearchTab"
        component={SearchStack}
        options={{
          tabBarLabel: 'Search',
        }}
      />
      {isProprietario && (
        <Tab.Screen
          name="PublishTab"
          component={PublishStack}
          options={{
            tabBarLabel: 'Publish',
          }}
        />
      )}
      {isProprietario && (
        <Tab.Screen
          name="DashboardTab"
          component={OwnerStack}
          options={{
            tabBarLabel: 'Dashboard',
          }}
        />
      )}
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
      {user?.role === 'admin' && (
        <Tab.Screen
          name="AdminTab"
          component={AdminStack}
          options={{
            tabBarLabel: 'Admin',
          }}
        />
      )}
    </Tab.Navigator>
  );
}
