import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import AppLabelValueAction from '../../components/common/AppLabelValueAction';

export default function ProfileScreen() {
  const { state } = useContext(AuthContext);
  const user = state.user;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AppLabelValueAction label="Pseudo" />
      <AppLabelValueAction label="Nom" />
      <AppLabelValueAction label="Prenom" />
      <AppLabelValueAction label="Phone" />
      <AppLabelValueAction label="Adresse" />
      <AppLabelValueAction label="profession" />
      <AppLabelValueAction label="Emploi" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    marginHorizontal: 10,
  },
});
