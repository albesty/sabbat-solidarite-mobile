import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from './AppText';

export default function AppLabelValue({ label, value, labelStyle, valueStyle }) {
  return (
    <View style={styles.container}>
      <AppText style={[styles.label, labelStyle]}>{label}</AppText>

      <AppText style={valueStyle}>{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontWeight: 'bold',
  },
});
