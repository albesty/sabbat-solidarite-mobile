import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import AppText from './AppText';
import { colors } from '../../utils/styles';

export default function AppWaitInfo({ info }) {
  return (
    <View style={styles.info}>
      <AppText style={styles.text}>{info}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  info: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    opacity: 0.5,
    zIndex: 999,
    elevation: 10,
  },
  text: {
    fontSize: 15,
  },
});
