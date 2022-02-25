import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import AppText from './AppText';
import { colors } from '../../utils/styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function NetworkInfo({ closeNetInfo }) {
  return (
    <View style={styles.container}>
      <AppText style={styles.netinfo}>Il semble que vous n'avez pas d'accès internet.</AppText>
      <View style={styles.closeContainer}>
        <TouchableOpacity onPress={closeNetInfo}>
          <MaterialCommunityIcons name="close" color={colors.bleuFbi} size={25} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  closeContainer: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
  },
  netinfo: {
    color: colors.rougeBordeau,
    fontSize: 15,
  },
});
