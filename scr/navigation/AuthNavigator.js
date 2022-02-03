import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import routes from './routes';
import WelcomeScreen from '../screens/authentication/WelcomeScreen';
import LoginScreen from '../screens/authentication/LoginScreen';
import RegisterScreen from '../screens/authentication/RegisterScreen';
import { colors } from '../utils/styles';
import NavigationTitle from '../components/navigation/NavigationTitle';
import StarterNavigator from './StarterNavigator';
import HeaderButton from '../components/navigation/HeaderButton';

const AuthStack = createStackNavigator();

export default function AuthNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={({ navigation, route }) => ({
        headerStyle: { backgroundColor: colors.rougeBordeau },
        headerTintColor: colors.white,
        headerLeft: () =>
          route.name !== 'WelcomeScreen' ? (
            <HeaderButton onPress={() => navigation.goBack()} />
          ) : null,
        ...TransitionPresets.SlideFromRightIOS,
      })}
    >
      <AuthStack.Screen
        name={routes.WELCOME}
        component={WelcomeScreen}
        options={{
          headerTitleAlign: 'center',
          headerTitle: () => <NavigationTitle title="Bienvenue" />,
        }}
      />
      <AuthStack.Screen
        options={{
          headerTitle: () => <NavigationTitle title="Connectez-vous" />,
        }}
        name={routes.LOGIN}
        component={LoginScreen}
      />
      <AuthStack.Screen
        options={{
          headerTitle: () => <NavigationTitle title="Créer un compte" />,
        }}
        name={routes.REGISTER}
        component={RegisterScreen}
      />
      <AuthStack.Screen
        name="Starter"
        component={StarterNavigator}
        options={{
          headerShown: false,
        }}
      />
    </AuthStack.Navigator>
  );
}
