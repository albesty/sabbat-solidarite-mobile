import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function AppSpacer({ style }) {
  return <View style={[styles.spacer, style]} />;
}

const styles = StyleSheet.create({
  spacer: {
    marginVertical: 10,
  },
});
