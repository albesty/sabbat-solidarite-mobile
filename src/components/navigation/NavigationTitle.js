import React from 'react';
import { StyleSheet } from 'react-native';
import AppText from '../common/AppText';
import { colors, fonts, sizes } from '../../utils/styles';

export default function NavigationTitle({ title }) {
  return <AppText style={styles.title}>{title}</AppText>;
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.titleFont,
    fontSize: sizes.titleSize,
    color: colors.white,
  },
});
