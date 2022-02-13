import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import routes from './routes';
import ListMemberScreen from '../screens/membres/ListMemberScreen';
import MemberDetailScreen from '../screens/membres/MemberDetailScreen';
import MemberCompteScreen from '../screens/membres/MemberCompteScreen';
import { colors } from '../utils/styles';
import HeaderButton from '../components/navigation/HeaderButton';
import NavigationTitle from '../components/navigation/NavigationTitle';

const MembreStack = createStackNavigator();

export default function MemberNavigator() {
  return (
    <MembreStack.Navigator
      screenOptions={({ navigation, route }) => ({
        headerStyle: { backgroundColor: colors.rougeBordeau },
        headerTintColor: colors.white,
        headerLeft: () =>
          route.name !== routes.LIST_MEMBER ? (
            <HeaderButton onPress={() => navigation.goBack()} />
          ) : null,
        ...TransitionPresets.SlideFromRightIOS,
      })}
    >
      <MembreStack.Screen
        name={routes.LIST_MEMBER}
        component={ListMemberScreen}
        options={{
          headerTitle: () => <NavigationTitle title="Tous les membres" />,
        }}
      />
      <MembreStack.Screen
        name={routes.MEMBER_DETAIL}
        component={MemberDetailScreen}
        options={({ navigation }) => ({
          headerLeft: () => (
            <HeaderButton title="List" onPress={() => navigation.navigate(routes.LIST_MEMBER)} />
          ),
          headerTitle: () => <NavigationTitle title="Details Compte membre" />,
        })}
      />
      <MembreStack.Screen
        name={routes.MEMBER_COMPTE}
        component={MemberCompteScreen}
        options={{
          headerTitle: () => <NavigationTitle title="Compte membre" />,
        }}
      />
    </MembreStack.Navigator>
  );
}
