import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import routes from './routes';
import StarterScreen from '../screens/starter/StarterScreen';
import { colors } from '../utils/styles';
import UserAvatar from '../components/user/UserAvatar';
import HeaderButton from '../components/navigation/HeaderButton';
import ListAssociationScreen from '../screens/association/ListAssociationScreen';
import NewAssociationScreen from '../screens/association/NewAssociationScreen';
import NavigationTitle from '../components/navigation/NavigationTitle';
import AssociationDetailScreen from '../screens/association/AssociationDetailScreen';
import UserCompteNavigator from './UserCompteNavigator';
import TransactionNavigator from './TransactionNavigator';
import AssociationTabNavigator from './AssociationTabNavigator';
import { AuthContext } from '../contexts/AuthContext';
import ShowImageScreen from '../screens/starter/ShowImageScreen';
import ContactScreen from '../screens/help/ContactScreen';
import FAQScreen from '../screens/help/FAQScreen';

const StarterStack = createStackNavigator();
export default function StarterNavigator({ navigation }) {
  const { state } = useContext(AuthContext);
  const handleLogout = () => {
    navigation.navigate(routes.WELCOME);
  };

  return (
    <StarterStack.Navigator
      screenOptions={({ navigation, route }) => ({
        headerStyle: { backgroundColor: colors.rougeBordeau },
        headerTintColor: colors.white,
        headerLeft: () =>
          route.name !== routes.STARTER ? (
            <HeaderButton onPress={() => navigation.goBack()} />
          ) : null,
        ...TransitionPresets.SlideFromRightIOS,
      })}
    >
      <StarterStack.Screen
        name={routes.STARTER}
        component={StarterScreen}
        options={{
          headerLeft: () => (
            <UserAvatar
              user={state.user}
              loadingContainer={styles.loadingContainer}
              onPress={() => navigation.navigate(routes.USER, state.user)}
            />
          ),
          headerTitle: () => null,
          headerRight: () => (
            <HeaderButton onPress={handleLogout} icon="logout" style={styles.logout} />
          ),
        }}
      />
      <StarterStack.Screen
        name={routes.LIST_ASSOCIATION}
        component={ListAssociationScreen}
        options={{
          headerTitle: () => <NavigationTitle title="Liste des associations" />,
        }}
      />
      <StarterStack.Screen
        name={routes.NEW_ASSOCIATION}
        component={NewAssociationScreen}
        options={{
          headerTitle: () => <NavigationTitle title="Nouvelle association" />,
        }}
      />
      <StarterStack.Screen
        name={routes.ASSOCIATION_DETAIL}
        component={AssociationDetailScreen}
        options={({ route }) => ({
          headerTitle: () => <NavigationTitle title={`${route.params.nom}   Détails`} />,
        })}
      />
      <StarterStack.Screen
        name={routes.USER}
        component={UserCompteNavigator}
        options={{
          headerShown: false,
        }}
      />
      <StarterStack.Screen
        name={routes.TRANSACTION}
        component={TransactionNavigator}
        options={{
          headerShown: false,
        }}
      />
      <StarterStack.Screen
        name={routes.ASSOCIATION_TAB}
        component={AssociationTabNavigator}
        options={{
          headerShown: false,
        }}
      />
      <StarterStack.Screen
        name={routes.SHOW_IMAGE}
        component={ShowImageScreen}
        options={() => ({
          headerTitle: () => <HeaderButton showIcon={false} />,
        })}
      />
      <StarterStack.Screen
        name={routes.CONTACT}
        component={ContactScreen}
        options={{
          headerTitle: () => <NavigationTitle title="Nous contacter" />,
        }}
      />
      <StarterStack.Screen
        name={routes.FAQ}
        component={FAQScreen}
        options={{
          headerTitle: () => <NavigationTitle title="Frequent Asked Questions" />,
        }}
      />
    </StarterStack.Navigator>
  );
}

const styles = StyleSheet.create({
  logout: {
    paddingRight: 10,
  },
  loadingContainer: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  header: {
    backgroundColor: colors.rougeBordeau,
  },
});
