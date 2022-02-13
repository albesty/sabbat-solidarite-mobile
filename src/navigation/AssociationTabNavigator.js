import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import routes from './routes';
import { colors } from '../utils/styles';
import AppTabBarIcon from '../components/navigation/AppTabBarIcon';
import DashboardNavigator from './DashboardNavigator';
import CotisationNavigator from './CotisationNavigator';
import MemberNavigator from './MemberNavigator';
import EngagementNavigator from './EngagementNavigator';

const AssociationTab = createBottomTabNavigator();

export default function AssociationTabNavigator({ route }) {
  const selectedAssociation = route.params;
  return (
    <AssociationTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.rougeBordeau,
      }}
    >
      <AssociationTab.Screen
        name={routes.DASHBOARD}
        initialParams={selectedAssociation}
        component={DashboardNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AppTabBarIcon name="home-account" size={size} color={color} />
          ),
          headerShown: false,
          title: 'Dashborad',
          headerStyle: { backgroundColor: colors.rougeBordeau },
          headerTintColor: colors.white,
        }}
      />
      <AssociationTab.Screen
        name={routes.MEMBER}
        component={MemberNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AppTabBarIcon name="account-group" size={size} color={color} />
          ),
          title: 'Membres',
          headerShown: false,
        }}
      />
      <AssociationTab.Screen
        name={routes.COTISATION}
        component={CotisationNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AppTabBarIcon name="wallet-plus" size={size} color={color} />
          ),
          title: 'Cotisatiions',
          headerShown: false,
        }}
      />
      <AssociationTab.Screen
        name={routes.ENGAGEMENT}
        component={EngagementNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AppTabBarIcon name="card-account-details" size={size} color={color} />
          ),
          title: 'Engagements',
          headerShown: false,
        }}
      />
    </AssociationTab.Navigator>
  );
}
