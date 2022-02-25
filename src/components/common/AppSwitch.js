import React from 'react';
import { StyleSheet, View, Switch } from 'react-native';
import { colors } from '../../utils/styles';

export default function AppSwitch({ isEnabled, toggleSwitch }) {
  return (
    <View style={styles.container}>
      <Switch
        trackColor={{ false: '#767577', true: colors.bleuFbi }}
        thumbColor={isEnabled ? colors.or : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
