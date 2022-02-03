import { StyleSheet, View } from 'react-native';
import React from 'react';
import { colors } from '../../utils/styles';
import AppIconButton from './AppIconButton';

export default function AddNewButton({ style, onPress, icon = 'plus', ...other }) {
  return (
    <View style={styles.container}>
      <AppIconButton size={35} onPress={onPress} {...other} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    height: 60,
    width: 60,
    borderRadius: 30,
    bottom: 20,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bleuFbi,
  },
});
