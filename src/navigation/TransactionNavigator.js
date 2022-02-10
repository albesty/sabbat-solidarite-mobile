import { StyleSheet } from 'react-native';
import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import routes from './routes';
import { colors } from '../utils/styles';
import HeaderButton from '../components/navigation/HeaderButton';
import NewTransactionScreen from '../screens/transaction/NewTransactionScreen';
import NavigationTitle from '../components/navigation/NavigationTitle';
import TransactionScreen from '../screens/transaction/TransactionScreen';

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
        name={routes.TRANSACTION_HOME}
        component={TransactionScreen}
        options={{
          headerTitle: () => <NavigationTitle title="Vos transactions" />,
        }}
      />
      <TransactionStack.Screen
        name={routes.NEW_TRANSACTION}
        component={NewTransactionScreen}
        options={({ route }) => ({
          headerTitle: () => <NavigationTitle title={`Nouveau ${route.params.transactionName}`} />,
        })}
      />
    </TransactionStack.Navigator>
  );
}

const styles = StyleSheet.create({});
