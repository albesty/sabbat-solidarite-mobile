import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { colors } from '../../utils/styles';

export default function AppActivityIndicator({ containerStyle, indicatorStyle }) {
  return (
    <View style={[styles.mainContainer, containerStyle]}>
      <View style={styles.container}>
        <ActivityIndicator
          style={indicatorStyle}
          animating={true}
          color={colors.rougeBordeau}
          size="large"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    top: '50%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  mainContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: colors.white,
    opacity: 0.5,
  },
});
