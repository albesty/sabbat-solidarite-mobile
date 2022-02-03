import { StyleSheet, Text, View, TouchableWithoutFeedback } from 'react-native';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../utils/styles';

export default function HeaderButton({ style, icon = 'chevron-left', onPress }) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={style}>
        <MaterialCommunityIcons name={icon} size={35} color={colors.white} />
      </View>
    </TouchableWithoutFeedback>
  );
}
