import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Button } from 'react-native-paper';
import { colors } from '../../utils/styles';

export default function AppButton({
  title,
  mode = 'contained',
  color = colors.bleuFbi,
  style,
  labelStyle,
  ...other
}) {
  return (
    <Button
      color={color}
      mode={mode}
      style={[styles.buttonStyle, style]}
      labelStyle={[styles.label, labelStyle]}
      {...other}
    >
      {title}
    </Button>
  );
}

const styles = StyleSheet.create({
  buttonStyle: {
    width: '100%',
    minWidth: '50%',
  },
  label: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
