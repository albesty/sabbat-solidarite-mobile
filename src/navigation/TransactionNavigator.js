import React from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import routes from './routes';
import { colors } from '../utils/styles';
import HeaderButton from '../components/navigation/HeaderButton';
import NewTransactionScreen from '../screens/transaction/NewTransactionScreen';
import NavigationTitle from '../components/navigation/NavigationTitle';
import TransactionScreen from '../screens/transaction/TransactionScreen';
import NewCardTransactionScreen from '../screens/transaction/NewCardTransactionScreen';

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
      <TransactionStack.Screen
        name={routes.CARD_TRANSACTON}
        component={NewCardTransactionScreen}
        options={({ route }) => ({
          headerTitle: () => (
            <NavigationTitle title={`${route.params.transactionName} par carte`} />
          ),
        })}
      />
    </TransactionStack.Navigator>
  );
}

const styles = StyleSheet.create({});
