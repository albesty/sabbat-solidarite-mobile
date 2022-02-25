import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { fonts, sizes } from '../../utils/styles';

export default function AppText({ style, children, ...otherStyle }) {
  return (
    <Text style={[styles.text, style]} {...otherStyle}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: fonts.contentFont,
    fontSize: sizes.contentSise,
  },
});
