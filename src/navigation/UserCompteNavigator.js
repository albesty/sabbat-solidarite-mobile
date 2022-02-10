import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import React from 'react';
import routes from './routes';
import CompteScreen from '../screens/user/CompteScreen';
import { colors } from '../utils/styles';
import HeaderButton from '../components/navigation/HeaderButton';
import ProfileScreen from '../screens/user/ProfileScreen';
import ConnexionParamScreen from '../screens/user/ConnexionParamScreen';
import NavigationTitle from '../components/navigation/NavigationTitle';

const UserCompteStack = createStackNavigator();

export default function UserCompteNavigator() {
  return (
    <UserCompteStack.Navigator
      screenOptions={({ navigation, route }) => ({
        headerStyle: { backgroundColor: colors.rougeBordeau },
        headerTintColor: colors.white,
        headerLeft: () => <HeaderButton onPress={() => navigation.goBack()} />,
        ...TransitionPresets.SlideFromRightIOS,
      })}
    >
      <UserCompteStack.Screen
        options={{
          headerTitle: () => <NavigationTitle title="Portefeuille" />,
        }}
        name={routes.USER_COMPTE}
        component={CompteScreen}
      />
      <UserCompteStack.Screen
        options={{
          headerTitle: () => <NavigationTitle title="Profile" />,
        }}
        name={routes.PROFILE}
        component={ProfileScreen}
      />
      <UserCompteStack.Screen
        options={{
          headerTitle: () => <NavigationTitle title="Paramètres de connexion" />,
        }}
        name={routes.PARAM}
        component={ConnexionParamScreen}
      />
    </UserCompteStack.Navigator>
  );
}

const styles = StyleSheet.create({});
