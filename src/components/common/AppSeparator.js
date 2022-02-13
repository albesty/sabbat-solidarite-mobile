import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { colors } from '../../utils/styles';

export default function AppSeparator({ style }) {
  return <View style={[styles.separator, style]} />;
}

const styles = StyleSheet.create({
  separator: {
    width: '95%',
    alignSelf: 'center',
    height: 1,
    backgroundColor: colors.leger,
  },
});
