import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import AppText from './AppText';
import AppButton from './AppButton';

export default function AppMessage({ message, buttonTile, onPress, ...other }) {
  return (
    <View style={styles.container}>
      <AppText>{message}</AppText>
      {buttonTile && (
        <AppButton
          labelStyle={styles.buttonLabel}
          onPress={onPress}
          style={styles.button}
          title={buttonTile}
          {...other}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    marginVertical: 20,
    width: 'auto',
  },
  buttonLabel: {
    paddingHorizontal: 10,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
