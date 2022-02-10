import React from 'react';
import { StyleSheet, View } from 'react-native';
import BackgroundScreen from '../../components/authentication/AuthBackground';
import AppButton from '../../components/common/AppButton';
import AppSpacer from '../../components/common/AppSpacer';
import routes from '../../navigation/routes';

export default function WelcomeScreen({ navigation }) {
  return (
    <BackgroundScreen>
      <View style={styles.buttonContainer}>
        <AppButton
          style={styles.buttonStyle}
          labelStyle={styles.label}
          icon="lock-open"
          onPress={() => navigation.navigate(routes.LOGIN)}
          title="Login"
        />
        <AppSpacer />
        <AppButton
          style={styles.buttonStyle}
          labelStyle={styles.label}
          icon="email"
          onPress={() => navigation.navigate(routes.REGISTER)}
          title="Register"
        />
      </View>
    </BackgroundScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    paddingVertical: 15,
  },
  buttonStyle: {
    width: '60%',
  },
  buttonContainer: {
    alignItems: 'center',
  },
});
