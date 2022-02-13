import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import AppText from './AppText';

export default function AppLabelAndValueSimple({ value, label }) {
  return (
    <View>
      <AppText style={styles.label}>{label}</AppText>
      <AppText style={styles.value}>{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontWeight: 'bold',
  },
  value: {
    fontSize: 15,
  },
});
