import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import AppText from './AppText';
import AppIconButton from './AppIconButton';
import { colors } from '../../utils/styles';

export default function RadioButtonWithLabel({ onPress, children, label, onSelectButton }) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.contentContainer}>
        <View style={styles.buttonContainer}>
          {onSelectButton && <AppIconButton size={20} icon="circle" color={colors.or} />}
        </View>
        <View style={styles.flagInfoContainer}>
          <AppText style={styles.label}>{label}</AppText>
          <View style={styles.moneyFlagContainer}>{children}</View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 20,
  },
  flagInfoContainer: {
    marginLeft: 20,
  },
  moneyFlagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontWeight: 'bold',
  },
});
