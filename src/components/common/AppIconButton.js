import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { colors } from '../../utils/styles';
import AppText from './AppText';

export default function AppIconButton({
  icon = 'plus',
  color = colors.white,
  size = 30,
  info,
  showInfo = true,
  ...other
}) {
  return (
    <>
      <IconButton icon={icon} color={color} size={size} {...other} />
      {showInfo && info > 0 && <AppText style={styles.info}>{info}</AppText>}
    </>
  );
}

const styles = StyleSheet.create({
  info: {
    position: 'absolute',
    left: -2,
    bottom: 5,
    fontSize: 15,
  },
});
