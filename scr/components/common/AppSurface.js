import { StyleSheet, TouchableHighlight } from 'react-native';
import React from 'react';
import { Surface } from 'react-native-paper';
import { colors } from '../../utils/styles';

export default function AppSurface({ style, onPress, children }) {
  return (
    <TouchableHighlight underlayColor={colors.leger} style={styles.container} onPress={onPress}>
      <Surface style={[styles.surface, style]}>{children}</Surface>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  surface: {
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    borderRadius: 10,
    padding: 5,
  },
  container: {
    flex: 1,
    marginHorizontal: 5,
  },
});
