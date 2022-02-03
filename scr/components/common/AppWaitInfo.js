import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import AppText from './AppText';

export default function AppWaitInfo({ info }) {
  return (
    <View style={styles.info}>
      <AppText style={styles.text}>{info}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  info: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 15,
  },
});
