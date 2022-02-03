import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import routes from './routes';
import RechargeScreen from '../screens/transaction/RechargeScreen';
import RetraitScreen from '../screens/transaction/RetraitScreen';
import { colors } from '../utils/styles';
import HeaderButton from '../components/navigation/HeaderButton';

const TransactionStack = createStackNavigator();

export default function TransactionNavigator() {
  return (
    <TransactionStack.Navigator
      screenOptions={({ navigation, route }) => ({
        headerStyle: { backgroundColor: colors.rougeBordeau },
        headerTintColor: colors.white,
        headerLeft: () => <HeaderButton onPress={() => navigation.goBack()} />,
        ...TransitionPresets.SlideFromRightIOS,
      })}
    >
      <TransactionStack.Screen
        name={routes.RECHARGE}
        component={RechargeScreen}
        options={{
          title: 'Rechargement protefeuille',
        }}
      />
      <TransactionStack.Screen
        name={routes.RETRAIT}
        component={RetraitScreen}
        options={{
          title: 'Retrait de fonds',
        }}
      />
    </TransactionStack.Navigator>
  );
}

const styles = StyleSheet.create({});
