import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
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
