import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import routes from './routes';
import ListCotisationScreen from '../screens/cotisation/ListCotisationScreen';
import NewCotisationScreen from '../screens/cotisation/NewCotisationScreen';
import { colors } from '../utils/styles';
import HeaderButton from '../components/navigation/HeaderButton';
import NavigationTitle from '../components/navigation/NavigationTitle';
import EtatCotisationScreen from '../screens/cotisation/EtatCotisationScreen';
import PayCotisationScreen from '../screens/cotisation/PayCotisationScreen';
import MemberCotisationDetailScreen from '../screens/cotisation/MemberCotisationDetailScreen';

const CotisationStack = createStackNavigator();

export default function CotisationNavigator() {
  return (
    <CotisationStack.Navigator
      screenOptions={({ navigation, route }) => ({
        headerStyle: { backgroundColor: colors.rougeBordeau },
        headerTintColor: colors.white,
        headerLeft: () =>
          route.name !== routes.ETAT_COTISATION ? (
            <HeaderButton onPress={() => navigation.goBack()} />
          ) : null,
        ...TransitionPresets.SlideFromRightIOS,
      })}
    >
      <CotisationStack.Screen
        name={routes.ETAT_COTISATION}
        component={EtatCotisationScreen}
        options={{
          headerTitle: () => <NavigationTitle title="Etat des cotisations" />,
        }}
      />
      <CotisationStack.Screen
        name={routes.LIST_COTISATION}
        component={ListCotisationScreen}
        options={{
          headerTitle: () => <NavigationTitle title="Liste des cotisations" />,
        }}
      />
      <CotisationStack.Screen
        name={routes.NEW_COTISATION}
        component={NewCotisationScreen}
        options={{
          headerTitle: () => <NavigationTitle title="Nouvelle cotisation" />,
        }}
      />
      <CotisationStack.Screen
        name={routes.PAY_COTISATION}
        component={PayCotisationScreen}
        options={{
          headerTitle: () => <NavigationTitle title="Payement de cotisation" />,
        }}
      />
      <CotisationStack.Screen
        name={routes.MEMBER_COTISATION_DETAIL}
        component={MemberCotisationDetailScreen}
        options={({ route }) => ({
          headerTitle: () => (
            <NavigationTitle
              title={`${route.params.username ? route.params.username : route.params.email}`}
            />
          ),
        })}
      />
    </CotisationStack.Navigator>
  );
}
