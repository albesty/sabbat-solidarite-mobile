import { StyleSheet, Text, View } from 'react-native';
import React, { useContext, useState } from 'react';
import * as Yup from 'yup';
import { AppForm, AppFormField, AppSubmitButton } from '../../components/form';
import AppTimePicker from '../../components/common/AppTimePicker';
import { ScrollView } from 'react-native-gesture-handler';
import AppSpacer from '../../components/common/AppSpacer';
import RadioButtonWithLabel from '../../components/common/RadioButtonWithLabel';
import { SelectedAssociationContext } from '../../contexts/SelectedAssociationContext';
import AppActivityIndicator from '../../components/common/AppActivityIndicator';
import { addEngement } from '../../api/services/engagementServices';
import { selectedAssoActions } from '../../reducers/selectedAssociationReducer';
import useSelectedAssociation from '../../hooks/useSelectedAssociation';

const validEngagement = Yup.object().shape({
  motif: Yup.string().required('Le motif requis.'),
  montant: Yup.number().typeError('Montant incorrect').required('Ajouter un montant.'),
  echeance: Yup.date().required('Date echeance requis'),
});
export default function NewEngementScreen() {
  const { selectedAssoState, dispatchSelectedAsso } = useContext(SelectedAssociationContext);
  const [engagementType, setEngagementType] = useState('');
  const [rembourseSelected, setRembourseSelected] = useState(false);
  const [nonRembourseSelected, setNonRembourseSelected] = useState(false);
  const [loading, setLoading] = useState(false);
  const { getSelectedAssociationFundInfos } = useSelectedAssociation();

  const handleSaveEngagement = async (value, { resetForm }) => {
    if (getSelectedAssociationFundInfos().quotiteAmount < Number(value.montant)) {
      alert("Il n'y a pas suffisament de fonds pour cet engagement.");
      return;
    }
    setLoading(true);
    const data = {
      typeEngagement: engagementType,
      libelle: value.motif,
      echeance: value.echeance,
      montant: value.montant,
      memberId: selectedAssoState.connectedMember.member.id,
      associationId: selectedAssoState.selectedAssociation.id,
    };
    const response = await addEngement(data);
    if (!response.ok) {
      setLoading(false);
      alert('Impossible de valider votre engagement.');
      return;
    }
    dispatchSelectedAsso({ type: selectedAssoActions.add_engagement, engagement: response.data });
    setLoading(false);
    resetForm();
    alert('Votre engagement a été ajouté avec succès.');
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.contentContainerStyle}>
        <View>
          <RadioButtonWithLabel
            onSelectButton={rembourseSelected}
            onPress={() => {
              setNonRembourseSelected(false);
              setRembourseSelected(!rembourseSelected);
              setEngagementType('remboursable');
            }}
            label="Remboursable"
          />
          <RadioButtonWithLabel
            onSelectButton={nonRembourseSelected}
            onPress={() => {
              setRembourseSelected(false);
              setNonRembourseSelected(!nonRembourseSelected);
              setEngagementType('non remboursable');
            }}
            label="Non remboursable"
          />
        </View>
        <AppSpacer />
        <AppForm
          initialValues={{
            motif: '',
            montant: '',
            echeance: new Date(),
          }}
          validationSchema={validEngagement}
          onSubmit={handleSaveEngagement}
        >
          <AppFormField name="motif" label="Motif" />
          <AppSpacer />
          <AppFormField keyboardType="numeric" name="montant" label="Montant" />
          <AppSpacer />
          <AppTimePicker name="echeance" label="Date echeance" />
          <AppSpacer />
          <AppSpacer />
          <AppSubmitButton title="Valider" />
        </AppForm>
      </ScrollView>
      {loading && <AppActivityIndicator />}
    </>
  );
}

const styles = StyleSheet.create({
  contentContainerStyle: {
    marginHorizontal: 10,
    paddingVertical: 20,
  },
});
