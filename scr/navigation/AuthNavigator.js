import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import routes from './routes';
import WelcomeScreen from '../screens/authentication/WelcomeScreen';
import LoginScreen from '../screens/authentication/LoginScreen';
import RegisterScreen from '../screens/authentication/RegisterScreen';
import { colors } from '../utils/styles';
import NavigationTitle from '../components/navigation/NavigationTitle';

const AuthStack = createStackNavigator();

export default function AuthNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={() => ({
        headerStyle: { backgroundColor: colors.rougeBordeau },
        headerTintColor: colors.white,
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
      <AuthStack.Screen name={routes.LOGIN} component={LoginScreen} />
      <AuthStack.Screen name={routes.REGISTER} component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}
