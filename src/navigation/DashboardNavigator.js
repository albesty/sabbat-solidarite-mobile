import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import routes from './routes';
import CaisseScreen from '../screens/association/CaisseScreen';
import { colors } from '../utils/styles';
import HeaderButton from '../components/navigation/HeaderButton';
import NavigationTitle from '../components/navigation/NavigationTitle';

const DashboardStack = createStackNavigator();

export default function DashboardNavigator({ route }) {
  const selected = route.params;
  return (
    <DashboardStack.Navigator
      screenOptions={({ navigation, route }) => ({
        headerStyle: { backgroundColor: colors.rougeBordeau },
        headerTintColor: colors.white,
        headerLeft: () =>
          route.name !== routes.CAISSE ? (
            <HeaderButton onPress={() => navigation.goBack()} />
          ) : null,
        ...TransitionPresets.SlideFromRightIOS,
      })}
    >
      <DashboardStack.Screen
        initialParams={selected}
        name={routes.CAISSE}
        component={CaisseScreen}
        options={{
          headerTitle: () => <NavigationTitle title="Tableau de bord" />,
        }}
      />
    </DashboardStack.Navigator>
  );
}
