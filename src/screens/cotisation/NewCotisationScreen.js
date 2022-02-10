import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { useContext, useState } from 'react';
import * as Yup from 'yup';
import { AppForm, AppFormField, AppSubmitButton } from '../../components/form';
import dayjs from 'dayjs';
import AppTimePicker from '../../components/common/AppTimePicker';
import AppSpacer from '../../components/common/AppSpacer';
import AppActivityIndicator from '../../components/common/AppActivityIndicator';
import { SelectedAssociationContext } from '../../contexts/SelectedAssociationContext';
import { addCotisation } from '../../api/services/selectedAssociationServices';
import { selectedAssoActions } from '../../reducers/selectedAssociationReducer';

const validCotisation = Yup.object().shape({
  typeCotisation: Yup.string(),
  montant: Yup.number().typeError('Montant incorrect').required('Indiquez un montant'),
  motif: Yup.string().min(5, 'Donnez un motif explicatif'),
  dateDebut: Yup.date(),
  dateFin: Yup.date(),
});

export default function NewCotisationScreen() {
  const { selectedAssoState, dispatchSelectedAsso } = useContext(SelectedAssociationContext);
  const [loading, setLoading] = useState(false);

  const handleSaveCotisation = async (data) => {
    setLoading(true);
    const debut = data.dateDebut.getTime();
    const fin = data.dateFin.getTime();
    const cotisData = {
      typeCotisation: data.typeCotisation,
      montant: data.montant,
      motif: data.motif,
      dateDebut: debut,
      dateFin: fin,
      associationId: selectedAssoState.selectedAssociation.id,
    };

    const response = await addCotisation(cotisData);
    if (!response.ok) {
      setLoading(false);
      alert("Impossible d'ajouter la cotisation");
      return;
    }
    dispatchSelectedAsso({ type: selectedAssoActions.add_cotisation, cotisation: response.data });
    setLoading(false);
    alert('La cotisation a été ajoutée avec succès.');
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <AppForm
          initialValues={{
            typeCotisation: '',
            montant: '',
            motif: '',
            dateDebut: new Date(),
            dateFin: new Date(),
          }}
          validationSchema={validCotisation}
          onSubmit={handleSaveCotisation}
        >
          <AppFormField name="typeCotisation" label="Type cotisation" />
          <AppSpacer />
          <AppFormField keyboardType="numeric" label="Montant" name="montant" />
          <AppSpacer />
          <AppFormField label="Motif" name="motif" />
          <AppSpacer />
          <AppTimePicker name="dateDebut" label="Date debut" />
          <AppSpacer />
          <AppTimePicker name="dateFin" label="Date fin" />
          <AppSpacer />
          <AppSubmitButton title="Ajouter" />
        </AppForm>
      </ScrollView>
      {loading && <AppActivityIndicator />}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    marginHorizontal: 20,
  },
});
