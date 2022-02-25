import React from 'react';
import { StyleSheet, View } from 'react-native';
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
