import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../../utils/styles';
import AppIconButton from './AppIconButton';
import AppText from './AppText';

export default function AddNewButton({
  style,
  notifStyle,
  onPress,
  notif = 0,
  icon = 'plus',
  ...other
}) {
  return (
    <View>
      <View style={[styles.container, style]}>
        <AppIconButton icon={icon} size={40} onPress={onPress} {...other} />

        {notif > 0 && (
          <View style={[styles.notif, notifStyle]}>
            <AppText style={styles.notifText}>{notif}</AppText>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    height: 60,
    width: 60,
    borderRadius: 30,
    bottom: 20,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bleuFbi,
    zIndex: 999,
  },
  notif: {
    position: 'absolute',
    right: -10,
    top: -10,
    height: 30,
    width: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.rougeBordeau,
  },
  notifText: {
    fontSize: 13,
    color: colors.white,
  },
});
