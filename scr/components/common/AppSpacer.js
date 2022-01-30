import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

export default function AppSpacer({ style }) {
  return <View style={[styles.spacer, style]} />;
}

const styles = StyleSheet.create({
  spacer: {
    marginVertical: 10,
  },
});
