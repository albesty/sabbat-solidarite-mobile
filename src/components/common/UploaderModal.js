import { StyleSheet, View } from 'react-native';
import React from 'react';
import { ProgressBar } from 'react-native-paper';
import { colors } from '../../utils/styles';
import AppAnimation from './AppAnimation';

export default function UploaderModal({ style, progress }) {
  return (
    <View style={[styles.animation, style]}>
      <AppAnimation />
      <View>
        <ProgressBar style={{ width: 150, height: 5 }} progress={progress} color={colors.bleuFbi} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  animation: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    backgroundColor: colors.white,
    opacity: 0.8,
    zIndex: 999,
  },
});
