import { StyleSheet, Text, View } from 'react-native';
import React, { useContext, useState } from 'react';
import * as Yup from 'yup';
import { AppForm, AppFormField, AppSubmitButton } from '../../components/form';
import AppActivityIndicator from '../../components/common/AppActivityIndicator';
import { createAssociation } from '../../api/services/associationServices';
import { AuthContext } from '../../contexts/AuthContext';
import { associationReducer, associationsActions } from '../../reducers/associationReducer';
import { AssociationContext } from '../../contexts/AssociationContext';

const validAssociation = Yup.object().shape({
  nom: Yup.string().required('Donnez un nom à votre association.'),
  description: Yup.string(),
  telAdmin: Yup.string().required('Le contact administrateur est requis.'),
  cotisationMensuelle: Yup.number('Vous devez choisir un nombre valide').required(
    'Indiquez votre cotisation mensuelle.'
  ),
  frequenceCotisation: Yup.string().required(
    'Indiquez à quel interval de temps vous allez pourvoir cotiser.'
  ),
});

export default function NewAssociationScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { state } = useContext(AuthContext);
  const { dispatch } = useContext(AssociationContext);

  const handleSaveAssociation = async (data, { resetForm }) => {
    const userId = state.user.id;
    const formatData = {
      ...data,
      cotisationMensuelle: Number(data.cotisationMensuelle),
      creatorId: userId,
    };
    setError(null);
    setLoading(true);
    const response = await createAssociation(formatData);
    console.log(response);
    if (!response.ok) {
      setError(response.data?.message);
      setLoading(false);
      return;
    }
    dispatch({ type: associationsActions.ADD_NEW, association: response.data });
    setLoading(false);
  };

  return (
    <>
      <AppForm
        initialValues={{
          nom: '',
          description: '',
          telAdmin: '',
          cotisationMensuelle: '',
          frequenceCotisation: '',
        }}
        validationSchema={validAssociation}
        onSubmit={handleSaveAssociation}
      >
        <AppFormField name="nom" label="nom ou sigle" />
        <AppFormField name="description" label="decrivez amplement votre association" />
        <AppFormField name="telAdmin" label="contact de l'administrateur" />
        <AppFormField name="cotisationMensuelle" label="cotisation mensuelle" />
        <AppFormField name="frequenceCotisation" label="frequence de cotisation" />
        <AppSubmitButton title="Valider" />
      </AppForm>
      {loading && <AppActivityIndicator />}
    </>
  );
}

const styles = StyleSheet.create({});
