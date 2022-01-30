import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { TextInput } from 'react-native-paper';

export default function AppInput({ ...other }) {
  return <TextInput autoCapitalize="none" mode="flat" {...other} />;
}
