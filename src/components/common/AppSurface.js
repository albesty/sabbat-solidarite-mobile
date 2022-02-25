import React from 'react';
import { StyleSheet, TouchableHighlight } from 'react-native';
import { Surface } from 'react-native-paper';
import { colors } from '../../utils/styles';
import AppText from './AppText';

export default function AppSurface({ style, onPress, info, infoStyle, surfaceStyle, children }) {
  return (
    <TouchableHighlight
      underlayColor={colors.leger}
      style={[styles.container, style]}
      onPress={onPress}
    >
      <>
        {info && <AppText style={[styles.info, infoStyle]}>{info}</AppText>}
        <Surface style={[styles.surface, surfaceStyle]}>{children}</Surface>
      </>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  surface: {
    alignItems: 'center',
    elevation: 5,
    borderRadius: 10,
    padding: 5,
  },
  container: {
    marginHorizontal: 5,
  },
  info: {
    fontSize: 15,
    alignSelf: 'flex-start',
    marginLeft: 10,
    fontWeight: 'bold',
  },
});
