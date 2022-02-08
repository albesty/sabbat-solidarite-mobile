import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import routes from './routes';
import CaisseScreen from '../screens/association/CaisseScreen';

const DashboardStack = createStackNavigator();

export default function DashboardNavigator({ route }) {
  const selected = route.params;
  return (
    <DashboardStack.Navigator
      screenOptions={({ navigation, route }) => ({
        headerShown: false,
      })}
    >
      <DashboardStack.Screen
        initialParams={selected}
        name={routes.CAISSE}
        component={CaisseScreen}
      />
    </DashboardStack.Navigator>
  );
}
