import React, { useEffect, useRef, useState } from 'react';
import AuthNavigator from './src/navigation/AuthNavigator';
import { navigationRef } from './src/navigation/routeNavigation';
import { NavigationContainer } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import useNotifications from './src/hooks/useNotifications';
import { useNetInfo } from '@react-native-community/netinfo';

import NetworkInfo from './src/components/common/NetworkInfo';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
export default function AppWrapper() {
  const { handleNotificationTaped } = useNotifications();
  const netInfo = useNetInfo();
  const [isNoInternet, setIsNoInternet] = useState(true);

  const notificationListener = useRef();
  const responseListener = useRef();

  const handleReceivedListener = (notification) => {
    /* const data = notification.request.content.data
        if(data.notifType === 'adhesion') {
            dispatch(getAllAssociation())
        }
        if(data.notifType === 'transaction') {
            dispatch(getUserTransactions({}))
        }
        setNotification(notification) */
  };

  const handleNotificationResponse = (response) => {
    handleNotificationTaped(response.notification.request.content);
  };

  useEffect(() => {
    let noInternet = netInfo.type !== 'unknown' && netInfo.isInternetReachable === false;
    setIsNoInternet(noInternet);
  }, [netInfo]);

  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener(handleReceivedListener);
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      handleNotificationResponse
    );

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <AuthNavigator />
      {isNoInternet && <NetworkInfo closeNetInfo={() => setIsNoInternet(false)} />}
    </NavigationContainer>
  );
}
