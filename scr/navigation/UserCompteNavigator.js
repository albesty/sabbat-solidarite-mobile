import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import React from 'react';
import routes from './routes';
import CompteScreen from '../screens/user/CompteScreen';
import { colors } from '../utils/styles';
import HeaderButton from '../components/navigation/HeaderButton';
import ProfileScreen from '../screens/user/ProfileScreen';
import ConnexionParamScreen from '../screens/user/ConnexionParamScreen';

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
          title: 'Portefeuille',
        }}
        name={routes.USER_COMPTE}
        component={CompteScreen}
      />
      <UserCompteStack.Screen
        options={{
          title: 'Profile utilisateur',
        }}
        name={routes.PROFILE}
        component={ProfileScreen}
      />
      <UserCompteStack.Screen
        options={{
          title: 'Paramètres de connexion',
        }}
        name={routes.PARAM}
        component={ConnexionParamScreen}
      />
    </UserCompteStack.Navigator>
  );
}

const styles = StyleSheet.create({});
