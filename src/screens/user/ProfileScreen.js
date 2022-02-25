import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import AppLabelValueAction from '../../components/common/AppLabelValueAction';

export default function ProfileScreen({ route }) {
  const selectedUser = route.params;
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
      <AppLabelValueAction currentUser={selectedUser} label="Pseudo" />
      <AppLabelValueAction currentUser={selectedUser} label="Nom" />
      <AppLabelValueAction currentUser={selectedUser} label="Prenom" />
      <AppLabelValueAction currentUser={selectedUser} label="Phone" />
      <AppLabelValueAction currentUser={selectedUser} label="Adresse" />
      <AppLabelValueAction currentUser={selectedUser} label="profession" />
      <AppLabelValueAction currentUser={selectedUser} label="Emploi" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    marginHorizontal: 10,
  },
});
