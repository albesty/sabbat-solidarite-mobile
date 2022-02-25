import React from 'react';
import { StyleSheet } from 'react-native';
import AppText from '../common/AppText';
import { colors } from '../../utils/styles';

export default function ErrorMessage({ error, visible }) {
  if (!error || !visible) return null;
  return <AppText style={styles.error}>{error}</AppText>;
}

const styles = StyleSheet.create({
  error: {
    color: colors.rouge,
    backgroundColor: colors.white,
    padding: 5,
  },
});
