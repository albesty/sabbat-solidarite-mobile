import React from 'react';
import { IconButton } from 'react-native-paper';
import { colors } from '../../utils/styles';

export default function AppIconButton({
  icon = 'plus',
  color = colors.white,
  size = 30,
  ...other
}) {
  return <IconButton icon={icon} color={color} size={size} {...other} />;
}
