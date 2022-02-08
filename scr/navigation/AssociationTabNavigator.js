import { StyleSheet } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import routes from './routes';
import MemberScreen from '../screens/association/MemberScreen';
import CotisationScreen from '../screens/association/CotisationScreen';
import EngagementScreen from '../screens/association/EngagementScreen';
import MemberCompteScreen from '../screens/association/MemberCompteScreen';
import { colors } from '../utils/styles';
import AppTabBarIcon from '../components/navigation/AppTabBarIcon';
import DashboardNavigator from './DashboardNavigator';

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
          title: 'Caisse',
          headerStyle: { backgroundColor: colors.rougeBordeau },
          headerTintColor: colors.white,
        }}
      />
      <AssociationTab.Screen
        name={routes.MEMBER}
        component={MemberScreen}
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
        component={CotisationScreen}
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
        component={EngagementScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AppTabBarIcon name="card-account-details" size={size} color={color} />
          ),
          title: 'Engagements',
          headerShown: false,
        }}
      />
      <AssociationTab.Screen
        name={routes.MEMBER_COMPTE}
        component={MemberCompteScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AppTabBarIcon name="account" size={size} color={color} />
          ),
          title: 'Moi',
          headerShown: false,
        }}
      />
    </AssociationTab.Navigator>
  );
}

const styles = StyleSheet.create({});
