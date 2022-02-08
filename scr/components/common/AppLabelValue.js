import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import AppText from './AppText';

export default function AppLabelValue({ label, value }) {
  return (
    <View style={styles.container}>
      <AppText>{label}</AppText>
      <AppText>{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
