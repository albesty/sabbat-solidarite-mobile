import { StyleSheet, Text, View, TouchableWithoutFeedback } from 'react-native';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../utils/styles';

export default function BackButton({ onPress }) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <MaterialCommunityIcons name="chevron-left" size={35} color={colors.white} />
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({});
