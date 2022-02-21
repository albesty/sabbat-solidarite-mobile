import { StyleSheet, Text, View } from 'react-native';
import React, { useContext, useState } from 'react';
import * as Yup from 'yup';
import { AppForm, AppFormField, AppSubmitButton } from '../../components/form';
import AppActivityIndicator from '../../components/common/AppActivityIndicator';
import { createAssociation } from '../../api/services/associationServices';
import { AuthContext } from '../../contexts/AuthContext';
import { associationsActions } from '../../reducers/associationReducer';
import { AssociationContext } from '../../contexts/AssociationContext';
import AppSpacer from '../../components/common/AppSpacer';
import { actions } from '../../reducers/authReducer';
import { ScrollView } from 'react-native-gesture-handler';
import useAuth from '../../hooks/useAuth';
import AppText from '../../components/common/AppText';
import AppSwitch from '../../components/common/AppSwitch';

const validAssociation = Yup.object().shape({
  nom: Yup.string().required('Donnez un nom à votre association.'),
  description: Yup.string(),
  telAdmin: Yup.string().required('Le contact administrateur est requis.'),
  cotisationMensuelle: Yup.number(),
  frequenceCotisation: Yup.string(),
  fondInitial: Yup.number(),
  seuilSecurite: Yup.number(),
  statut: Yup.string(),
  interetCredit: Yup.number(),
  validatorsNumber: Yup.number(),
  penality: Yup.number(),
  individualQuotite: Yup.number(),
});

export default function NewAssociationScreen({ route }) {
  const selectedParam = route.params;
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { state, dispatch } = useContext(AuthContext);
  const { associationDispatch } = useContext(AssociationContext);
  const [isValid, setIsValid] = useState(selectedParam?.isValid || false);

  const handleValidateAssociation = () => {
    setIsValid(!isValid);
  };

  const handleSaveAssociation = async (data, { resetForm }) => {
    const userId = state.user.id;
    const id = selectedParam ? selectedParam.id : null;
    const formatData = {
      ...data,
      id,
      creatorId: userId,
      cotisationMensuelle: Number(data.cotisationMensuelle),
      fondInitial: Number(data.fondInitial),
      seuilSecurite: Number(data.seuilSecurite),
      interetCredit: Number(data.interetCredit),
      validation: Number(data.validatorsNumber),
      penality: Number(data.penality),
      individualQuotite: Number(data.individualQuotite),
      validation: isValid,
    };
    setError(null);
    setLoading(true);
    const response = await createAssociation(formatData);
    if (!response.ok) {
      setError(response.data?.message);
      setLoading(false);
      alert("Désolé, nous n'avons pas pu créer votre association, veuillez reessayer plutard.");
      return;
    }
    resetForm();
    associationDispatch({ type: associationsActions.ADD_NEW, association: response.data });
    dispatch({ type: actions.update_state, updateState: true });
    setLoading(false);
    alert(
      'Félicitation, votre association a été créée avec succès et est encours de validation. Nous vous contacterons sous peu pour finaliser le processus.'
    );
  };

  return (
    <ScrollView style={styles.mainContainer}>
      <AppForm
        initialValues={{
          nom: selectedParam ? selectedParam.nom : '',
          description: selectedParam ? selectedParam.description : '',
          telAdmin: selectedParam ? selectedParam.telAdmin : '',
          cotisationMensuelle: selectedParam ? String(selectedParam.cotisationMensuelle) : '',
          frequenceCotisation: selectedParam ? selectedParam.frequenceCotisation : '',
          fondInitial: selectedParam ? String(selectedParam.fondInitial) : '',
          seuilSecurite: selectedParam ? String(selectedParam.seuilSecurite) : '',
          statut: selectedParam ? selectedParam.statut : '',
          interetCredit: selectedParam ? String(selectedParam.interetCredit) : '',
          validatorsNumber: selectedParam ? String(selectedParam.validationLenght) : '',
          penality: selectedParam ? String(selectedParam.penality) : '',
          individualQuotite: selectedParam ? String(selectedParam.individualQuotite) : '',
        }}
        validationSchema={validAssociation}
        onSubmit={handleSaveAssociation}
      >
        <View style={styles.container}>
          <AppFormField autoCapitalize="characters" name="nom" label="nom ou sigle" />
          <AppSpacer />
          <AppFormField name="description" label="Description" />
          <AppSpacer />
          <AppFormField
            keyboardType="numeric"
            name="telAdmin"
            label="contact de l'administrateur"
          />
          <AppSpacer />

          {isAdmin() && (
            <View>
              <AppFormField
                keyboardType="numeric"
                name="cotisationMensuelle"
                label="Montant cotisation"
              />
              <AppSpacer />
              <AppFormField name="frequenceCotisation" label="Fréquence cotisation" />
              <AppSpacer />
              <AppFormField keyboardType="numeric" name="fondInitial" label="Fonds initial" />
              <AppSpacer />
              <AppFormField keyboardType="numeric" name="seuilSecurite" label="Seuil de sécurité" />
              <AppSpacer />
              <AppFormField name="statut" label="Statut" />
              <AppSpacer />
              <AppFormField keyboardType="numeric" name="interetCredit" label="Intérêt crédit" />
              <AppSpacer />
              <AppFormField
                keyboardType="numeric"
                name="validatorsNumber"
                label="Nombre validateurs"
              />
              <AppSpacer />
              <AppFormField keyboardType="numeric" name="penality" label="Pénalité sur retard" />
              <AppSpacer />
              <AppFormField
                keyboardType="numeric"
                name="individualQuotite"
                label="Qutotité individuelle"
              />
              <AppSpacer />
              <View style={styles.isValidContainer}>
                <AppText>Is Valid?</AppText>
                <AppSwitch isEnabled={isValid} toggleSwitch={handleValidateAssociation} />
              </View>
            </View>
          )}
          <AppSpacer />
          <AppSubmitButton title="Valider" />
          <AppSpacer />
        </View>
      </AppForm>
      {loading && <AppActivityIndicator />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    marginHorizontal: 20,
  },
  mainContainer: {
    paddingBottom: 80,
  },
  loading: {
    bottom: 100,
  },
  isValidContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
