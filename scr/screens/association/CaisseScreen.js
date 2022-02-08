import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import AssociationCard from '../../components/association/AssociationCard';

export default function CaisseScreen({ route }) {
  const selectedAssociation = route.params;
  return (
    <>
      <AssociationCard
        cardStyle={{
          width: '100%',
          margin: 0,
        }}
        showActions={false}
        association={selectedAssociation}
      />
    </>
  );
}

const styles = StyleSheet.create({});
