import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PublishScreen from '../screens/publish/PublishScreen';

export type PublishStackParamList = {
  PublishMain: undefined;
};

const Stack = createNativeStackNavigator<PublishStackParamList>();

export function PublishStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTitle: 'Publish',
      }}
    >
      <Stack.Screen
        name="PublishMain"
        component={PublishScreen}
        options={{
          headerTitle: 'Publish Property',
        }}
      />
    </Stack.Navigator>
  );
}
