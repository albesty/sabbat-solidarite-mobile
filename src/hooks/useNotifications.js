import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useContext } from 'react';
import { setPushNotifToken } from '../api/services/authServices';
import { AuthContext } from '../contexts/AuthContext';
import navigation from '../navigation/routeNavigation';
import routes from '../navigation/routes';

export default function useNotifications() {
  const { state } = useContext(AuthContext);

  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      if (token !== state.user.pushNotificationToken) {
        const data = {
          userId: state.user.id,
          notificationToken: token,
        };
        await setPushNotifToken(data);
      }
    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  }

  const handleNotificationTaped = async (response) => {
    const connectedUser = state.user;
    const data = response.data;
    const notifType = data.notifType;
    if (connectedUser) {
      if (notifType === 'welcome') {
        navigation.navigate(routes.CONTACT);
      } else {
        navigation.navigate(routes.STARTER);
      }
    } else {
      navigation.navigate('WelcomeScreen');
    }
  };

  return { registerForPushNotificationsAsync, handleNotificationTaped };
}
