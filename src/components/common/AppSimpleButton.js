import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppText from './AppText';
import { colors } from '../../utils/styles';
export default function AppSimpleButton({
  label,
  onPress,
  icon,
  labelStyle,
  containerStyle,
  size = 25,
  color = colors.bleuFbi,
}) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, containerStyle]}>
      <MaterialCommunityIcons name={icon} size={size} color={color} />
      <AppText style={[styles.label, labelStyle]}>{label}</AppText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  label: {
    color: colors.bleuFbi,
    marginLeft: 10,
  },
});
