import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import AppText from './AppText';

export default function AppMessage({ message }) {
  return (
    <View style={styles.container}>
      <AppText>{message}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
