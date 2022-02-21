import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { useContext, useState } from 'react';
import * as Yup from 'yup';
import { AppForm, AppFormField, AppSubmitButton } from '../../components/form';
import AppActivityIndicator from '../../components/common/AppActivityIndicator';
import { updateInfo } from '../../api/services/memberServices';
import { SelectedAssociationContext } from '../../contexts/SelectedAssociationContext';
import { selectedAssoActions } from '../../reducers/selectedAssociationReducer';
import AppSpacer from '../../components/common/AppSpacer';

const validInfo = Yup.object().shape({
  statut: Yup.string(),
  relation: Yup.string(),
});
export default function EditMemberScreen({ route }) {
  const selectedMember = route.params;
  const { dispatchSelectedAsso } = useContext(SelectedAssociationContext);
  const [loading, setLoading] = useState(false);

  const handleSaveInfo = async (info, { resetForm }) => {
    const data = {
      currentMemberId: selectedMember.member.id,
      statut: info.statut,
      relation: info.relation ? info.relation : null,
    };
    setLoading(true);
    const response = await updateInfo(data);
    if (!response.ok) {
      setLoading(false);
      alert('Impossible de mettre les infos à jour.');
      return;
    }
    dispatchSelectedAsso({ type: selectedAssoActions.update_member, member: response.data });
    setLoading(false);
    alert('Infos mises à jour avec succès.');
    resetForm();
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.contentContainerStyle}>
        <AppForm
          validationSchema={validInfo}
          initialValues={{
            statut: '',
            relation: '',
          }}
          onSubmit={handleSaveInfo}
        >
          <AppFormField name="statut" />
          <AppSpacer />
          <AppFormField name="relation" />
          <AppSpacer />
          <AppSubmitButton title="Valide" />
          <AppSpacer />
        </AppForm>
      </ScrollView>
      {loading && <AppActivityIndicator />}
    </>
  );
}

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingVertical: 30,
    marginHorizontal: 20,
  },
});
