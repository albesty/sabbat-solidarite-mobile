import { StyleSheet, Text, View, TouchableWithoutFeedback } from 'react-native';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../utils/styles';
import AppText from '../common/AppText';

export default function HeaderButton({ style, icon = 'chevron-left', title, onPress }) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[styles.container, style]}>
        {icon && <MaterialCommunityIcons name={icon} size={35} color={colors.white} />}
        {title && <AppText style={styles.headerText}>{title}</AppText>}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  headerText: {
    color: colors.white,
  },
});
