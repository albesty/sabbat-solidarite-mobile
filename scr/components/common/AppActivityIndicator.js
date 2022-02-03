import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { ActivityIndicator } from 'react-native-paper';
import { colors } from '../../utils/styles';

export default function AppActivityIndicator({ containerStyle }) {
  return (
    <View style={[styles.mainContainer, containerStyle]}>
      <View style={styles.container}>
        <ActivityIndicator animating={true} color={colors.rougeBordeau} size="large" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    top: '50%',
    alignSelf: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  mainContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: colors.white,
    opacity: 0.5,
  },
});
