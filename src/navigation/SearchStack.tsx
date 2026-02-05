import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SearchScreen from '../screens/search/SearchScreen';

export type SearchStackParamList = {
  SearchMain: undefined;
};

const Stack = createNativeStackNavigator<SearchStackParamList>();

export function SearchStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTitle: 'Search',
      }}
    >
      <Stack.Screen
        name="SearchMain"
        component={SearchScreen}
        options={{
          headerTitle: 'Search Properties',
        }}
      />
    </Stack.Navigator>
  );
}
